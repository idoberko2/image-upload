// external
import React from 'react';
import { CSSTransition } from 'react-transition-group';

// utils
import validateFiles from '../utils/validateFiles';
import sendFiles from '../utils/sendFiles';
import html from '../utils/html';

// components
import CheckMark from './icons/CheckMark';
import ErrorMark from './icons/ErrorMark';
import UploadStep from './steps/UploadStep';

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
            collectionChanged:
                prevState.collectionChanged || Boolean(collection),
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
        return this.isCollectionValid()
            ? null
            : html`
                  <div className="row-align">
                      <${ErrorMark} className="icon__small" />
                      <div>שם האלבום לא יכול להיות ריק<//>
                  <//>
              `;
    }

    isFilesValid() {
        return (
            !window.FileReader ||
            !window.Blob ||
            (this.state.files && validateFiles(this.state.files))
        );
    }

    getFilesStatus() {
        if (!this.state.files) {
            return null;
        }

        if (this.isFilesValid()) {
            const text =
                this.state.files.length > 1
                    ? this.state.files.length + ' קבצים נבחרו'
                    : 'קובץ אחד נבחר';
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
        return !this.state.submitError
            ? null
            : html`
                  <div className="row-align">
                      <${ErrorMark} className="icon__small" />
                      <div>קרתה שגיאה במהלך העלאת הקבצים :(<//>
                  <//>
              `;
    }

    handleSubmit() {
        this.setState({ isLoading: true }, () => {
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
                .catch(err =>
                    this.setState({ submitError: err, isLoading: false })
                );
        });
    }

    render() {
        const { formVisible, successVisible, isLoading } = this.state;

        return html`
            <div className="app">
                <${CSSTransition}
                    in=${formVisible}
                    timeout=${{ enter: 500, exit: 300 }}
                    classNames="fade-in-out"
                    unmountOnExit
                    onExited=${() => this.setState({ successVisible: true })}
                >
                    ${() =>
                        html`
                            <div className="main">
                                <${UploadStep}
                                    step="1"
                                    action="בוחרים שם לאלבום"
                                >
                                    <input
                                        type="text"
                                        id="collection"
                                        className="text-input"
                                        placeholder="שם האלבום"
                                        value=${this.state.collection}
                                        onChange=${this.handleCollectionChange}
                                        disabled=${isLoading}
                                    />
                                    <div
                                        className="status"
                                        data-testid="collection-status"
                                    >
                                        ${this.getCollectionStatus()}
                                    <//>
                                <//>
                                <${UploadStep} step="2" action="בוחרים תמונות">
                                    <label
                                        htmlFor="uploader"
                                        className="${`button uploader-wrapper ${
                                            isLoading
                                                ? 'button__disabled'
                                                : null
                                        }`}"
                                    >
                                        בחירת תמונות
                                        <input
                                            type="file"
                                            id="uploader"
                                            className="uploader-input"
                                            multiple
                                            onChange=${this
                                                .handleFilesSelection}
                                            ref=${c => (this.filesRef = c)}
                                            disabled=${isLoading}
                                            accept="image/*"
                                        />
                                    <//>
                                    <div
                                        className="status"
                                        data-testid="uploader-status"
                                    >
                                        ${this.getFilesStatus()}
                                    <//>
                                <//>
                                <${UploadStep} step="3" action="מעלים">
                                    <div className="submit-wrapper">
                                        <button
                                            className="button"
                                            disabled=${!this.isValid() ||
                                                isLoading}
                                            onClick=${this.handleSubmit}
                                            data-testid="submit-button"
                                        >
                                            <span
                                                className="${isLoading
                                                    ? 'spinner'
                                                    : null}"
                                                >${isLoading
                                                    ? null
                                                    : 'העלאה'}<//
                                            >
                                        <//>
                                    <//>
                                    <div className="status">
                                        ${this.getSubmissionStatus()}
                                    <//>
                                <//>
                            <//>
                        `}
                <//>
                <${CSSTransition}
                    in=${successVisible}
                    timeout=${{ enter: 500, exit: 300 }}
                    classNames="fade-in-out"
                    unmountOnExit
                    onExited=${() => this.setState({ formVisible: true })}
                >
                    ${() => html`
                        <div className="main">
                            <div className="checkmark-wrapper">
                                <${CheckMark} />
                            <//>
                            <div className="success-message">
                                הקבצים נשלחו בהצלחה
                            <//>
                            <div className="restart-wrapper">
                                <button
                                    className="button"
                                    onClick=${() =>
                                        this.setState({
                                            successVisible: false,
                                        })}
                                >
                                    להתחיל מחדש
                                <//>
                            <//>
                        <//>
                    `}
                <//>
            <//>
        `;
    }
}

export default UploadForm;
