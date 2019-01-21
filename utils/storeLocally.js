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

function storeLocally(imageStream, collection, fileName, prefix = '') {
    return new Promise(async (resolve, reject) => {
        const uploadsPath = path.join(__dirname, '..', uploadsFolder);
        const collectionFolder = path.join(uploadsPath, collection);
        const storageFileName = `${Math.random()}_${fileName}`;

        await createBaseFolderIfNotExists(collectionFolder);

        const writeStream = fs.createWriteStream(path.join(collectionFolder, storageFileName));

        writeStream.on('finish', function () {
            resolve(`${prefix}/${collection}/${storageFileName}`);
        });

        writeStream.on('error', function (err) {
            reject(err);
        });

        imageStream.pipe(writeStream);
    });
}

module.exports = storeLocally;
