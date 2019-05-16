const getSeason = require('../../../src-client/js/utils/getSeason');

describe('getSeason', () => {
    test('should return correct season for beginning of the season', () => {
        // first training
        const date = new Date('2015-06-20');
        const season = getSeason(date);

        expect(season).toEqual('2015-2016');
    });

    test('should return correct season for middle of season', () => {
        const date = new Date('2016-01-20');
        const season = getSeason(date);

        expect(season).toEqual('2015-2016');
    });
});
