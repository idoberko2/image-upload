const fs = require('fs');

function storeLocally(imageStream) {
    return new Promise((resolve, reject) => {
        const fileName = `${__dirname}/../tmp/mush${Math.random()}.jpg`;
        const writeStream = fs.createWriteStream(fileName);

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
