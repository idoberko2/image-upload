const processImage = require('../../../utils/processImage');

let mockImageDimensions = {
    width: 3000,
    height: 2000,
};

jest.mock('image-size', () => () => mockImageDimensions);

const mockSharpHandlers = {};

mockSharpHandlers.composite = jest.fn(() => mockSharpHandlers);
mockSharpHandlers.resize = jest.fn(() => mockSharpHandlers);
mockSharpHandlers.toBuffer = jest.fn(() => mockSharpHandlers);

function mockSharp() {
    return mockSharpHandlers;
}

mockSharp.gravity = { northwest: 'northwest' };

jest.mock('sharp', () => mockSharp);

describe('processImage', () => {
    test('should not add logo watermark by default', () => {
        processImage('test');
        expect(mockSharpHandlers.composite).not.toHaveBeenCalled();
    });

    test('should add logo watermark if configured', () => {
        // configure env
        const originalEnv = process.env;
        process.env.SHOULD_ADD_WATERMARK = 'true'

        // SUT
        processImage('test');

        // assert
        expect(mockSharpHandlers.composite).toHaveBeenCalled();

        // restore original env
        process.env = originalEnv;
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
