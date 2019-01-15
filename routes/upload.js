// External
const express = require('express');
const router = express.Router();
const multer = require('multer');

// Utils
const processImage = require('../utils/processImage');
const storeLocally = require('../utils/storeLocally');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.any(), async function(req, res) {
  const imagePromises = req.files.map(image => {
    const processedImage = processImage(image.buffer);

    return storeLocally(processedImage);
  });

  await Promise.all(imagePromises);
  return res.sendStatus(200);
});

module.exports = router;
