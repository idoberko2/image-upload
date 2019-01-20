// External
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

// Utils
const processImage = require('../utils/processImage');
const storeLocally = require('../utils/storeLocally');
const {
  isAvailable: isMediaPlatformAvailable,
  storeMediaPlatform,
} = require('../utils/storeMediaPlatform');

// multer middleware
const upload = multer({ dest: '/tmp/uploads' });

// handlers
const storageFunction = isMediaPlatformAvailable ? storeMediaPlatform : storeLocally;
const removeTempFile = path => new Promise((resolve, reject) => {
  fs.unlink(path, err => {
    if (err) {
      return reject(err);
    }
    return resolve();
  });
});

router.post('/', upload.array('images'), async function(req, res) {
  const promises = req.files.map(async file => {
    const {
      path,
      originalname,
    } = file;
    const {
      collection,
    } = req.body;
    const processedImage = processImage(path);
    await storageFunction(processedImage, collection, originalname);

    return removeTempFile(path);
  });
  
  await Promise.all(promises);

  return res.sendStatus(200);
});

module.exports = router;
