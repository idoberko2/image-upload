// external
import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

// components
import UploadStep from './UploadStep';
import Spinner from '../common/Spinner';

// styles
import { mq } from '../common/globalCss';
import getButtonCss from '../common/buttonCss';

const ThirdStep = ({ isDisabled, isLoading }) => (
    <UploadStep
        step="3"
        action="מעלים"
        css={css`
            grid-column-start: 1;
            grid-column-end: 2;
            grid-row-start: 4;
            grid-row-end: 5;

            ${mq} {
                grid-column-start: 2;
                grid-column-end: 3;
                grid-row-start: 2;
                grid-row-end: 3;
            }
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        `}
    >
        <SubmitWrapper>
            <button
                type="submit"
                disabled={isDisabled}
                data-testid="submit-button"
                css={getButtonCss(isDisabled)}
            >
                {isLoading ? <Spinner /> : 'העלאה'}
            </button>
        </SubmitWrapper>
    </UploadStep>
);

const SubmitWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-bottom: 1rem;
`;

export default ThirdStep;
