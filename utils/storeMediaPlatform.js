const { MediaPlatform } = require('media-platform-js-sdk');

const {
    WMP_DOMAIN,
    WMP_APPID,
    WMP_SHARED_SECRET,
} = process.env;

const mediaPlatform = new MediaPlatform({
    domain: WMP_DOMAIN,
    appId: WMP_APPID,
    sharedSecret: WMP_SHARED_SECRET,
});

function storeMediaPlatform(imageStream, collection, fileName) {
    const path = `/${collection}/${fileName}`;

    return mediaPlatform.fileManager.uploadFile(path, imageStream);
}

const isAvailable = WMP_APPID && WMP_DOMAIN && WMP_SHARED_SECRET;

module.exports = {
    isAvailable,
    storeMediaPlatform,
};
