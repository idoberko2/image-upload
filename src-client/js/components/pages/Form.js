import React from 'react';

import PageWrapper from './PageWrapper';
import FirstStep from '../steps/FirstStep';
import SecondStep from '../steps/SecondStep';
import ThirdStep from '../steps/ThirdStep';

const Form = ({
    collection,
    isCollectionValid,
    isLoading,
    onCollectionChange,
    files,
    isFilesValid,
    onFilesChange,
    filesRef,
    isSubmitDisabled,
    onSubmit,
    submitError,
}) => (
    <PageWrapper>
        <FirstStep
            collection={collection}
            isCollectionValid={isCollectionValid}
            isDisabled={isLoading}
            onChange={onCollectionChange}
        />
        <SecondStep
            files={files}
            isFilesValid={isFilesValid}
            isDisabled={isLoading}
            onChange={onFilesChange}
            inputRef={filesRef}
        />
        <ThirdStep
            isDisabled={isSubmitDisabled}
            isLoading={isLoading}
            onSubmit={onSubmit}
            submitError={submitError}
        />
    </PageWrapper>
);

export default Form;
