const fs = require('fs');
const sharp = require('sharp');

const logo = fs.readFileSync(`${__dirname}/../assets/Hapoel_Katamon_FC.png`);

function processImage(image) {
    return sharp(image)
        .overlayWith(logo, {
            gravity: sharp.gravity.southeast,
        })
        .resize(1000);
}

module.exports = processImage;
