import axios from 'axios';

function sendFiles({ collection, files, galleryName, photographer, season }) {
    const formData = new FormData();
    formData.append('collection', collection.trim());
    formData.append('galleryName', galleryName.trim());
    formData.append('photographer', photographer.trim());
    formData.append('season', season.trim());

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
