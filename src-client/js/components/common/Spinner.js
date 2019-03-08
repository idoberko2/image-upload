import { keyframes } from '@emotion/core';
import styled from '@emotion/styled';

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

export default Spinner;
