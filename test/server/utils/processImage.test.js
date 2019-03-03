const processImage = require('../../../utils/processImage');

let mockImageDimensions = {
    width: 3000,
    height: 2000,
};

jest.mock('image-size', () => () => mockImageDimensions);

const mockSharpHandlers = {};

mockSharpHandlers.overlayWith = jest.fn(() => mockSharpHandlers);
mockSharpHandlers.resize = jest.fn(() => mockSharpHandlers);

function mockSharp() {
    return mockSharpHandlers;
}

mockSharp.gravity = { northwest: 'northwest' };

jest.mock('sharp', () => mockSharp);

describe('processImage', () => {
    test('should add logo watermark', () => {
        processImage('test');
        expect(mockSharpHandlers.overlayWith).toHaveBeenCalled();
    });

    test('should resize landscape correctly', () => {
        mockImageDimensions = {
            width: 3000,
            height: 2000,
        };
        processImage('test');
        expect(mockSharpHandlers.resize).toHaveBeenCalledWith(900, null);
    });

    test('should resize portrait correctly', () => {
        mockImageDimensions = {
            width: 2000,
            height: 3000,
        };
        processImage('test');
        expect(mockSharpHandlers.resize).toHaveBeenCalledWith(null, 900);
    });
});
