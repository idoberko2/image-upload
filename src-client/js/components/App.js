// external
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import styled from '@emotion/styled';
import { Global } from '@emotion/core';

// utils
import validateFiles from '../utils/validateFiles';
import sendFiles from '../utils/sendFiles';

// components
import globalCss from './common/globalCss';

import Success from './pages/Success';
import Form from './pages/Form';

const uploadFormInitialState = {
    collection: '',
    collectionChanged: false,
    files: null,
    formVisible: true,
    isLoading: false,
    photographer: '',
    successVisible: false,
    submitError: null,
};

class App extends React.Component {
    constructor(props) {
        super(props);

        this.filesRef = null;
        this.state = uploadFormInitialState;

        this.handleCollectionChange = this.handleCollectionChange.bind(this);
        this.handlePhotographerChange = this.handlePhotographerChange.bind(
            this
        );
        this.handleFilesSelection = this.handleFilesSelection.bind(this);
        this.isCollectionValid = this.isCollectionValid.bind(this);
        this.isFilesValid = this.isFilesValid.bind(this);
        this.isValid = this.isValid.bind(this);
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

    handlePhotographerChange(event) {
        const photographer = event.target.value;
        this.setState({ photographer });
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

    isFilesValid() {
        return (
            !window.FileReader ||
            !window.Blob ||
            (this.state.files && validateFiles(this.state.files))
        );
    }

    isValid() {
        return this.isCollectionValid() && this.isFilesValid();
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
        const {
            collection,
            files,
            formVisible,
            isLoading,
            photographer,
            successVisible,
            submitError,
        } = this.state;

        return (
            <>
                <Global styles={globalCss} />
                <Wrapper>
                    <CSSTransition
                        in={formVisible}
                        timeout={{ enter: 500, exit: 300 }}
                        classNames="fade-in-out"
                        unmountOnExit
                        onExited={() => this.setState({ successVisible: true })}
                    >
                        {() => (
                            <Form
                                collection={collection}
                                submitError={submitError}
                                files={files}
                                filesRef={c => (this.filesRef = c)}
                                isCollectionValid={this.isCollectionValid()}
                                isFilesValid={this.isFilesValid()}
                                isSubmitDisabled={!this.isValid() || isLoading}
                                isLoading={isLoading}
                                onCollectionChange={this.handleCollectionChange}
                                onPhotographerChange={
                                    this.handlePhotographerChange
                                }
                                onFilesChange={this.handleFilesSelection}
                                onSubmit={this.handleSubmit}
                                photographer={photographer}
                            />
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
                            <Success
                                onReset={() =>
                                    this.setState({
                                        successVisible: false,
                                    })
                                }
                            />
                        )}
                    </CSSTransition>
                </Wrapper>
            </>
        );
    }
}

const Wrapper = styled.div`
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
`;

export default App;
