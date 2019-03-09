// utils
import React from 'react';
import { css } from '@emotion/core';

const Icon = ({ path, ...props }) => (
    <svg css={iconCss} viewBox="0 0 512 512" {...props}>
        <path d={path} />
    </svg>
);

const iconCss = css`
    fill: var(--main-color);
`;

export default Icon;
