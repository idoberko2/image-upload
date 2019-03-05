// external
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import styled from '@emotion/styled';
import { css, keyframes, Global } from '@emotion/core';

// utils
import validateFiles from '../utils/validateFiles';
import sendFiles from '../utils/sendFiles';

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
        return this.isCollectionValid() ? null : (
            <StatusRow>
                <ErrorMark css={smallIconCss} />
                <div data-testid="collection-status">
                    שם האלבום לא יכול להיות ריק
                </div>
            </StatusRow>
        );
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
            return (
                <StatusRow>
                    <CheckMark css={smallIconCss} />
                    <div data-testid="uploader-status">{text}</div>
                </StatusRow>
            );
        }

        return (
            <StatusRow>
                <ErrorMark css={smallIconCss} />
                <div data-testid="uploader-status">
                    לפחות אחד מהקבצים אינו תמונה
                </div>
            </StatusRow>
        );
    }

    isValid() {
        return this.isCollectionValid() && this.isFilesValid();
    }

    getSubmissionStatus() {
        return !this.state.submitError ? null : (
            <StatusRow>
                <ErrorMark css={smallIconCss} />
                <div>קרתה שגיאה במהלך העלאת הקבצים :(</div>
            </StatusRow>
        );
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

        return (
            <>
                <Global styles={globalStyles} />
                <Form>
                    <CSSTransition
                        in={formVisible}
                        timeout={{ enter: 500, exit: 300 }}
                        classNames="fade-in-out"
                        unmountOnExit
                        onExited={() => this.setState({ successVisible: true })}
                    >
                        {() => (
                            <Wrapper>
                                <UploadStep step="1" action="בוחרים שם לאלבום">
                                    <TextInput
                                        type="text"
                                        id="collection"
                                        placeholder="שם האלבום"
                                        value={this.state.collection}
                                        onChange={this.handleCollectionChange}
                                        disabled={isLoading}
                                    />
                                    <StatusContainer>
                                        {this.getCollectionStatus()}
                                    </StatusContainer>
                                </UploadStep>
                                <UploadStep step="2" action="בוחרים תמונות">
                                    <UploaderWrapper
                                        htmlFor="uploader"
                                        css={[
                                            ButtonCss,
                                            isLoading
                                                ? DisabledButtonCss
                                                : null,
                                        ]}
                                    >
                                        בחירת תמונות
                                        <input
                                            type="file"
                                            id="uploader"
                                            css={UploaderInputCss(isLoading)}
                                            multiple
                                            onChange={this.handleFilesSelection}
                                            ref={c => (this.filesRef = c)}
                                            disabled={isLoading}
                                            accept="image/*"
                                        />
                                    </UploaderWrapper>
                                    <StatusContainer>
                                        {this.getFilesStatus()}
                                    </StatusContainer>
                                </UploadStep>
                                <UploadStep step="3" action="מעלים">
                                    <SubmitWrapper>
                                        <button
                                            disabled={
                                                !this.isValid() || isLoading
                                            }
                                            onClick={this.handleSubmit}
                                            data-testid="submit-button"
                                            css={[
                                                ButtonCss,
                                                !this.isValid() || isLoading
                                                    ? DisabledButtonCss
                                                    : null,
                                            ]}
                                        >
                                            {isLoading ? <Spinner /> : 'העלאה'}
                                        </button>
                                    </SubmitWrapper>
                                    <StatusContainer>
                                        {this.getSubmissionStatus()}
                                    </StatusContainer>
                                </UploadStep>
                            </Wrapper>
                        )}
                    </CSSTransition>
                    <CSSTransition
                        in={successVisible}
                        timeout={{ enter: 500, exit: 300 }}
                        classNames="fade-in-out"
                        unmountOnExit
                        onExited={() => this.setState({ formVisible: true })}
                    >
                        {() => (
                            <Wrapper>
                                <div>
                                    <CheckMark />
                                </div>
                                <SuccessMessage>
                                    הקבצים נשלחו בהצלחה
                                </SuccessMessage>
                                <div>
                                    <button
                                        css={ButtonCss}
                                        onClick={() =>
                                            this.setState({
                                                successVisible: false,
                                            })
                                        }
                                    >
                                        להתחיל מחדש
                                    </button>
                                </div>
                            </Wrapper>
                        )}
                    </CSSTransition>
                </Form>
            </>
        );
    }
}

const Form = styled.div`
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
`;

const Wrapper = styled.div`
    margin: 0;
    padding: 0;
    height: 30em;
    width: 20em;
    display: flex;
    flex-direction: column;
`;

const TextInput = styled.input`
    opacity: 1;
    border: none;
    border-radius: 0.5em;
    padding: 0.7em 1em;
    width: 100%;
    font-size: 1.3em;
    border: 1px solid #a2a2a2;
    transition: opacity 200ms;

    &:disabled {
        opacity: 0.7;
    }
`;

const UploaderWrapper = styled.label`
    overflow: hidden;
    position: relative;
    width: 100%;
    display: block;
`;

const SubmitWrapper = styled.div`
    width: 100%;
`;

const ButtonCss = css`
    color: rgb(231, 231, 231);
    background-color: var(--main-color);
    font-size: 1.3em;
    padding: 0.7em 0;
    border-radius: 0.5em;
    border: 0;
    transition: all 200ms;
    cursor: pointer;
    text-align: center;
    width: 100%;
    border: 1px solid var(--main-color);
    opacity: 1;
    transition: opacity 200ms;

    &:hover {
        background-color: var(--secondary-color);
    }

    &:active {
        background-color: var(--secondary-color-light);
        color: #333;
    }
`;

const DisabledButtonCss = css`
    cursor: default;
    opacity: 0.7;

    &:hover {
        background-color: var(--main-color);
    }

    &:active {
        background-color: var(--main-color);
        color: #333;
    }
`;

const UploaderInputCss = disabled => css`
    /* hiding original input */
    display: block;
    font-size: 999px;
    filter: alpha(opacity=0);
    min-height: 100%;
    min-width: 100%;
    opacity: 0;
    position: absolute;
    right: 0;
    text-align: right;
    top: 0;

    /* style */
    cursor: ${disabled ? 'default' : 'pointer'};
`;

const StatusContainer = styled.div`
    height: 2em;
    margin-top: 0.5em;
`;

const StatusRow = styled.div`
    display: flex;
    align-items: center;

    & > * {
        margin-left: 0.5em;
    }
`;

const SuccessMessage = styled.div`
    font-size: 2em;
    color: var(--main-color);
    margin-bottom: 1em;
    text-align: center;
`;

const spin = keyframes`
    to {
        -webkit-transform: rotate(360deg);
    }
`;

const Spinner = styled.span`
    display: inline-block;
    width: 0.86em;
    height: 0.86em;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: rgb(231, 231, 231);
    animation: spin 0.6s linear infinite;
    -webkit-animation: ${spin} 0.6s linear infinite;
`;

const smallIconCss = css`
    width: 2em;
    height: 2em;
`;

const globalStyles = css`
    :root {
        --main-color: #4d4e4d;
        --secondary-color: #a73a3a;
        --secondary-color-light: #e04e4e;
        --error-color: #d80000;
        --success-color: #4c9a4c;
    }

    body {
        font: 1em Arial;
        background-image: linear-gradient(to bottom right, #a1a1a1, #cfcfcf);
        direction: rtl;
        color: var(--main-color);
    }

    ::placeholder,
    :-ms-input-placeholder,
    ::-ms-input-placeholder {
        text-align: center;
    }

    .fade-in-out-enter {
        opacity: 0.01;
    }

    .fade-in-out-enter-active {
        opacity: 1;
        transition: opacity 500ms;
    }

    .fade-in-out-leave {
        opacity: 1;
    }

    .fade-in-out-leave-active {
        opacity: 0.01;
        transition: opacity 300ms;
    }
`;

export default UploadForm;
