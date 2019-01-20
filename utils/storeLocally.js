const fs = require('fs');
const fx = require('mkdir-recursive');
const path = require('path');

const uploadsFolder = process.env.UPLOADS_FOLDER || 'uploads';
let folderCreationPromises = {};

function createBaseFolderIfNotExists(path) {
    if (!folderCreationPromises[path]) {
        folderCreationPromises[path] = new Promise((resolve, reject) => {
            fs.access(path, err => {
                if (err) {
                    fx.mkdir(path, err => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                } else {
                    resolve();
                }
            })
        });
    }

    return folderCreationPromises[path];
}

function storeLocally(imageStream, collection, fileName) {
    return new Promise(async (resolve, reject) => {
        const basePath = path.join(__dirname, '..', uploadsFolder, collection);
        const filePath = path.join(basePath, `${Math.random()}_${fileName}`);

        await createBaseFolderIfNotExists(basePath);

        const writeStream = fs.createWriteStream(filePath);

        writeStream.on('finish', function () {
            resolve();
        });

        writeStream.on('error', function (err) {
            reject(err);
        });

        imageStream.pipe(writeStream);
    });
}

module.exports = storeLocally;
