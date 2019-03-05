// utils
import React from 'react';
import { css } from '@emotion/core';

// components
import Icon from './Icon';

const CheckMark = props => (
    <Icon
        css={successIconCss}
        path="M186.301 339.893L96 249.461l-32 30.507L186.301 402 448 140.506 416 110z"
        {...props}
    />
);

const successIconCss = css`
    fill: var(--success-color);
`;

export default CheckMark;
