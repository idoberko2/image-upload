function sendFiles(collection, files) {
    const promises = files.map(file => {
                const formData = new FormData();

                formData.append('image', file);
                formData.append('collection', collection);

                axios.post('/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            });

        return axios
            .all(promises)
            .then(() => console.log('mush success!'))
            .error(err => console.error({err}));
}

function validateFiles(files) {
    for (file of files) {
        if (!/image\/[a-zA-Z]+$/.test(file.type)) {
            return false;
        }
    }

    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    let files;
    let collection;
    let isValid = false;

    document.getElementById('collection').addEventListener('keyup', function (event) {
        collection = event.target.value;
    });

    const uploader = document.getElementById('uploader');
    uploader.addEventListener('change', function () {
        const filesArray = Array.from(this.files);
        if (window.FileReader && window.Blob && validateFiles(filesArray)) {
            files = filesArray;
            document.getElementById('status').innerHTML = '✅ ' + files.length + ' קבצים נבחרו';
        } else if (!window.FileReader || !window.Blob) {
            // can't validate, invalid files might be sent to server
            files = filesArray;
        } else {
            document.getElementById('status').innerHTML = '❌ לפחות אחד מהקבצים אינו תמונה';
        }
    }, false);

    document.getElementById('submit').addEventListener('click', function () {
        sendFiles(collection, files);
    });

    document.getElementById('clear').addEventListener('click', function () {
        document.getElementById('status').innerHTML = '';
        uploader.value = null;
    });
});
