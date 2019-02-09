const allowedMimeTypes = {
    'image/jpeg': true,
    'image/gif': true,
    'image/bmp': true,
};

// input "accept" attribute allows additional MIME types (such as svg)
function validateFiles(files) {
    for (const file of files) {
        if (!allowedMimeTypes[file.type]) {
            return false;
        }
    }

    return true;
}

export default validateFiles;
