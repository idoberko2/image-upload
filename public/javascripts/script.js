document.addEventListener("DOMContentLoaded", function() {
    const uploader = document.getElementById('uploader');
    uploader.addEventListener('change', function () {
        const formData = new FormData();

        Array
            .from(this.files)
            .forEach(file => {
                formData.append(file.name, file);
            });
        
        axios.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }, false);
});
