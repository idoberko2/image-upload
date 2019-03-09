import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import UploadStep from './UploadStep';
import StatusRow from './StatusRow';
import CheckMark from '../icons/CheckMark';
import ErrorMark from '../icons/ErrorMark';
import smallIconCss from '../icons/smallIconCss';
import getButtonCss from '../common/buttonCss';

const getFilesStatus = (files, isFilesValid) => {
    if (!files) {
        return null;
    }

    if (isFilesValid) {
        const text =
            files.length > 1 ? files.length + ' קבצים נבחרו' : 'קובץ אחד נבחר';
        return (
            <StatusRow>
                <CheckMark css={smallIconCss} />
                <div data-testid="uploader-status">{text}</div>
            </StatusRow>
        );
    }

    return (
        <StatusRow>
            <ErrorMark css={smallIconCss} />
            <div data-testid="uploader-status">
                לפחות אחד מהקבצים אינו תמונה
            </div>
        </StatusRow>
    );
};

const SecondStep = ({
    isDisabled,
    files,
    isFilesValid,
    inputRef,
    onChange,
}) => (
    <UploadStep
        step="2"
        action="בוחרים תמונות"
        status={getFilesStatus(files, isFilesValid)}
    >
        <UploaderWrapper htmlFor="uploader" css={getButtonCss(isDisabled)}>
            בחירת תמונות
            <input
                type="file"
                id="uploader"
                css={uploaderInputCss(isDisabled)}
                multiple
                onChange={onChange}
                ref={inputRef}
                disabled={isDisabled}
                accept="image/*"
            />
        </UploaderWrapper>
    </UploadStep>
);

const UploaderWrapper = styled.label`
    overflow: hidden;
    position: relative;
    width: 100%;
    display: block;
`;

const uploaderInputCss = disabled => css`
    /* hiding original input */
    display: block;
    font-size: 999px;
    filter: alpha(opacity=0);
    min-height: 100%;
    min-width: 100%;
    opacity: 0;
    position: absolute;
    right: 0;
    text-align: right;
    top: 0;

    /* style */
    cursor: ${disabled ? 'default' : 'pointer'};
`;

export default SecondStep;
