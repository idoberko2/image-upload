// External
const express = require('express');
const router = express.Router();
const multer = require('multer');

// Utils
const processImage = require('../utils/processImage');
const storeExternally = require('../utils/storeExternally');
const storeLocally = require('../utils/storeLocally');
const registerUpload = require('../utils/registerUpload');

// Model
const UploadsHandler = require('../model/UploadsHandler');

// multer middleware
const upload = multer({ dest: '/tmp/uploads' });

router.post('/', upload.array('images'), async (req, res, next) => {
    try {
        const { body, files } = req;
        const { collection, season, galleryName, photographer } = body;

        const handler = new UploadsHandler(
            processImage,
            storeExternally,
            storeLocally,
            registerUpload
        );
        const urls = await handler.upload(
            `${req.protocol}://${req.get('host')}`,
            collection,
            season,
            galleryName,
            photographer,
            files
        );

        return res.json({ urls });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
