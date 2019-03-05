// external
import React from 'react';
import styled from '@emotion/styled';

const StepHeader = ({ step, action }) => (
    <Wrapper>
        {step}
        <Description>{action}</Description>
    </Wrapper>
);

const Wrapper = styled.h1`
    font-size: 4em;
    color: var(--main-color);
    margin: 0 0 0.1em;
`;

const Description = styled.span`
    font-size: 0.4em;
    font-weight: normal;
    margin: 0 0.5em;
`;

export default StepHeader;
