// external
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/core';

// components
import Success from './pages/Success';
import Form from './pages/Form';

// styles
import globalCss, { mq } from './common/globalCss';

const appInitialState = {
    formVisible: true,
    successVisible: false,
};

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = appInitialState;

        this.handleSuccessfulSubmission = this.handleSuccessfulSubmission.bind(
            this
        );
    }

    handleSuccessfulSubmission(cb) {
        this.setState({ formVisible: false }, cb);
    }

    render() {
        const { formVisible, successVisible } = this.state;

        return (
            <>
                <Global styles={globalCss} />
                <Wrapper
                    css={css`
                        height: ${formVisible ? 'auto' : '100%'};
                    `}
                >
                    <CSSTransition
                        in={formVisible}
                        timeout={{ enter: 500, exit: 300 }}
                        classNames="fade-in-out"
                        unmountOnExit
                        onExited={() => this.setState({ successVisible: true })}
                    >
                        {() => (
                            <Form
                                handleSuccessfulSubmission={
                                    this.handleSuccessfulSubmission
                                }
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
    max-width: 1000px;
    height: auto;
    margin: 0 auto;

    ${mq[0]} {
        height: 100%;
    }

    display: flex;
    align-items: center;
    justify-content: center;
`;

export default App;
