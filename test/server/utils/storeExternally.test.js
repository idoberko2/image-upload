describe('storeExternally', () => {
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
            { mimetype: 'image/png', season: '2018-2019' }
        );
        expect(uploaderFn).toBeCalledWith(
            '2018-2019/collection/filename.png',
            image
        );
        expect(result).toBe('S3_PUBLIC_PATH/2018-2019/collection/filename.png');
    });
});
