import { css } from '@emotion/core';

export const mq = ['@media (min-width: 768px)', '@media (min-width: 1200px)'];

const globalStyles = css`
    :root {
        --main-color: #4d4e4d;
        --secondary-color: #a73a3a;
        --secondary-color-light: #e04e4e;
        --error-color: #d80000;
        --success-color: #4c9a4c;
    }

    body {
        font-family: 'Rubik', sans-serif;
        font-size: 4vw;
        ${mq[0]} {
            font-size: 2vw;
        }
        ${mq[1]} {
            font-size: 24px;
        }
        background-image: linear-gradient(to bottom right, #a1a1a1, #cfcfcf);
        direction: rtl;
        color: var(--main-color);
    }

    input,
    button {
        font-family: inherit;
    }

    .fade-in-out-enter {
        opacity: 0.01;
    }

    .fade-in-out-enter-active {
        opacity: 1;
        transition: opacity 500ms;
    }

    .fade-in-out-leave {
        opacity: 1;
    }

    .fade-in-out-leave-active {
        opacity: 0.01;
        transition: opacity 300ms;
    }
`;

export default globalStyles;
