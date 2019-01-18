const e = React.createElement;
const { CSSTransition } = ReactTransitionGroup;

function sendFiles({ collection, files }) {
    const promises = Array.from(files).map(file => {
        const formData = new FormData();

        formData.append('image', file);
        formData.append('collection', collection);

        return axios.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    });

    return axios
        .all(promises);
}

function validateFiles(files) {
    for (file of files) {
        if (!/image\/[a-zA-Z]+$/.test(file.type)) {
            return false;
        }
    }

    return true;
}

const Icon = React.createClass({
    render() {
        const {
            path,
            className,
        } = this.props;
        return e(
            'svg', 
            {viewBox: '0 0 512 512', className:`icon ${className}`}, 
            e('path', {d: path})
        );
    }
});

const CheckMark = React.createClass({
    render() {
        return e(
            Icon, 
            {className: `icon__success ${this.props.className}`, path: 'M186.301 339.893L96 249.461l-32 30.507L186.301 402 448 140.506 416 110z'}, 
        );
    }
});

const ErrorMark = React.createClass({
    render() {
        return e(
            Icon, 
            {className: `icon__error ${this.props.className}`, path: 'M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z'}, 
        );
    }
});

const StepHeader = React.createClass({
    render() {
        return e(
            'h1',
            { className: 'upload-steps--item--header' }, 
            `${this.props.step}`,
            e('span', { className: 'upload-steps--item--description' }, this.props.action)
        );
    }
});

const UploadStep = React.createClass({
    render() {
        const {
            step,
            action,
        } = this.props;
        return e(
            'div', 
            { className: 'upload-steps--item' }, 
            e(StepHeader, { step, action }),
            this.props.children
        );
    }
});

const UploadForm = React.createClass({
    filesRef: null,

    getInitialState() {
        return {
            files: null,
            collection: '',
            collectionChanged: false,
            formVisible: true,
            successVisible: false,
            submitError: null,
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
            e('div', {className: 'row-align'}, e(ErrorMark, {className: 'icon__small'}), e('div', null, 'שם האוסף לא יכול להיות ריק'));
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
            const text = this.state.files.length > 1 ? 
                this.state.files.length + ' קבצים נבחרו' : 
                'קובץ אחד נבחר';
            return e('div', {className: 'row-align'}, e(CheckMark, {className: 'icon__small'}), e('div', null, text));
        }

        return e('div', {className: 'row-align'}, e(ErrorMark, {className: 'icon__small'}), e('div', null, 'לפחות אחד מהקבצים אינו תמונה'));
    },

    isValid() {
        return this.isCollectionValid() && this.isFilesValid();
    },

    getSubmissionStatus() {
        return !this.state.submitError ? null :
            e('div', {className: 'row-align'}, e(ErrorMark, {className: 'icon__small'}), e('div', null, 'קרתה שגיאה במהלך השליחה :('));
    },

    handleSubmit() {
        sendFiles(this.state)
            .then(() => {
                this.filesRef.value = '';
                this.setState(Object.assign(this.getInitialState(), { formVisible: false }));
            })
            .catch(err => this.setState({submitError: err}));
    },

    render() {
        const {
            formVisible,
            successVisible,
        } = this.state;

        return e(
            'div', 
            {className: 'app'},
            e(
                CSSTransition, 
                {
                    in: formVisible,
                    timeout: 300,
                    classNames: 'upload-steps',
                    unmountOnExit: true,
                    onExited: () => this.setState({successVisible: true}),
                }, 
                () => e(
                    'div',
                    { className: 'upload-steps main' }, 
                    e(
                        UploadStep, 
                        {step: 1, action: 'בוחרים שם לאוסף'}, 
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
                            ),
                        e('div', { className: 'status' }, this.getCollectionStatus())
                    ),
                    e(
                        UploadStep, 
                        {step: 2, action: 'בוחרים תמונות'}, 
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
                                    ref: c => this.filesRef = c,
                                }
                            )
                        ),
                        e('div', { className: 'status' }, this.getFilesStatus())
                    ),
                    e(
                        UploadStep, 
                        {step: 3, action: 'שולחים'}, 
                        e(
                            'div',
                            { className: 'submit-wrapper' },
                            e('button',{ 
                                className: 'button', 
                                disabled: !this.isValid(),
                                onClick: this.handleSubmit,
                            }, 'שליחה'),
                        ),
                        e('div', { className: 'status' }, this.getSubmissionStatus())
                    )
                )
            ),
            e(
                CSSTransition, 
                {
                    in: successVisible,
                    timeout: 500,
                    classNames: 'success',
                    unmountOnExit: true,
                    onExited: () => this.setState({formVisible: true})
                }, 
                () => e(
                    'div',
                    { className: 'success main' },
                    e('div', {className: 'checkmark-wrapper'}, e(CheckMark)),
                    e('div', {className: 'success-message'}, 'הקבצים נשלחו בהצלחה'),
                    e(
                        'div', 
                        {className: 'restart-wrapper'},
                        e('button',{ 
                            className: 'button', 
                            onClick: () => this.setState({successVisible: false}),
                        }, 'להתחיל מחדש')
                    )
                )
            )
        );
    }
});

ReactDOM.render(
    e(UploadForm),
    document.getElementById('app')
);
