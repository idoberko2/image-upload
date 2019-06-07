// external
import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

// axios mock
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
const axiosMock = new MockAdapter(axios);

// components
import App from '../../src-client/js/components/App';
import {
    MyInnerForm,
    SubmissionError,
} from '../../src-client/js/components/pages/Form';
import Success, {
    SuccessMessage,
} from '../../src-client/js/components/pages/Success';

// utils
import getSeason from '../../src-client/js/utils/getSeason';

const findInputById = (wrapper, id) =>
    wrapper.findWhere(n => n.name() === 'TextInput' && n.prop('id') === id);

const submitForm = async (wrapper, uploadTestFile) => {
    jest.useFakeTimers();

    findInputById(wrapper, 'collection').simulate('change', {
        target: { name: 'collection', value: '  collection name         ' },
    });
    findInputById(wrapper, 'galleryName').simulate('change', {
        target: { name: 'galleryName', value: '     gallery name     ' },
    });
    findInputById(wrapper, 'season').simulate('change', {
        target: { name: 'season', value: '     2018-2019        ' },
    });
    findInputById(wrapper, 'photographer').simulate('change', {
        target: { name: 'photographer', value: ' photographer name ' },
    });
    wrapper.find('input#uploader').simulate('change', {
        target: {
            name: 'files',
            files: [uploadTestFile],
        },
    });

    await act(async () => {
        await wrapper
            .find(MyInnerForm)
            .find('form')
            .simulate('submit', {
                preventDefault: () => {},
            });
    });
    jest.runAllTimers();
};

describe('App', () => {
    test('submits correctly', async done => {
        const wrapper = mount(<App />);

        const uploadTestFile = new File(['test1'], 'test1.jpg', {
            type: 'image/jpeg',
        });
        axiosMock.onPost().replyOnce(200);
        await submitForm(wrapper, uploadTestFile);

        setImmediate(() => {
            expect(axiosMock.history.post.length).toBe(1);

            const actualBody = {};
            axiosMock.history.post[0].data.forEach((value, key) => {
                actualBody[key] = value;
            });
            expect(actualBody).toMatchSnapshot();
            expect(actualBody.images).toBe(uploadTestFile);
            done();
        });
    });

    test('resets the form correctly', async done => {
        const wrapper = mount(<App />);

        const uploadTestFile = new File(['test1'], 'test1.jpg', {
            type: 'image/jpeg',
        });
        axiosMock.onPost().replyOnce(200);
        await submitForm(wrapper, uploadTestFile);

        setImmediate(async () => {
            wrapper.update();
            expect(wrapper.find(SuccessMessage).text()).toMatchSnapshot();
            await act(async () => {
                await wrapper
                    .find(Success)
                    .find('[data-testid="button-reset"]')
                    .first()
                    .simulate('click');
            });
            jest.runAllTimers();

            setImmediate(() => {
                wrapper.update();

                expect(findInputById(wrapper, 'collection').props().value).toBe(
                    ''
                );
                expect(
                    findInputById(wrapper, 'galleryName').props().value
                ).toBe('');
                expect(findInputById(wrapper, 'season').props().value).toBe(
                    getSeason()
                );
                expect(
                    findInputById(wrapper, 'photographer').props().value
                ).toBe('');
                expect(
                    wrapper.find('input#uploader').props().value
                ).toBeUndefined();
            });

            done();
        });
    });

    test('handles failure correctly', async done => {
        const wrapper = mount(<App />);

        const uploadTestFile = new File(['test1'], 'test1.jpg', {
            type: 'image/jpeg',
        });
        axiosMock.onPost().replyOnce(500);
        await submitForm(wrapper, uploadTestFile);

        wrapper
            .find(MyInnerForm)
            .find('form')
            .simulate('submit', {
                preventDefault: () => {},
            });

        setImmediate(() => {
            expect(wrapper.find(SubmissionError).text()).toMatchSnapshot();

            done();
        });
    });
});
