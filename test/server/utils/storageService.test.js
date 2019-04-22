describe('storageService', () => {
    beforeEach(jest.resetModules);

    test('should store locally when WMP_DOMAIN is unset', () => {
        const { WMP_DOMAIN, ...newEnv } = process.env;
        process.env = {
            ...newEnv,
        };
        const storageService = require('../../../utils/storageService');
        expect(storageService.isLocal).toBeTruthy();
        expect(storageService.isMediaPlatform).toBeFalsy();
    });

    test('should store locally when WMP_PUBLIC_URL is unset', () => {
        const { WMP_PUBLIC_URL, ...newEnv } = process.env;
        process.env = {
            ...newEnv,
        };
        const storageService = require('../../../utils/storageService');
        expect(storageService.isLocal).toBeTruthy();
        expect(storageService.isMediaPlatform).toBeFalsy();
    });

    test('should store locally when WMP_APPID is unset', () => {
        const { WMP_APPID, ...newEnv } = process.env;
        process.env = {
            ...newEnv,
        };
        const storageService = require('../../../utils/storageService');
        expect(storageService.isLocal).toBeTruthy();
        expect(storageService.isMediaPlatform).toBeFalsy();
    });

    test('should store locally when WMP_SHARED_SECRET is unset', () => {
        const { WMP_SHARED_SECRET, ...newEnv } = process.env;
        process.env = {
            ...newEnv,
        };
        const storageService = require('../../../utils/storageService');
        expect(storageService.isLocal).toBeTruthy();
        expect(storageService.isMediaPlatform).toBeFalsy();
    });

    test('should use WMP when the configuration is set', () => {
        process.env = {
            ...process.env,
            WMP_DOMAIN: 'test_domain',
            WMP_PUBLIC_URL: 'test_public_url',
            WMP_APPID: 'test_appid',
            WMP_SHARED_SECRET: 'test_secret',
        };

        const storageService = require('../../../utils/storageService');
        expect(storageService.isLocal).toBeFalsy();
        expect(storageService.isMediaPlatform).toBeTruthy();
    });

    test('should call WMP sdk correctly', async () => {
        function mockMediaPlatformSDK() {
            return null;
        }
        mockMediaPlatformSDK.MediaPlatform = () => {};

        jest.mock('media-platform-js-sdk', () => mockMediaPlatformSDK);

        const uploaderFn = jest.fn();
        const generateStorageFunction = require('../../../utils/storeMediaPlatform');
        const storeMediaPlatform = generateStorageFunction(
            'WMP_DOMAIN',
            'WMP_PUBLIC_URL',
            'WMP_APPID',
            'WMP_SHARED_SECRET',
            uploaderFn
        );

        const image = new File(['test'], 'testFile.png');
        const result = await storeMediaPlatform(
            image,
            'collection',
            'filename.png'
        );
        expect(uploaderFn).toBeCalledWith('/collection/filename.png', image);
        expect(result).toBe('WMP_PUBLIC_URL/collection/filename.png');
    });
});
