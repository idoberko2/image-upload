const allowedMimeTypes = {
    'image/jpeg': true,
    'image/gif': true,
    'image/bmp': true,
};

// input "accept" attribute allows additional MIME types (such as svg)
function validateFiles(files) {
    return !files.some(file => !allowedMimeTypes[file.type]);
}

export default validateFiles;
