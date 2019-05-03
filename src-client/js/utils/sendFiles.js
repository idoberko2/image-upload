import axios from 'axios';

function sendFiles({ collection, files, photographer }) {
    const formData = new FormData();
    formData.append('collection', collection.trim());
    formData.append('photographer', photographer.trim());

    Array.from(files).forEach(file => {
        formData.append('images', file);
    });

    return axios.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export default sendFiles;
