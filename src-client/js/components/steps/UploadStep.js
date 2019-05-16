// utils
import React from 'react';

// components
import StepHeader from './StepHeader';
import styled from '@emotion/styled';

const UploadStep = ({ step, action, children, className }) => (
    <Wrapper className={className}>
        <StepHeader step={step} action={action} />
        {children}
    </Wrapper>
);

const Wrapper = styled.div`
    margin: 0;
    padding: 0;
`;

export default UploadStep;
