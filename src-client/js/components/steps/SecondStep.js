// external
import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

// components
import UploadStep from './UploadStep';
import StatusRow from './StatusRow';
import CheckMark from '../icons/CheckMark';
import ErrorMark from '../icons/ErrorMark';

// styles
import { mq } from '../common/globalCss';
import smallIconCss from '../icons/smallIconCss';
import getButtonCss from '../common/buttonCss';

const FilesStatus = ({ files, filesError, isFilesTouched }) => {
    if (!isFilesTouched) {
        return null;
    }

    if (!filesError) {
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
            <div data-testid="uploader-status">{filesError}</div>
        </StatusRow>
    );
};

const SecondStep = ({
    isDisabled,
    files,
    filesError,
    isFilesTouched,
    inputRef,
    handleChange,
}) => (
    <UploadStep
        step="2"
        action="בוחרים תמונות"
        css={css`
            grid-column-start: 1;
            grid-row-start: 3;
            ${mq[0]} {
                grid-column-start: 2;
                grid-row-start: 1;
            }
        `}
    >
        <InputsWrapper>
            <UploaderWrapper htmlFor="uploader" css={getButtonCss(isDisabled)}>
                בחירת תמונות
                <input
                    type="file"
                    id="uploader"
                    name="files"
                    css={uploaderInputCss(isDisabled)}
                    multiple
                    onChange={handleChange}
                    ref={inputRef}
                    disabled={isDisabled}
                    accept="image/*"
                />
            </UploaderWrapper>
            <StatusContainer>
                <FilesStatus
                    files={files}
                    filesError={filesError}
                    isFilesTouched={isFilesTouched}
                />
            </StatusContainer>
        </InputsWrapper>
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

const InputsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 1.2em;
`;

const StatusContainer = styled.div`
    height: 2em;
    margin-top: 0.5em;
`;

export default SecondStep;
