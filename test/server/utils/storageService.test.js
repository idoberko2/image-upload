describe('storageService', () => {
    beforeEach(jest.resetModules);

    test('should store locally when S3_ACCESS_KEY is unset', () => {
        const { S3_ACCESS_KEY, ...newEnv } = process.env;
        process.env = {
            ...newEnv,
        };
        const storageService = require('../../../utils/storageService');
        expect(storageService.isLocal).toBeTruthy();
        expect(storageService.isExternal).toBeFalsy();
    });

    test('should store locally when S3_SECRET_KEY is unset', () => {
        const { S3_SECRET_KEY, ...newEnv } = process.env;
        process.env = {
            ...newEnv,
        };
        const storageService = require('../../../utils/storageService');
        expect(storageService.isLocal).toBeTruthy();
        expect(storageService.isExternal).toBeFalsy();
    });

    test('should store locally when S3_UPLOADS_BUCKET is unset', () => {
        const { S3_UPLOADS_BUCKET, ...newEnv } = process.env;
        process.env = {
            ...newEnv,
        };
        const storageService = require('../../../utils/storageService');
        expect(storageService.isLocal).toBeTruthy();
        expect(storageService.isExternal).toBeFalsy();
    });

    test('should use external storage when the configuration is set', () => {
        process.env = {
            ...process.env,
            S3_ACCESS_KEY: 'test_key',
            S3_UPLOADS_BUCKET: 'test_bucket',
            S3_ACCESS_SECRET: 'test_secret',
        };

        const storageService = require('../../../utils/storageService');
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
            uploaderFn
        );

        const image = new File(['test'], 'testFile.png');
        const result = await storeExternally(
            image,
            'collection',
            'filename.png',
            { mimetype: 'image/png' }
        );
        expect(uploaderFn).toBeCalledWith('/collection/filename.png', image);
        expect(result).toBe('S3_UPLOADS_BUCKET/collection/filename.png');
    });
});
