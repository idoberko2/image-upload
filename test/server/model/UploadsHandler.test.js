const UploadsHandler = require('../../../model/UploadsHandler');

const defaultS3Env = {
    S3_ACCESS_KEY: 'test_key',
    S3_UPLOADS_BUCKET: 'test_bucket',
    S3_ACCESS_SECRET: 'test_secret',
    S3_PUBLIC_PATH: 'test_public',
};

describe('UploadsHandler', () => {
    const processImage = jest.fn();
    const storeExternally = jest.fn((image, collection, name) => name);
    const generateStorageFunction = jest.fn(() => storeExternally);
    const storeLocally = jest.fn();
    const registerUpload = jest.fn();

    describe('selects storage method properly', () => {
        const originalInfo = console.info;

        beforeEach(() => {
            jest.resetModules();
            console.info = jest.fn();
        });

        afterEach(() => {
            console.info = originalInfo;
        });

        test('should store locally when S3_ACCESS_KEY is unset', () => {
            const { S3_ACCESS_KEY, ...newEnv } = defaultS3Env;
            process.env = {
                ...newEnv,
            };

            const uploader = new UploadsHandler(
                processImage,
                generateStorageFunction,
                storeLocally,
                registerUpload
            );
            expect(console.info).toHaveBeenCalledWith(
                'Using local storage as the storage service'
            );
        });

        test('should store locally when S3_ACCESS_SECRET is unset', () => {
            const { S3_ACCESS_SECRET, ...newEnv } = defaultS3Env;
            process.env = {
                ...newEnv,
            };
            const uploader = new UploadsHandler(
                processImage,
                generateStorageFunction,
                storeLocally,
                registerUpload
            );
            expect(console.info).toHaveBeenCalledWith(
                'Using local storage as the storage service'
            );
        });

        test('should store locally when S3_UPLOADS_BUCKET is unset', () => {
            const { S3_UPLOADS_BUCKET, ...newEnv } = defaultS3Env;
            process.env = {
                ...newEnv,
            };
            const uploader = new UploadsHandler(
                processImage,
                generateStorageFunction,
                storeLocally,
                registerUpload
            );
            expect(console.info).toHaveBeenCalledWith(
                'Using local storage as the storage service'
            );
        });

        test('should store locally when S3_PUBLIC_PATH is unset', () => {
            const { S3_PUBLIC_PATH, ...newEnv } = defaultS3Env;
            process.env = {
                ...newEnv,
            };
            const uploader = new UploadsHandler(
                processImage,
                generateStorageFunction,
                storeLocally,
                registerUpload
            );
            expect(console.info).toHaveBeenCalledWith(
                'Using local storage as the storage service'
            );
        });

        test('should use external storage when the configuration is set', () => {
            process.env = {
                ...process.env,
                ...defaultS3Env,
            };
            const uploader = new UploadsHandler(
                processImage,
                generateStorageFunction,
                storeLocally,
                registerUpload
            );
            expect(console.info).toHaveBeenCalledWith(
                'Using S3 as the storage service'
            );
        });
    });

    test('uploads correctly', async done => {
        process.env = {
            ...process.env,
            ...defaultS3Env,
            MAX_CONCURRENT_UPLOADS: 1,
        };
        const removeTempFile = jest.fn();
        const dummyBaseUrl = 'http://test.katamon.com';
        const dummyCollection = 'test_collection';
        const dummySeason = '2018-2019';
        const dummyGalleryName = 'שם הגלריה';
        const dummyPhotographer = 'test_photographer';
        const dummyFiles = [
            {
                mimetype: 'image/png',
                originalname: 'test1.png',
                path: '/tmp/test1.png',
            },
            {
                mimetype: 'image/png',
                originalname: 'test2.png',
                path: '/tmp/test2.png',
            },
        ];

        const uploader = new UploadsHandler(
            processImage,
            generateStorageFunction,
            storeLocally,
            registerUpload,
            removeTempFile
        );

        await uploader.upload(
            dummyBaseUrl,
            dummyCollection,
            dummySeason,
            dummyGalleryName,
            dummyPhotographer,
            dummyFiles
        );

        expect(storeExternally).toBeCalledTimes(dummyFiles.length);
        expect(processImage).toBeCalledTimes(dummyFiles.length);
        expect(removeTempFile).toBeCalledTimes(dummyFiles.length);
        expect(storeLocally).not.toBeCalled();
        expect(registerUpload).toBeCalledTimes(1);
        expect(registerUpload).toBeCalledWith(
            dummyCollection,
            dummyGalleryName,
            dummySeason,
            dummyPhotographer,
            dummyFiles.map(file => file.originalname)
        );

        done();
    });
});
