// External
const express = require('express');
const router = express.Router();
const multer = require('multer');

// Utils
const processImage = require('../utils/processImage');
const storeLocally = require('../utils/storeLocally');

const upload = multer({ dest: 'tmp/' });

router.post('/', upload.any(), function(req, res) {
  const imagePromises = req.files.map(image => {
    const processedImage = processImage(`${__dirname}/../tmp/${image.filename}`);

    return storeLocally(processedImage);
  });

  Promise
    .all(imagePromises)
    .then(() => res.sendStatus(200))
    .catch(err => console.error(err));
});

module.exports = router;
