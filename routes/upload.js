// External
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

// Utils
const processImage = require('../utils/processImage');
const {
    storageFunction,
    localStoragePublicPath,
} = require('../utils/storageService');

// multer middleware
const upload = multer({ dest: '/tmp/uploads' });

// handlers
const removeTempFile = path =>
    new Promise((resolve, reject) => {
        fs.unlink(path, err => {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });

router.post('/', upload.array('images'), async (req, res) => {
    const promises = req.files.map(async file => {
        const { path, originalname } = file;
        const { collection } = req.body;
        const processedImage = processImage(path);
        const storagePath = await storageFunction(
            processedImage,
            collection,
            originalname,
            `${req.protocol}://${req.get('host')}/${localStoragePublicPath}`
        );

        await removeTempFile(path);

        return storagePath;
    });

    const urls = await Promise.all(promises);
    console.info({ urls });

    return res.json({ urls });
});

module.exports = router;
