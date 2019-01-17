const e = React.createElement;

function sendFiles({ collection, files }) {
    const promises = Array.from(files).map(file => {
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
        .catch(err => console.error({err}));
}

function validateFiles(files) {
    for (file of files) {
        if (!/image\/[a-zA-Z]+$/.test(file.type)) {
            return false;
        }
    }

    return true;
}

const UploadStep = React.createClass({
    render() {
        return e(
            'div', 
            { className: 'upload-steps--item' }, 
            e('h1', { className: 'upload-steps--item--header' }, `${this.props.step}.`),
            this.props.children
        );
    }
});

const UploadForm = React.createClass({
    getInitialState() {
        return {
            files: null,
            collection: '',
            collectionChanged: false,
        };
    },

    handleCollectionChange(event) {
        const collection = event.target.value;
        this.setState(prevState => ({
            collection,
            collectionChanged: prevState.collectionChanged || Boolean(collection),
        }));
    },

    handleFilesSelection(event) {
        this.setState({
            files: event.target.files,
        });
    },

    isCollectionValid() {
        return !this.state.collectionChanged || this.state.collection !== '';
    },

    getCollectionStatus() {
        return this.isCollectionValid() ? 
            null :
            '❌ שם האוסף לא יכול להיות ריק' ;
    },

    isFilesValid() {
        return !window.FileReader ||
            !window.Blob ||
            (this.state.files && validateFiles(this.state.files));
    },

    getFilesStatus() {
        if (!this.state.files) {
            return null;
        }

        if (this.isFilesValid()) {
            return '✅ ' + this.state.files.length + ' קבצים נבחרו';
        }

        return '❌ לפחות אחד מהקבצים אינו תמונה';
    },

    isValid() {
        return this.isCollectionValid() && this.isFilesValid();
    },

    handleSubmit() {
        sendFiles(this.state);
    },

    handleClear() {
        this.setState({
            files: null,
        });
    },

    render() {
        return e(
            'div',
            { className: 'upload-steps' }, 
            e(
                UploadStep, 
                {step: 1}, 
                e(
                    'label',
                    { htmlFor: 'collection', className: 'text-label' },
                    'בחירת שם',
                    e(
                        'input',
                        {
                            type: 'text',
                            id: 'collection',
                            className: 'text-input',
                            placeholder: 'שם האוסף',
                            value: this.state.collection,
                            onChange: this.handleCollectionChange,
                        }
                    )
                ),
                e('div', { className: 'status' }, this.getCollectionStatus())
            ),
            e(
                UploadStep, 
                {step: 2}, 
                e(
                    'label',
                    { htmlFor: 'uploader', className: 'button uploader-wrapper' },
                    'בחירת קבצים',
                    e(
                        'input',
                        {
                            type: 'file',
                            id: 'uploader',
                            className: 'uploader-input',
                            multiple: true,
                            onChange: this.handleFilesSelection,
                        }
                    )
                ),
                e('div', { className: 'status' }, this.getFilesStatus())
            ),
            e(
                UploadStep, 
                {step: 3}, 
                e(
                    'div',
                    { className: 'submit-wrapper' },
                    e('button',{ 
                        className: 'button', 
                        disabled: !this.isValid(),
                        onClick: this.handleSubmit,
                    }, 'שליחה'),
                )
            )
        );
    }
});

ReactDOM.render(
    e(UploadForm),
    document.getElementById('app')
);
