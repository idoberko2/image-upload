// external
import React from 'react';
import { Formik } from 'formik';
import getSeason from '../../utils/getSeason';

// utils
import sendFiles from '../../utils/sendFiles';
import validateFiles from '../../utils/validateFiles';

// components
import pageWrapperCss from '../common/pageWrapperCss';
import FirstStep from '../steps/FirstStep';
import SecondStep from '../steps/SecondStep';
import ThirdStep from '../steps/ThirdStep';

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
    <form css={pageWrapperCss} onSubmit={handleSubmit}>
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
            submitError={status && status.error}
        />
    </form>
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

export default Form;
