describe('storageService', () => {
    beforeEach(jest.resetModules);

    test('should store locally when no WMP configuration is set', () => {
        const {
            WMP_DOMAIN,
            WMP_APPID,
            WMP_SHARED_SECRET,
            ...newEnv
        } = process.env;
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
            WMP_APPID: 'test_appid',
            WMP_SHARED_SECRET: 'test_secret',
        };

        const storageService = require('../../../utils/storageService');
        expect(storageService.isLocal).toBeFalsy();
        expect(storageService.isMediaPlatform).toBeTruthy();
    });
});
