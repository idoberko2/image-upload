const fs = require('fs');

const fsUnlink = path =>
    new Promise((resolve, reject) => {
        fs.unlink(path, err => {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });

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
            removeTempFile === null ? fsUnlink : removeTempFile;
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
                }
            );

            await this.removeTempFile(path);

            return storagePath;
        });

        const urls = await Promise.all(promises);

        await this.registerUpload(
            collection,
            galleryName,
            season,
            photographer,
            urls
        );

        console.info({ urls });

        return urls;
    }
}

module.exports = UploadsHandler;
