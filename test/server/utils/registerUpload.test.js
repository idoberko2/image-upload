const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const axiosMock = new MockAdapter(axios);
const registerUpload = require('../../../utils/registerUpload');

describe('registerUpload', () => {
    const dummyUrl = 'http://demourl.com';
    let prevEnv;

    afterEach(() => {
        process.env = prevEnv;
    });

    it('calls the API correctly', async done => {
        // test setup
        const galleryName = 'שם הגלריה';
        const collection = 'collection';
        const season = 'season';
        const photographer = 'photographer';
        const images = ['path1', 'path2', 'path3'];

        prevEnv = { ...process.env };
        process.env.DB_SERVICE_URL = dummyUrl;

        axiosMock.onPost().replyOnce(200);

        // SUT
        const promise = registerUpload(
            collection,
            galleryName,
            season,
            photographer,
            images
        );
        expect(promise).toBeInstanceOf(Promise);
        await promise;

        // expectations
        expect(axiosMock.history.post.length).toBe(1);
        expect(axiosMock.history.post[0].url).toBe(dummyUrl);
        const { data } = axiosMock.history.post[0];
        const actualBody = JSON.parse(data);

        expect(actualBody.folderName).toBe(collection);
        expect(actualBody.season).toBe(season);
        expect(actualBody.galleryName).toBe(galleryName);
        expect(actualBody.images).toEqual(
            expect.arrayContaining(
                images.map(path => ({
                    imageUrl: path,
                    season,
                    folderName: collection,
                    credit: photographer,
                }))
            )
        );

        done();
    });

    test('throws an error if DB_SERVICE_URL is not set', () => {
        // test setup
        const galleryName = 'שם הגלריה';
        const collection = 'collection';
        const season = 'season';
        const photographer = 'photographer';
        const images = ['path1', 'path2', 'path3'];

        prevEnv = { ...process.env };
        const { DB_SERVICE_URL, ...newEnv } = process.env;
        process.env = { ...newEnv };

        expect(() =>
            registerUpload(
                collection,
                galleryName,
                season,
                photographer,
                images
            )
        ).toThrowError();
    });
});
