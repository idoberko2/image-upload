import React from 'react';

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

const FirstStep = ({ isDisabled, collection, isCollectionValid, onChange }) => (
    <UploadStep
        step="1"
        action="בוחרים שם לאלבום"
        status={getCollectionStatus(isCollectionValid)}
    >
        <TextInput
            type="text"
            id="collection"
            placeholder="שם האלבום"
            value={collection}
            onChange={onChange}
            disabled={isDisabled}
        />
    </UploadStep>
);

export default FirstStep;
