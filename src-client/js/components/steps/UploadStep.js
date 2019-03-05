// utils
import React from 'react';

// components
import StepHeader from './StepHeader';
import styled from '@emotion/styled';

const UploadStep = ({ step, action, children }) => (
    <Wrapper>
        <StepHeader step={step} action={action} />
        {children}
    </Wrapper>
);

const Wrapper = styled.div`
    margin: 0;
    padding: 0;
    padding-top: 2em;
    border-bottom: 1px solid #adadad;

    &:first-of-type {
        padding-top: 0;
    }

    &:last-of-type {
        border-bottom: 0;
    }
`;

export default UploadStep;
