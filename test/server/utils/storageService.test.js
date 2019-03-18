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
});
