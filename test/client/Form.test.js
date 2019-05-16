// external
import React from 'react';
import { mount } from 'enzyme';

// components
import Form from '../../src-client/js/components/pages/Form';

const findInputById = (wrapper, id) =>
    wrapper.findWhere(n => n.name() === 'TextInput' && n.prop('id') === id);

describe('Form', () => {
    test('does not allow to submit in initial state', () => {
        const wrapper = mount(<Form />);
        const submitButton = wrapper.find(
            'button[data-testid="submit-button"]'
        );

        expect(submitButton.exists()).toBe(true);
        expect(submitButton.prop('disabled')).toBe(true);
    });

    test('handles single file selection correctly', () => {
        const wrapper = mount(<Form />);
        const uploaderInput = wrapper.find('input#uploader');

        expect(wrapper.find('[data-testid="uploader-status"]')).toHaveLength(0);

        uploaderInput.simulate('change', {
            target: {
                files: [
                    new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
                ],
            },
        });

        expect(
            wrapper.find('[data-testid="uploader-status"]').text()
        ).toMatchSnapshot();
    });

    test('handles multipe file selection correctly', () => {
        const wrapper = mount(<Form />);
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

        expect(
            wrapper.find('[data-testid="uploader-status"]').text()
        ).toMatchSnapshot();
    });

    test('handles file selection cancellation correctly', () => {
        const wrapper = mount(<Form />);
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

        expect(
            wrapper.find('[data-testid="uploader-status"]').text()
        ).toMatchSnapshot();
    });

    test('handles file types correctly', done => {
        const wrapper = mount(<Form />);
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

        expect(
            wrapper.find('[data-testid="uploader-status"]').text()
        ).toMatchSnapshot();

        uploaderInput.simulate('change', {
            target: {
                files: [
                    new File(['test4'], 'test4.txt', { type: 'text/plain' }),
                ],
            },
        });

        setImmediate(() => {
            expect(
                wrapper.find('[data-testid="uploader-status"]').text()
            ).toMatchSnapshot();
            done();
        });
    });

    describe('enables and disables the submission button correctly', () => {
        const initializeValidForm = wrapper => {
            findInputById(wrapper, 'collection').simulate('change', {
                target: { name: 'collection', value: 'collection name' },
            });
            findInputById(wrapper, 'galleryName').simulate('change', {
                target: { name: 'galleryName', value: 'gallery name' },
            });
            findInputById(wrapper, 'season').simulate('change', {
                target: { name: 'season', value: '2018-2019' },
            });
            findInputById(wrapper, 'photographer').simulate('change', {
                target: { name: 'photographer', value: 'photographer name' },
            });

            wrapper.find('input#uploader').simulate('change', {
                target: {
                    name: 'files',
                    files: [
                        new File(['test1'], 'test1.jpg', {
                            type: 'image/jpeg',
                        }),
                    ],
                },
            });
        };

        test('initially submit is disabled', () => {
            const wrapper = mount(<Form />);

            expect(
                wrapper
                    .find('button[data-testid="submit-button"]')
                    .prop('disabled')
            ).toBe(true);
        });

        test('invalid collection disables submit button', done => {
            const wrapper = mount(<Form />);
            initializeValidForm(wrapper);

            expect(
                wrapper
                    .find('button[data-testid="submit-button"]')
                    .prop('disabled')
            ).toBe(false);

            findInputById(wrapper, 'collection').simulate('change', {
                target: { name: 'collection', value: '' },
            });

            setImmediate(() => {
                wrapper.update();

                expect(
                    wrapper
                        .find('button[data-testid="submit-button"]')
                        .prop('disabled')
                ).toBe(true);
                done();
            });
        });

        test('invalid gallery name disables submit button', done => {
            const wrapper = mount(<Form />);
            initializeValidForm(wrapper);

            expect(
                wrapper
                    .find('button[data-testid="submit-button"]')
                    .prop('disabled')
            ).toBe(false);

            findInputById(wrapper, 'galleryName').simulate('change', {
                target: { name: 'galleryName', value: '' },
            });

            setImmediate(() => {
                wrapper.update();

                expect(
                    wrapper
                        .find('button[data-testid="submit-button"]')
                        .prop('disabled')
                ).toBe(true);
                done();
            });
        });

        test('invalid season disables submit button', done => {
            const wrapper = mount(<Form />);
            initializeValidForm(wrapper);

            expect(
                wrapper
                    .find('button[data-testid="submit-button"]')
                    .prop('disabled')
            ).toBe(false);

            findInputById(wrapper, 'season').simulate('change', {
                target: { name: 'season', value: '' },
            });

            setImmediate(() => {
                wrapper.update();

                expect(
                    wrapper
                        .find('button[data-testid="submit-button"]')
                        .prop('disabled')
                ).toBe(true);
                done();
            });
        });

        test('invalid photographer disables submit button', done => {
            const wrapper = mount(<Form />);
            initializeValidForm(wrapper);

            expect(
                wrapper
                    .find('button[data-testid="submit-button"]')
                    .prop('disabled')
            ).toBe(false);

            findInputById(wrapper, 'photographer').simulate('change', {
                target: { name: 'photographer', value: '' },
            });

            setImmediate(() => {
                wrapper.update();

                expect(
                    wrapper
                        .find('button[data-testid="submit-button"]')
                        .prop('disabled')
                ).toBe(true);
                done();
            });
        });

        test('invalid file disables submit button', done => {
            const wrapper = mount(<Form />);
            initializeValidForm(wrapper);

            expect(
                wrapper
                    .find('button[data-testid="submit-button"]')
                    .prop('disabled')
            ).toBe(false);

            wrapper.find('input#uploader').simulate('change', {
                target: {
                    name: 'files',
                    files: [
                        new File(['test1'], 'test1.txt', {
                            type: 'text/plain',
                        }),
                    ],
                },
            });

            setImmediate(() => {
                wrapper.update();

                expect(
                    wrapper
                        .find('button[data-testid="submit-button"]')
                        .prop('disabled')
                ).toBe(true);
                done();
            });
        });
    });
});
