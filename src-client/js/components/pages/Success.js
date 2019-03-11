import React from 'react';
import styled from '@emotion/styled';

import PageWrapper from './PageWrapper';
import CheckMark from '../icons/CheckMark';
import { buttonCss } from '../common/buttonCss';

const Success = ({ onReset }) => (
    <PageWrapper>
        <div>
            <CheckMark />
        </div>
        <SuccessMessage>הקבצים נשלחו בהצלחה</SuccessMessage>
        <div>
            <button css={buttonCss} onClick={onReset}>
                להתחיל מחדש
            </button>
        </div>
    </PageWrapper>
);

const SuccessMessage = styled.div`
    font-size: 2em;
    color: var(--main-color);
    margin-bottom: 1em;
    text-align: center;
`;

export default Success;