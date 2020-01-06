const fsPromises = require('fs').promises;

async function* uploadsGenerator(maxConcurrent, promises) {
    let offset = 0;

    while (offset < promises.length) {
        if (offset + maxConcurrent < promises.length) {
            yield promises.slice(offset, offset + maxConcurrent);
        } else {
            yield promises.slice(offset, promises.length);
        }

        offset += maxConcurrent
    }
}

class UploadsHandler {
    constructor(
        processImage,
        generateStorageFunction,
        storeLocally,
        registerUpload,
        removeTempFile = null
    ) {
        this.processImage = processImage;
        this.store = this.selectStorageFunction(
            generateStorageFunction,
            storeLocally
        );
        this.registerUpload = registerUpload;
        this.removeTempFile =
            removeTempFile === null ? fsPromises.unlink : removeTempFile;
        this.maxConcurrent = process.env.MAX_CONCURRENT_UPLOADS || 30;
    }

    static isStoringExternally() {
        const {
            S3_ACCESS_KEY,
            S3_ACCESS_SECRET,
            S3_UPLOADS_BUCKET,
            S3_PUBLIC_PATH,
        } = process.env;

        return (
            S3_ACCESS_KEY &&
            S3_ACCESS_SECRET &&
            S3_UPLOADS_BUCKET &&
            S3_PUBLIC_PATH
        );
    }

    static getLocalStoragePublicPath() {
        return this.isStoringExternally() ? 'uploadedFiles' : null;
    }

    selectStorageFunction(generateStorageFunction, storeLocally) {
        if (this.constructor.isStoringExternally()) {
            const {
                S3_ACCESS_KEY,
                S3_ACCESS_SECRET,
                S3_UPLOADS_BUCKET,
                S3_PUBLIC_PATH,
            } = process.env;
            console.info('Using S3 as the storage service');

            return generateStorageFunction(
                S3_ACCESS_KEY,
                S3_ACCESS_SECRET,
                S3_UPLOADS_BUCKET,
                S3_PUBLIC_PATH
            );
        }

        console.info('Using local storage as the storage service');
        return storeLocally;
    }

    async upload(
        baseUrl,
        collection,
        season,
        galleryName,
        photographer,
        files
    ) {
        const promises = files.map(async file => {
            const { mimetype, originalname, path } = file;

            const storagePath = await this.store(
                await this.processImage(path),
                collection,
                originalname,
                {
                    prefix: `${baseUrl}/${this.constructor.getLocalStoragePublicPath()}`,
                    mimetype,
                    season,
                }
            );

            await this.removeTempFile(path);

            return storagePath;
        });

        console.info(`Uploading ${promises.length} files...`);

        let urls = [];

        for await (const part of uploadsGenerator(this.maxConcurrent, promises)) {
            urls = [
                ...urls,
                ... await Promise.all(part)
            ]
            console.info(`Uploaded ${urls.length} files. Moving forward...`)
        }

        console.info(`Successfully uploaded ${promises.length} files.`);
        console.info('Registering the upload in the external service...');

        await this.registerUpload(
            collection,
            galleryName,
            season,
            photographer,
            urls
        );

        console.info(
            'Successfully registered the upload in the external service.'
        );
        console.info({ urls });

        return urls;
    }
}

module.exports = UploadsHandler;
