import { css } from '@emotion/core';

export const buttonCss = css`
    color: rgb(231, 231, 231);
    background-color: var(--main-color);
    font-size: 1.3em;
    padding: 0.7em 0;
    border-radius: 0.5em;
    border: 0;
    transition: all 200ms;
    cursor: pointer;
    text-align: center;
    width: 100%;
    border: 1px solid var(--main-color);
    opacity: 1;
    transition: opacity 200ms;

    &:hover {
        background-color: var(--secondary-color);
    }

    &:active {
        background-color: var(--secondary-color-light);
        color: #333;
    }
`;

export const disabledButtonCss = css`
    cursor: default;
    opacity: 0.7;

    &:hover {
        background-color: var(--main-color);
    }

    &:active {
        background-color: var(--main-color);
        color: #333;
    }
`;

function getButtonCss(isDisabled) {
    const styles = [buttonCss];

    if (isDisabled) {
        styles.push(disabledButtonCss);
    }

    return styles;
}

export default getButtonCss;
