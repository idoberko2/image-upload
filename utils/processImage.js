const sizeOf = require('image-size');
const sharp = require('sharp');

const resizeTo = process.env.RESIZE_PIXELS || 900;

function processImage(image) {
    const { width, height } = sizeOf(image);
    const isLandscape = width > height;
    const resizeWidthTo = isLandscape ? resizeTo : null;
    const resizeHeightTo = isLandscape ? null : resizeTo;

    let sharpImg = sharp(image);

    if (process.env.SHOULD_ADD_WATERMARK === 'true') {
        sharpImg = sharpImg.composite([{
            input: `${__dirname}/../assets/watermark.png`,
            gravity: sharp.gravity.northwest,
        }])
    }

    return sharpImg
        .resize(resizeWidthTo, resizeHeightTo)
        .toBuffer();
}

module.exports = processImage;
