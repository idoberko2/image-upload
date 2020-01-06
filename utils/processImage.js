const sizeOf = require('image-size');
const sharp = require('sharp');

const resizeTo = process.env.RESIZE_PIXELS || 900;

function processImage(image) {
    const { width, height } = sizeOf(image);
    const isLandscape = width > height;
    const resizeWidthTo = isLandscape ? resizeTo : null;
    const resizeHeightTo = isLandscape ? null : resizeTo;

    return sharp(image)
        .composite([{
            input: `${__dirname}/../assets/watermark.png`,
            gravity: sharp.gravity.northwest,
        }])
        .resize(resizeWidthTo, resizeHeightTo)
        .toBuffer();
}

module.exports = processImage;
