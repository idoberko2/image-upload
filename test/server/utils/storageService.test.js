describe('storageService', () => {
    const originalInfo = console.info;

    beforeEach(() => {
        jest.resetModules();
        console.info = jest.fn();
    });

    afterEach(() => {
        console.info = originalInfo;
    });

    const defaultS3Env = {
        S3_ACCESS_KEY: 'test_key',
        S3_UPLOADS_BUCKET: 'test_bucket',
        S3_ACCESS_SECRET: 'test_secret',
        S3_PUBLIC_PATH: 'test_public',
    };

    test('should store locally when S3_ACCESS_KEY is unset', () => {
        const { S3_ACCESS_KEY, ...newEnv } = defaultS3Env;
        process.env = {
            ...newEnv,
        };

        const storageService = require('../../../utils/storageService');
        expect(console.info).toHaveBeenCalledWith(
            'Using local storage as the storage service'
        );
        expect(storageService.isLocal).toBeTruthy();
        expect(storageService.isExternal).toBeFalsy();
    });

    test('should store locally when S3_ACCESS_SECRET is unset', () => {
        const { S3_ACCESS_SECRET, ...newEnv } = defaultS3Env;
        process.env = {
            ...newEnv,
        };
        const storageService = require('../../../utils/storageService');
        expect(console.info).toHaveBeenCalledWith(
            'Using local storage as the storage service'
        );
        expect(storageService.isLocal).toBeTruthy();
        expect(storageService.isExternal).toBeFalsy();
    });

    test('should store locally when S3_UPLOADS_BUCKET is unset', () => {
        const { S3_UPLOADS_BUCKET, ...newEnv } = defaultS3Env;
        process.env = {
            ...newEnv,
        };
        const storageService = require('../../../utils/storageService');
        expect(console.info).toHaveBeenCalledWith(
            'Using local storage as the storage service'
        );
        expect(storageService.isLocal).toBeTruthy();
        expect(storageService.isExternal).toBeFalsy();
    });

    test('should store locally when S3_PUBLIC_PATH is unset', () => {
        const { S3_PUBLIC_PATH, ...newEnv } = defaultS3Env;
        process.env = {
            ...newEnv,
        };
        const storageService = require('../../../utils/storageService');
        expect(console.info).toHaveBeenCalledWith(
            'Using local storage as the storage service'
        );
        expect(storageService.isLocal).toBeTruthy();
        expect(storageService.isExternal).toBeFalsy();
    });

    test('should use external storage when the configuration is set', () => {
        process.env = {
            ...process.env,
            ...defaultS3Env,
        };
        const storageService = require('../../../utils/storageService');
        expect(console.info).toHaveBeenCalledWith(
            'Using S3 as the storage service'
        );
        expect(storageService.isLocal).toBeFalsy();
        expect(storageService.isExternal).toBeTruthy();
    });

    test('should call S3 sdk correctly', async () => {
        const uploaderFn = jest.fn();
        const generateStorageFunction = require('../../../utils/storeExternally');
        const storeExternally = generateStorageFunction(
            'S3_ACCESS_KEY',
            'S3_ACCESS_SECRET',
            'S3_UPLOADS_BUCKET',
            'S3_PUBLIC_PATH',
            uploaderFn
        );

        const image = new File(['test'], 'testFile.png');
        const result = await storeExternally(
            image,
            'collection',
            'filename.png',
            { mimetype: 'image/png' }
        );
        expect(uploaderFn).toBeCalledWith('collection/filename.png', image);
        expect(result).toBe('S3_PUBLIC_PATH/collection/filename.png');
    });
});
