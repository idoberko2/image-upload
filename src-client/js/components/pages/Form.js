// external
import React from 'react';
import { Formik } from 'formik';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

// utils
import sendFiles from '../../utils/sendFiles';
import validateFiles from '../../utils/validateFiles';
import getSeason from '../../utils/getSeason';

// components
import FirstStep from '../steps/FirstStep';
import SecondStep from '../steps/SecondStep';
import ThirdStep from '../steps/ThirdStep';
import StatusRow from '../steps/StatusRow';
import ErrorMark from '../icons/ErrorMark';

// styles
import { mq } from '../common/globalCss';
import smallIconCss from '../icons/smallIconCss';

const formInitialValues = {
    collection: '',
    files: [],
    galleryName: '',
    photographer: '',
    season: getSeason(),
};

let filesRef = null;

function handleFilesChange(setFieldValue, setFieldTouched, event) {
    const { files } = event.target;

    if (!files || files.length === 0) {
        return;
    }

    setFieldValue('files', files);
    setFieldTouched('files');
}

function validate({ files }) {
    const filesArray = Array.from(files);
    let errors = {};

    if (filesArray.length === 0) {
        errors.files = 'לא נבחרו קבצים';
    } else if (
        !window.FileReader ||
        !window.Blob ||
        !validateFiles(filesArray)
    ) {
        errors.files = 'לפחות אחד מהקבצים אינו תמונה';
    }

    return errors;
}

export const MyInnerForm = ({
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    isValid,
    values,
    setFieldValue,
    setFieldTouched,
    status,
    touched,
}) => (
    <FormWrapper onSubmit={handleSubmit}>
        <FirstStep
            errors={errors}
            isDisabled={isSubmitting}
            handleChange={event => {
                handleChange(event);
                setFieldTouched(event.currentTarget.id, true);
            }}
            touched={touched}
            values={values}
        />
        <SecondStep
            files={values.files}
            filesError={errors.files}
            isFilesTouched={touched.files}
            isDisabled={isSubmitting}
            handleChange={event => {
                handleFilesChange(setFieldValue, setFieldTouched, event);
            }}
            inputRef={c => (filesRef = c)}
        />
        <ThirdStep
            isDisabled={!isValid || isSubmitting}
            isLoading={isSubmitting}
        />
        <SubmissionError error={status && status.error} />
    </FormWrapper>
);

const handleSubmit = (
    handleSuccessfulSubmission,
    values,
    { resetForm, setSubmitting, setStatus }
) =>
    sendFiles(values)
        .then(() => {
            handleSuccessfulSubmission(() => {
                filesRef.value = '';
                resetForm(formInitialValues);
                setSubmitting(false);
            });
        })
        .catch(err => {
            setStatus({ error: err });
            setSubmitting(false);
        });

const Form = ({ handleSuccessfulSubmission }) => (
    <Formik
        component={MyInnerForm}
        onSubmit={handleSubmit.bind(null, handleSuccessfulSubmission)}
        initialValues={formInitialValues}
        validate={validate}
    />
);

const FormWrapper = styled.form`
    margin: 0;
    padding: 0;
    width: 80%;
    max-width: 40em;

    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: auto;
    grid-column-gap: 10%;
    grid-row-gap: 2em;

    ${mq} {
        grid-template-columns: 45% 45%;
    }
`;

export const SubmissionError = ({ error }) => (
    <StatusRow
        css={css`
            grid-column-start: 1;
            grid-row-start: 3;
            grid-column-end: 3;
            justify-content: center;
        `}
    >
        {!error ? null : (
            <>
                <ErrorMark css={smallIconCss} />
                <div>קרתה שגיאה במהלך העלאת הקבצים :(</div>
            </>
        )}
    </StatusRow>
);

export default Form;
