const storeLocally = require('./storeLocally');
const generateStorageFunction = require('./storeMediaPlatform');

const {
    WMP_DOMAIN,
    WMP_APPID,
    WMP_SHARED_SECRET,
} = process.env;

const isMediaPlatform = WMP_APPID && WMP_DOMAIN && WMP_SHARED_SECRET;
const isLocal = !isMediaPlatform;
const localStoragePublicPath = isLocal ? 'uploadedFiles' : null;

function selectStorageFunction() {
    if (isMediaPlatform) {
        return generateStorageFunction(WMP_DOMAIN, WMP_APPID, WMP_SHARED_SECRET);
    }

    if (isLocal) {
        return storeLocally;
    }

    throw new Error('unknown storage service');
}

module.exports = {
    storageFunction: selectStorageFunction(),
    isMediaPlatform,
    isLocal,
    localStoragePublicPath,
};
