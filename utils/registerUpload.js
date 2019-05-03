const axios = require('axios');
function registerUpload(
    collection,
    galleryName,
    season,
    photographer,
    imageUrls
) {
    return axios.post(process.env.DB_SERVICE, {
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
