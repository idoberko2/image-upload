document.addEventListener('DOMContentLoaded', function() {
    const uploader = document.getElementById('uploader');
    uploader.addEventListener('change', function () {
        const promises = Array
            .from(this.files)
            .map(file => {
                const formData = new FormData();

                formData.append('image', file);

                axios.post('/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            });

        axios
            .all(promises)
            .then(() => console.log('mush success!'))
            .error(err => console.error({err}));
    }, false);
});
