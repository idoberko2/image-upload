// external
import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/core';

// components
import Success from './pages/Success';
import Form from './pages/Form';

// styles
import globalCss, { mq } from './common/globalCss';

const App = () => {
    const [page, setPage] = useState('form');
    const [inTransition, setInTransition] = useState(false);

    return (
        <>
            <Global styles={globalCss} />
            <Wrapper
                css={css`
                    height: ${page === 'form' ? 'auto' : '100%'};
                `}
            >
                <CSSTransition
                    in={page === 'form' && !inTransition}
                    timeout={{ enter: 500, exit: 300 }}
                    classNames="fade-in-out"
                    unmountOnExit
                    onExited={() => {
                        setPage('success');
                        setInTransition(false);
                    }}
                >
                    {() => (
                        <Form
                            handleSuccessfulSubmission={() =>
                                setInTransition(true)
                            }
                        />
                    )}
                </CSSTransition>
                <CSSTransition
                    in={page === 'success' && !inTransition}
                    timeout={{ enter: 500, exit: 300 }}
                    classNames="fade-in-out"
                    unmountOnExit
                    onExited={() => {
                        setPage('form');
                        setInTransition(false);
                    }}
                >
                    {() => <Success onReset={() => setInTransition(true)} />}
                </CSSTransition>
            </Wrapper>
        </>
    );
};

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
