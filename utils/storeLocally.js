const fs = require('fs');
const fsPromises = fs.promises;
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
            });
        });
    }

    return folderCreationPromises[path];
}

async function storeLocally(image, collection, fileName, { prefix = '' }) {
    const uploadsPath = path.join(__dirname, '..', uploadsFolder);
    const collectionFolder = path.join(uploadsPath, collection);
    const storageFileName = `${Math.random()}_${fileName}`;

    await createBaseFolderIfNotExists(collectionFolder);
    await fsPromises.writeFile(
        path.join(collectionFolder, storageFileName),
        image
    );

    return `${prefix}/${collection}/${storageFileName}`;
}

module.exports = storeLocally;
