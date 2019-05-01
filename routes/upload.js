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

router.post('/', upload.array('images'), async (req, res, next) => {
    try {
        const promises = req.files.map(async file => {
            const { mimetype, originalname, path } = file;
            const { collection } = req.body;
            const storagePath = await storageFunction(
                await processImage(path),
                collection,
                originalname,
                {
                    prefix: `${req.protocol}://${req.get(
                        'host'
                    )}/${localStoragePublicPath}`,
                    mimetype,
                }
            );

            await removeTempFile(path);

            return storagePath;
        });

        const urls = await Promise.all(promises);
        console.info({ urls });

        return res.json({ urls });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
