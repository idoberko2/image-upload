import React from 'react';
import styled from '@emotion/styled';

import UploadStep from './UploadStep';
import StatusRow from './StatusRow';
import Spinner from '../common/Spinner';
import ErrorMark from '../icons/ErrorMark';
import smallIconCss from '../icons/smallIconCss';
import getButtonCss from '../common/buttonCss';

const getSubmissionStatus = submitError =>
    !submitError ? null : (
        <StatusRow>
            <ErrorMark css={smallIconCss} />
            <div>קרתה שגיאה במהלך העלאת הקבצים :(</div>
        </StatusRow>
    );

const ThirdStep = ({ isDisabled, isLoading, onSubmit, submitError }) => (
    <UploadStep
        step="3"
        action="מעלים"
        status={getSubmissionStatus(submitError)}
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
`;

export default ThirdStep;
