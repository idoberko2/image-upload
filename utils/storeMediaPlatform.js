const { MediaPlatform } = require('media-platform-js-sdk');

function generateStorageFunction(WMP_DOMAIN, WMP_APPID, WMP_SHARED_SECRET) {
    const mediaPlatform = new MediaPlatform({
        domain: WMP_DOMAIN,
        appId: WMP_APPID,
        sharedSecret: WMP_SHARED_SECRET,
    });

    return async function storeMediaPlatform(
        imageStream,
        collection,
        fileName
    ) {
        const path = `/${collection}/${fileName}`;

        // https://wix.github.io/media-platform-js-sdk/file-Management#filedescriptor
        const {
            path: storagePath,
        } = await mediaPlatform.fileManager.uploadFile(path, imageStream);
        return storagePath;
    };
}

module.exports = generateStorageFunction;
