// external
import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

// components
import UploadStep from './UploadStep';
import LabelledInput from '../common/LabelledInput';

// styles
import { mq } from '../common/globalCss';

const FirstStep = ({ isDisabled, handleChange, values, touched, errors }) => {
    return (
        <UploadStep
            step="1"
            action="ממלאים פרטים"
            css={css`
                grid-column-start: 1;
                grid-row-start: 1;
                grid-row-end: 2;
                ${mq[0]} {
                    grid-row-end: 3;
                }
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            `}
        >
            <InputsWrapper>
                <LabelledInput
                    id="collection"
                    name="collection"
                    label="שם התיקייה (אנגלית)"
                    error={touched.collection && errors.collection}
                    onChange={handleChange}
                    validate={value => (!value ? 'שדה חובה' : null)}
                    value={values.collection}
                    disabled={isDisabled}
                />
                <LabelledInput
                    id="galleryName"
                    name="galleryName"
                    label="שם הגלריה (עברית)"
                    error={touched.galleryName && errors.galleryName}
                    onChange={handleChange}
                    validate={value => (!value ? 'שדה חובה' : null)}
                    value={values.galleryName}
                    disabled={isDisabled}
                />
                <LabelledInput
                    id="season"
                    name="season"
                    label="עונה"
                    error={touched.season && errors.season}
                    onChange={handleChange}
                    validate={value => (!value ? 'ערך לא תקין' : null)}
                    value={values.season}
                    disabled={isDisabled}
                />
                <LabelledInput
                    id="photographer"
                    name="photographer"
                    label="שם הצלם"
                    error={touched.photographer && errors.photographer}
                    onChange={handleChange}
                    validate={value => (!value ? 'שדה חובה' : null)}
                    value={values.photographer}
                    disabled={isDisabled}
                />
            </InputsWrapper>
        </UploadStep>
    );
};

const InputsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 2;
`;

export default FirstStep;
