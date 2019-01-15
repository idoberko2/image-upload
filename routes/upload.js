// External
const express = require('express');
const router = express.Router();
const multer = require('multer');

// Utils
const processImage = require('../utils/processImage');
const storeLocally = require('../utils/storeLocally');
const {
  isAvailable: isMediaPlatformAvailable,
  storeMediaPlatform,
} = require('../utils/storeMediaPlatform');

// multer middleware
const upload = multer({ storage: multer.memoryStorage() });
const storageFunction = isMediaPlatformAvailable ? storeMediaPlatform : storeLocally;

router.post('/', upload.single('image'), async function(req, res) {
  const {
    buffer,
    originalname,
  } = req.file;
  const {
    collection,
  } = req.body;
  const processedImage = processImage(buffer);
  await storageFunction(processedImage, collection, originalname);

  return res.sendStatus(200);
});

module.exports = router;
