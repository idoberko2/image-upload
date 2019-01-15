const fs = require('fs');
const sizeOf = require('image-size');
const sharp = require('sharp');

const logo = fs.readFileSync(`${__dirname}/../assets/Hapoel_Katamon_FC.png`);
const resizeTo = process.env.RESIZE_PIXELS || 1000;

function processImage(image) {
    const {
        width,
        height,
    } = sizeOf(image);
    
    const isLandscape = width > height;
    const resizeWidthTo = isLandscape ? resizeTo : null;
    const resizeHeightTo = isLandscape ? null : resizeTo;

    return sharp(image)
        .overlayWith(logo, {
            gravity: sharp.gravity.southeast,
        })
        .resize(resizeWidthTo, resizeHeightTo);
}

module.exports = processImage;
