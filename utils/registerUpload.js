const axios = require('axios');
function registerUpload(
    collection,
    galleryName,
    season,
    photographer,
    imageUrls
) {
    const { DB_SERVICE_URL } = process.env;

    if (DB_SERVICE_URL == null) {
        throw Error('DB_SERVICE_URL is required');
    }

    return axios.post(DB_SERVICE_URL, {
        folderName: collection,
        season,
        galleryName,
        images: imageUrls.map(imageUrl => ({
            imageUrl,
            season,
            folderName: collection,
            credit: photographer,
        })),
    });
}

module.exports = registerUpload;
