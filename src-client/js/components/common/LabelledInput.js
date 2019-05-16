import { Field } from 'formik';
import { css } from '@emotion/core';
import TextInput from './TextInput';
import Label from './Label';
import InputError from './InputError';

const LabelledInput = ({ label, error, id, ...rest }) => {
    return (
        <div>
            <Label htmlFor={id}>{label}</Label>
            <Field
                component={TextInput}
                type="text"
                error={error}
                id={id}
                css={css`
                    margin-top: 0;
                `}
                {...rest}
            />
            <InputError data-testid={`${id}-error`}>{error}</InputError>
        </div>
    );
};

export default LabelledInput;
