// external
import React from 'react';
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

const findInputById = (wrapper, id) =>
    wrapper.findWhere(n => n.name() === 'TextInput' && n.prop('id') === id);

describe('App', () => {
    test('submits correctly', done => {
        const wrapper = mount(<App />);
        const collectionInput = findInputById(wrapper, 'collection');
        const galleryNameInput = findInputById(wrapper, 'galleryName');
        const seasonInput = findInputById(wrapper, 'season');
        const photographerInput = findInputById(wrapper, 'photographer');
        const uploaderInput = wrapper.find('input#uploader');
        const uploadTestFile = new File(['test1'], 'test1.jpg', {
            type: 'image/jpeg',
        });

        collectionInput.simulate('change', {
            target: { name: 'collection', value: '  collection name         ' },
        });
        galleryNameInput.simulate('change', {
            target: { name: 'galleryName', value: '     gallery name     ' },
        });
        seasonInput.simulate('change', {
            target: { name: 'season', value: '     2018-2019        ' },
        });
        photographerInput.simulate('change', {
            target: { name: 'photographer', value: ' photographer name ' },
        });
        uploaderInput.simulate('change', {
            target: {
                name: 'files',
                files: [uploadTestFile],
            },
        });

        axiosMock.onPost().replyOnce(200);

        wrapper
            .find(MyInnerForm)
            .find('form')
            .simulate('submit', {
                preventDefault: () => {},
            });

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

    test('handles failure correctly', done => {
        const wrapper = mount(<App />);
        const collectionInput = findInputById(wrapper, 'collection');
        const galleryNameInput = findInputById(wrapper, 'galleryName');
        const seasonInput = findInputById(wrapper, 'season');
        const photographerInput = findInputById(wrapper, 'photographer');
        const uploaderInput = wrapper.find('input#uploader');

        collectionInput.simulate('change', {
            target: { name: 'collection', value: 'c' },
        });
        galleryNameInput.simulate('change', {
            target: { name: 'galleryName', value: 'g' },
        });
        seasonInput.simulate('change', {
            target: { name: 'season', value: '2018-2019' },
        });
        photographerInput.simulate('change', {
            target: { name: 'photographer', value: 'photographer name' },
        });
        uploaderInput.simulate('change', {
            target: {
                name: 'files',
                files: [
                    new File(['test1'], 'test1.jpg', {
                        type: 'image/jpeg',
                    }),
                ],
            },
        });

        axiosMock.onPost().replyOnce(500);

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
