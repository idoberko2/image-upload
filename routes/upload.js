// External
const express = require('express');
const router = express.Router();
const multer = require('multer');

// Utils
const processImage = require('../utils/processImage');
const storeLocally = require('../utils/storeLocally');

// multer middleware
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('image'), async function(req, res) {
  const processedImage = processImage(req.file.buffer);
  await storeLocally(processedImage);

  return res.sendStatus(200);
});

module.exports = router;
