const storeLocally = require('./storeLocally');
const generateStorageFunction = require('./storeExternally');

const { S3_ACCESS_KEY, S3_ACCESS_SECRET, S3_UPLOADS_BUCKET } = process.env;

const isExternal = S3_ACCESS_KEY && S3_ACCESS_SECRET && S3_UPLOADS_BUCKET;
const localStoragePublicPath = !isExternal ? 'uploadedFiles' : null;

function selectStorageFunction() {
    if (isExternal) {
        console.info('Using S3 as the storage service');
        return generateStorageFunction(
            S3_ACCESS_KEY,
            S3_ACCESS_SECRET,
            S3_UPLOADS_BUCKET
        );
    }

    console.info('Using local storage as the storage service');
    return storeLocally;
}

module.exports = {
    storageFunction: selectStorageFunction(),
    isExternal,
    isLocal: !isExternal,
    localStoragePublicPath,
};
