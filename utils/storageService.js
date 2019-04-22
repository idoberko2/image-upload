const storeLocally = require('./storeLocally');
const generateStorageFunction = require('./storeMediaPlatform');

const {
    WMP_DOMAIN,
    WMP_PUBLIC_URL,
    WMP_APPID,
    WMP_SHARED_SECRET,
} = process.env;

const isMediaPlatform =
    WMP_APPID && WMP_DOMAIN && WMP_PUBLIC_URL && WMP_SHARED_SECRET;
const localStoragePublicPath = !isMediaPlatform ? 'uploadedFiles' : null;

function selectStorageFunction() {
    if (isMediaPlatform) {
        console.info('Using Wix Media Platform as the storage service');
        return generateStorageFunction(
            WMP_DOMAIN,
            WMP_PUBLIC_URL,
            WMP_APPID,
            WMP_SHARED_SECRET
        );
    }

    console.info('Using local storage as the storage service');
    return storeLocally;
}

module.exports = {
    storageFunction: selectStorageFunction(),
    isMediaPlatform,
    isLocal: !isMediaPlatform,
    localStoragePublicPath,
};
