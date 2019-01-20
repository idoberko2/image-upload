const fs = require('fs');

let folderCreationPromise = null;

function createFolderIfNotExists(path) {
    if (folderCreationPromise === null) {
        folderCreationPromise = new Promise((resolve, reject) => {
            fs.access(path, err => {
                if (err) {
                    fs.mkdir(path, err => {
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

    return folderCreationPromise;
}

function storeLocally(imageStream, collection, fileName) {
    return new Promise(async (resolve, reject) => {
        const path = `${__dirname}/../tmpUploads/${collection}`;        
        const filePath = `${path}/${Math.random()}_${fileName}`;

        await createFolderIfNotExists(path);

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
