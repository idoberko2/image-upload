import React from 'react';
import styled from '@emotion/styled';

import CheckMark from '../icons/CheckMark';
import { buttonCss } from '../common/buttonCss';
import { mq } from '../common/globalCss';

const Success = ({ onReset }) => (
    <Wrapper>
        <div>
            <CheckMark />
        </div>
        <SuccessMessage>הקבצים נשלחו בהצלחה</SuccessMessage>
        <div>
            <button
                css={buttonCss}
                onClick={onReset}
                data-testid="button-reset"
            >
                להתחיל מחדש
            </button>
        </div>
    </Wrapper>
);

export const SuccessMessage = styled.div`
    font-size: 2em;
    color: var(--main-color);
    margin-bottom: 1em;
    text-align: center;
`;

const Wrapper = styled.div`
    margin: 0;
    padding: 0;
    width: 80%;

    ${mq[0]} {
        width: 40%;
    }
`;

export default Success;
