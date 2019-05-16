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
            { mimetype: 'image/png' }
        );
        expect(uploaderFn).toBeCalledWith('collection/filename.png', image);
        expect(result).toBe('S3_PUBLIC_PATH/collection/filename.png');
    });
});
