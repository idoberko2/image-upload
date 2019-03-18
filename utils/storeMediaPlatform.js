const { MediaPlatform } = require('media-platform-js-sdk');

function generateStorageFunction(
    WMP_DOMAIN,
    WMP_PUBLIC_URL,
    WMP_APPID,
    WMP_SHARED_SECRET
) {
    const mediaPlatform = new MediaPlatform({
        domain: WMP_DOMAIN,
        appId: WMP_APPID,
        sharedSecret: WMP_SHARED_SECRET,
    });

    return async function storeMediaPlatform(image, collection, fileName) {
        const path = `/${collection}/${fileName}`;

        // https://wix.github.io/media-platform-js-sdk/file-Management#filedescriptor
        await mediaPlatform.fileManager.uploadFile(path, image);

        return `${WMP_PUBLIC_URL}${path}`;
    };
}

module.exports = generateStorageFunction;
