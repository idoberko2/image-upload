import React from 'react';
import { css } from '@emotion/core';

import UploadStep from './UploadStep';
import StatusRow from './StatusRow';
import TextInput from '../common/TextInput';
import ErrorMark from '../icons/ErrorMark';
import smallIconCss from '../icons/smallIconCss';

const getCollectionStatus = isCollectionValid =>
    isCollectionValid ? null : (
        <StatusRow>
            <ErrorMark css={smallIconCss} />
            <div data-testid="collection-status">
                שם האלבום לא יכול להיות ריק
            </div>
        </StatusRow>
    );

const FirstStep = ({
    isDisabled,
    collection,
    photographer,
    isCollectionValid,
    onCollectionChange,
    onPhotographerChange,
}) => (
    <UploadStep
        step="1"
        action="ממלאים פרטים"
        status={getCollectionStatus(isCollectionValid)}
    >
        <TextInput
            type="text"
            id="collection"
            placeholder="שם האלבום"
            value={collection}
            onChange={onCollectionChange}
            disabled={isDisabled}
        />
        <TextInput
            type="text"
            id="photographer"
            placeholder="שם הצלם"
            value={photographer}
            onChange={onPhotographerChange}
            disabled={isDisabled}
            css={css`
                margin-top: 0.5em;
            `}
        />
    </UploadStep>
);

export default FirstStep;
