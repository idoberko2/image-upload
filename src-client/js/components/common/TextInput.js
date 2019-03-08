import styled from '@emotion/styled';

const TextInput = styled.input`
    opacity: 1;
    border: none;
    border-radius: 0.5em;
    padding: 0.7em 1em;
    width: 100%;
    font-size: 1.3em;
    border: 1px solid #a2a2a2;
    transition: opacity 200ms;

    &:disabled {
        opacity: 0.7;
    }
`;

export default TextInput;
