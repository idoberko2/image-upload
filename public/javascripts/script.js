import htm from '/assets/htm/dist/htm.mjs';
const html = htm.bind(React.createElement);
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
    for (const file of files) {
        if (!/image\/[a-zA-Z]+$/.test(file.type)) {
            return false;
        }
    }

    return true;
}

const Icon = ({ path, className }) => html`
    <svg className="${`icon ${className}`}" viewBox='0 0 512 512'>
        <path d=${path}><//>
    <//>
`;

const CheckMark = ({className}) => html`
    <${Icon} className="${`icon__success ${className}`}"
             path="M186.301 339.893L96 249.461l-32 30.507L186.301 402 448 140.506 416 110z"
    />
`;

const ErrorMark = ({className}) => html`
    <${Icon} className="${`icon__error ${className}`}"
             path="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"
    />
`;

const StepHeader = ({ step, action }) => html`
    <h1 className="upload-steps--item--header">
        ${step}
        <span className="upload-steps--item--description">
            ${action}
        <//>
    <//>
`;

const UploadStep = ({step, action, children}) => html`
    <div className="upload-steps--item">
        <${StepHeader} step=${step} action=${action} />
        ${children}    
    <//>
`;

const uploadFormInitialState = {
    files: null,
    collection: '',
    collectionChanged: false,
    formVisible: true,
    successVisible: false,
    submitError: null,
    isLoading: false,
};

class UploadForm extends React.Component {
    constructor(props) {
        super(props);

        this.filesRef = null;
        this.state = uploadFormInitialState;

        this.handleCollectionChange = this.handleCollectionChange.bind(this);
        this.handleFilesSelection = this.handleFilesSelection.bind(this);
        this.isCollectionValid = this.isCollectionValid.bind(this);
        this.getCollectionStatus = this.getCollectionStatus.bind(this);
        this.isFilesValid = this.isFilesValid.bind(this);
        this.getFilesStatus = this.getFilesStatus.bind(this);
        this.isValid = this.isValid.bind(this);
        this.getSubmissionStatus = this.getSubmissionStatus.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleCollectionChange(event) {
        const collection = event.target.value;
        this.setState(prevState => ({
            collection,
            collectionChanged: prevState.collectionChanged || Boolean(collection),
        }));
    }

    handleFilesSelection(event) {
        const { files } = event.target;

        if (!files || files.length === 0) {
            return;
        }

        this.setState({
            files,
        });
    }

    isCollectionValid() {
        return !this.state.collectionChanged || this.state.collection !== '';
    }

    getCollectionStatus() {
        return this.isCollectionValid() ? 
            null :
            html`
                <div className="row-align">
                    <${ErrorMark} className="icon__small" />
                    <div>שם האלבום לא יכול להיות ריק<//>
                <//>
            `;
    }

    isFilesValid() {
        return !window.FileReader ||
            !window.Blob ||
            (this.state.files && validateFiles(this.state.files));
    }

    getFilesStatus() {
        if (!this.state.files) {
            return null;
        }

        if (this.isFilesValid()) {
            const text = this.state.files.length > 1 ? 
                this.state.files.length + ' קבצים נבחרו' : 
                'קובץ אחד נבחר';
            return html`
                <div className="row-align">
                    <${CheckMark} className="icon__small" />
                    <div>${text}<//>
                <//>
            `;
        }

        return html`
            <div className="row-align">
                <${ErrorMark} className="icon__small" />
                <div>לפחות אחד מהקבצים אינו תמונה<//>
            <//>
        `;
    }

    isValid() {
        return this.isCollectionValid() && this.isFilesValid();
    }

    getSubmissionStatus() {
        return !this.state.submitError ? null :
            html`<div className="row-align">
                <${ErrorMark} className="icon__small" />
                <div>קרתה שגיאה במהלך העלאת הקבצים :(<//>
            <//>`;
    }

    handleSubmit() {
        this.setState({isLoading: true}, () => {
            sendFiles(this.state)
            .then(() => {
                this.filesRef.value = '';
                this.setState(
                    Object.assign(
                        {}, 
                        uploadFormInitialState, // to reset the form
                        { formVisible: false } // to hide the form and show success message
                    )
                );
            })
            .catch(err => this.setState({submitError: err, isLoading: false}));
        });
    }

    render() {
        const {
            formVisible,
            successVisible,
            isLoading,
        } = this.state;

        return html`
            <div className="app">
                <${CSSTransition}
                    in=${formVisible}
                    timeout=${{enter: 500, exit: 300}}
                    classNames="fade-in-out"
                    unmountOnExit
                    onExited=${() => this.setState({successVisible: true})}
                >
                    ${
                        () =>
                        html`
                            <div className="main">
                                <${UploadStep} step="1" action="בוחרים שם לאלבום">
                                    <input 
                                        type="text"
                                        id="collection"
                                        className="text-input"
                                        placeholder="שם האלבום"
                                        value=${this.state.collection}
                                        onChange=${this.handleCollectionChange}
                                        disabled=${isLoading}
                                    />
                                    <div className="status">${this.getCollectionStatus()}<//>
                                <//>
                                <${UploadStep} step="2" action="בוחרים תמונות">
                                    <label
                                    htmlFor="uploader"
                                    className="${`button uploader-wrapper ${isLoading ? 'button__disabled' : null}` }"
                                    >
                                        בחירת תמונות
                                        <input
                                            type="file"
                                            id="uploader"
                                            className="uploader-input"
                                            multiple
                                            onChange=${this.handleFilesSelection}
                                            ref=${c => this.filesRef = c}
                                            disabled=${isLoading}
                                            accept="image/*"
                                        />
                                    <//>
                                    <div className="status">${this.getFilesStatus()}<//>
                                <//>
                                <${UploadStep} step="3" action="מעלים">
                                    <div className="submit-wrapper">
                                        <button
                                            className="button"
                                            disabled=${!this.isValid() || isLoading}
                                            onClick=${this.handleSubmit}
                                        >
                                            <span className="${isLoading ? 'spinner' : null}">${isLoading ? null : 'העלאה'}<//>
                                        <//>
                                    <//>
                                    <div className="status">${this.getSubmissionStatus()}<//>
                                <//>
                            <//>
                        `
                    }
                <//>
                <${CSSTransition}
                    in=${successVisible}
                    timeout=${{enter: 500, exit: 300}}
                    classNames="fade-in-out"
                    unmountOnExit
                    onExited=${() => this.setState({formVisible: true})}
                >
                    ${
                        () => html`
                            <div className="main">
                                <div className="checkmark-wrapper"><${CheckMark} /><//>
                                <div className="success-message">הקבצים נשלחו בהצלחה<//>
                                <div className="restart-wrapper">
                                    <button
                                        className="button"
                                        onClick=${() => this.setState({successVisible: false})}
                                    >
                                    להתחיל מחדש
                                    <//>
                                <//>
                            <//>
                        `
                    }
                <//>
            <//>
        `;
    }
}

ReactDOM.render(
    html`<${UploadForm} />`,
    document.getElementById('app')
);
