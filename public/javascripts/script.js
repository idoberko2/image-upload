const e = React.createElement;
const { CSSTransition } = ReactTransitionGroup;

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
            isLoading: false,
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
        const { files } = event.target;

        if (!files || files.length === 0) {
            return;
        }

        this.setState({
            files,
        });
    },

    isCollectionValid() {
        return !this.state.collectionChanged || this.state.collection !== '';
    },

    getCollectionStatus() {
        return this.isCollectionValid() ? 
            null :
            e('div', {className: 'row-align'}, e(ErrorMark, {className: 'icon__small'}), e('div', null, 'שם האלבום לא יכול להיות ריק'));
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
            e('div', {className: 'row-align'}, e(ErrorMark, {className: 'icon__small'}), e('div', null, 'קרתה שגיאה במהלך העלאת הקבציפ :('));
    },

    handleSubmit() {
        this.setState({isLoading: true}, () => {
            sendFiles(this.state)
            .then(() => {
                this.filesRef.value = '';
                this.setState(Object.assign(this.getInitialState(), { formVisible: false }));
            })
            .catch(err => this.setState({submitError: err, isLoading: false}));
        });
    },

    render() {
        const {
            formVisible,
            successVisible,
            isLoading,
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
                        {step: 1, action: 'בוחרים שם לאלבום'}, 
                        e(
                                'input',
                                {
                                    type: 'text',
                                    id: 'collection',
                                    className: 'text-input',
                                    placeholder: 'שם האלבום',
                                    value: this.state.collection,
                                    onChange: this.handleCollectionChange,
                                    disabled: isLoading,
                                }
                            ),
                        e('div', { className: 'status' }, this.getCollectionStatus())
                    ),
                    e(
                        UploadStep, 
                        {step: 2, action: 'בוחרים תמונות'}, 
                        e(
                            'label',
                            { htmlFor: 'uploader', className: `button uploader-wrapper ${isLoading ? 'button__disabled' : null}` },
                            'בחירת תמונות',
                            e(
                                'input',
                                {
                                    type: 'file',
                                    id: 'uploader',
                                    className: 'uploader-input',
                                    multiple: true,
                                    onChange: this.handleFilesSelection,
                                    ref: c => this.filesRef = c,
                                    disabled: isLoading,
                                    accept: 'image/*',
                                }
                            )
                        ),
                        e('div', { className: 'status' }, this.getFilesStatus())
                    ),
                    e(
                        UploadStep, 
                        {step: 3, action: 'מעלים'}, 
                        e(
                            'div',
                            { className: 'submit-wrapper' },
                            e(
                                'button',
                                { 
                                    className: 'button', 
                                    disabled: !this.isValid() || isLoading,
                                    onClick: this.handleSubmit,
                                }, 
                                isLoading ? e('span', { className: 'spinner' }) : e('span', null, 'העלאה')
                            ),
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
