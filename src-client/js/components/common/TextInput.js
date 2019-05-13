import styled from '@emotion/styled';
import { css } from '@emotion/core';

const TextInput = styled.input(
    ({ error }) => css`
        opacity: 1;
        border: none;
        border-radius: 0.3em;
        padding: 0.5em 0.8em;
        width: 100%;
        font-size: 1em;
        border: 1px solid ${error ? 'var(--error-color)' : '#a2a2a2'};
        transition: opacity 200ms, border-color 500ms;

        &:disabled {
            opacity: 0.7;
        }
    `
);

export default TextInput;
