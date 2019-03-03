// external
import axios from 'axios';

function sendFiles({ collection, files }) {
    const formData = new FormData();
    formData.append('collection', collection.trim());

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
