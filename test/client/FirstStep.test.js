import { mount } from 'enzyme';
import App from '../../src-client/js/components/App';
import FirstStep from '../../src-client/js/components/steps/FirstStep';

describe('App', () => {
    test('shows error indication when collection field is invalid', done => {
        const wrapper = mount(<App />);

        expect(
            wrapper
                .find(FirstStep)
                .find('[data-testid="collection-error"]')
                .first()
                .text()
        ).toEqual('');

        wrapper
            .find(FirstStep)
            .find('input#collection')
            .simulate('change', {
                persist: () => {},
                target: { name: 'collection', value: 'collection name' },
            });
        wrapper
            .find(FirstStep)
            .find('input#collection')
            .simulate('change', {
                persist: () => {},
                target: { name: 'collection', value: '' },
            });

        setTimeout(() => {
            expect(
                wrapper
                    .find(FirstStep)
                    .find('[data-testid="collection-error"]')
                    .first()
                    .text()
            ).toEqual('שדה חובה');
            done();
        });
    });

    test('shows error indication when galleryName field is invalid', done => {
        const wrapper = mount(<App />);

        expect(
            wrapper
                .find(FirstStep)
                .find('[data-testid="galleryName-error"]')
                .first()
                .text()
        ).toEqual('');

        wrapper
            .find(FirstStep)
            .find('input#galleryName')
            .simulate('change', {
                persist: () => {},
                target: { name: 'galleryName', value: 'gallery name' },
            });
        wrapper
            .find(FirstStep)
            .find('input#galleryName')
            .simulate('change', {
                persist: () => {},
                target: { name: 'galleryName', value: '' },
            });

        setTimeout(() => {
            expect(
                wrapper
                    .find(FirstStep)
                    .find('[data-testid="galleryName-error"]')
                    .first()
                    .text()
            ).toEqual('שדה חובה');
            done();
        });
    });

    test('shows error indication when season field is invalid', done => {
        const wrapper = mount(<App />);

        expect(
            wrapper
                .find(FirstStep)
                .find('[data-testid="season-error"]')
                .first()
                .text()
        ).toEqual('');

        wrapper
            .find(FirstStep)
            .find('input#season')
            .simulate('change', {
                persist: () => {},
                target: { name: 'season', value: 'season' },
            });
        wrapper
            .find(FirstStep)
            .find('input#season')
            .simulate('change', {
                persist: () => {},
                target: { name: 'season', value: '' },
            });

        setTimeout(() => {
            expect(
                wrapper
                    .find(FirstStep)
                    .find('[data-testid="season-error"]')
                    .first()
                    .text()
            ).toEqual('ערך לא תקין');
            done();
        });
    });

    test('shows error indication when photographer field is invalid', done => {
        const wrapper = mount(<App />);

        expect(
            wrapper
                .find(FirstStep)
                .find('[data-testid="photographer-error"]')
                .first()
                .text()
        ).toEqual('');

        wrapper
            .find(FirstStep)
            .find('input#photographer')
            .simulate('change', {
                persist: () => {},
                target: { name: 'photographer', value: 'photographer name' },
            });
        wrapper
            .find(FirstStep)
            .find('input#photographer')
            .simulate('change', {
                persist: () => {},
                target: { name: 'photographer', value: '' },
            });

        setTimeout(() => {
            expect(
                wrapper
                    .find(FirstStep)
                    .find('[data-testid="photographer-error"]')
                    .first()
                    .text()
            ).toEqual('שדה חובה');
            done();
        });
    });
});
