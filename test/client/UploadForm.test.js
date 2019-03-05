import React from 'react';
import { render, mount } from 'enzyme';
import UploadForm from '../../src-client/js/components/UploadForm';

const findCollectionInput = wrapper =>
    wrapper.findWhere(
        n => n.name() === 'TextInput' && n.prop('id') === 'collection'
    );

describe('UploadForm', () => {
    test('matches snapshot', () => {
        expect(render(<UploadForm />)).toMatchSnapshot();
    });

    test('does not allow to submit in initial state', () => {
        const wrapper = mount(<UploadForm />);
        const submitButton = wrapper.find(
            'button[data-testid="submit-button"]'
        );

        expect(submitButton.exists()).toBe(true);
        expect(submitButton.prop('disabled')).toBe(true);
    });

    test('shows error indication when collection name is deleted', () => {
        const wrapper = mount(<UploadForm />);
        const collectionInput = findCollectionInput(wrapper);

        expect(wrapper.find('[data-testid="collection-status"]')).toHaveLength(
            0
        );

        collectionInput.simulate('change', {
            target: { value: 'collection name' },
        });
        collectionInput.simulate('change', { target: { value: '' } });

        expect(
            wrapper.find('[data-testid="collection-status"]').text()
        ).toEqual('שם האלבום לא יכול להיות ריק');
    });

    test('handles single file selection correctly', () => {
        const wrapper = mount(<UploadForm />);
        const uploaderInput = wrapper.find('input#uploader');

        expect(wrapper.find('[data-testid="uploader-status"]')).toHaveLength(0);

        uploaderInput.simulate('change', {
            target: {
                files: [
                    new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
                ],
            },
        });

        expect(wrapper.find('[data-testid="uploader-status"]').text()).toEqual(
            'קובץ אחד נבחר'
        );
    });

    test('handles multipe file selection correctly', () => {
        const wrapper = mount(<UploadForm />);
        const uploaderInput = wrapper.find('input#uploader');

        expect(wrapper.find('[data-testid="uploader-status"]')).toHaveLength(0);

        uploaderInput.simulate('change', {
            target: {
                files: Array(100)
                    .fill(0)
                    .map(
                        (_, i) =>
                            new File([`test${i}`], `test${i}.jpg`, {
                                type: 'image/jpeg',
                            })
                    ),
            },
        });

        expect(wrapper.find('[data-testid="uploader-status"]').text()).toEqual(
            '100 קבצים נבחרו'
        );
    });

    test('handles file selection cancellation correctly', () => {
        const wrapper = mount(<UploadForm />);
        const uploaderInput = wrapper.find('input#uploader');

        expect(wrapper.find('[data-testid="uploader-status"]')).toHaveLength(0);

        uploaderInput.simulate('change', {
            target: {
                files: [
                    new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
                ],
            },
        });

        // this is what happens when opens the file selection dialog and chooses "cancel"
        uploaderInput.simulate('change', { target: { files: [] } });

        expect(wrapper.find('[data-testid="uploader-status"]').text()).toEqual(
            'קובץ אחד נבחר'
        );
    });

    test('handles file types correctly', () => {
        const wrapper = mount(<UploadForm />);
        const uploaderInput = wrapper.find('input#uploader');

        expect(wrapper.find('[data-testid="uploader-status"]')).toHaveLength(0);

        uploaderInput.simulate('change', {
            target: {
                files: [
                    new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
                    new File(['test2'], 'test2.bmp', { type: 'image/bmp' }),
                    new File(['test3'], 'test3.gif', { type: 'image/gif' }),
                ],
            },
        });

        expect(wrapper.find('[data-testid="uploader-status"]').text()).toEqual(
            '3 קבצים נבחרו'
        );

        uploaderInput.simulate('change', {
            target: {
                files: [
                    new File(['test4'], 'test4.txt', { type: 'text/plain' }),
                ],
            },
        });

        expect(wrapper.find('[data-testid="uploader-status"]').text()).toEqual(
            'לפחות אחד מהקבצים אינו תמונה'
        );
    });

    test('enables and disables the submission button correctly', () => {
        const wrapper = mount(<UploadForm />);
        const uploaderInput = wrapper.find('input#uploader');
        const collectionInput = findCollectionInput(wrapper);

        const initializeValidForm = () => {
            collectionInput.simulate('change', {
                target: { value: 'collection name' },
            });

            uploaderInput.simulate('change', {
                target: {
                    files: [
                        new File(['test1'], 'test1.jpg', {
                            type: 'image/jpeg',
                        }),
                    ],
                },
            });
        };

        // test valid form
        initializeValidForm();
        expect(
            wrapper.find('button[data-testid="submit-button"]').prop('disabled')
        ).toBe(false);

        // change collection name to be invalid
        collectionInput.simulate('change', {
            target: { value: '' },
        });
        expect(
            wrapper.find('button[data-testid="submit-button"]').prop('disabled')
        ).toBe(true);

        // retest valid form
        initializeValidForm();
        expect(
            wrapper.find('button[data-testid="submit-button"]').prop('disabled')
        ).toBe(false);

        // change uploader files to be invalid
        uploaderInput.simulate('change', {
            target: {
                files: [
                    new File(['test1'], 'test1.txt', {
                        type: 'text/plain',
                    }),
                ],
            },
        });
        expect(
            wrapper.find('button[data-testid="submit-button"]').prop('disabled')
        ).toBe(true);

        // retest valid form
        initializeValidForm();
        expect(
            wrapper.find('button[data-testid="submit-button"]').prop('disabled')
        ).toBe(false);
    });
});
