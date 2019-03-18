const fs = require('fs');
const sizeOf = require('image-size');
const sharp = require('sharp');

const logo = fs.readFileSync(`${__dirname}/../assets/watermark.png`);
const resizeTo = process.env.RESIZE_PIXELS || 900;

function processImage(image) {
    const { width, height } = sizeOf(image);
    const isLandscape = width > height;
    const resizeWidthTo = isLandscape ? resizeTo : null;
    const resizeHeightTo = isLandscape ? null : resizeTo;

    return sharp(image)
        .overlayWith(logo, {
            gravity: sharp.gravity.northwest,
        })
        .resize(resizeWidthTo, resizeHeightTo)
        .toBuffer();
}

module.exports = processImage;
