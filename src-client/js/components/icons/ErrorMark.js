// utils
import React from 'react';
import { css } from '@emotion/core';

// components
import Icon from './Icon';

const ErrorMark = props => (
    <Icon
        css={errorIconCss}
        path="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"
        {...props}
    />
);

const errorIconCss = css`
    fill: var(--error-color);
`;

export default ErrorMark;
