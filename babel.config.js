const config = api => {
    api.cache(() => process.env.NODE_ENV === 'production');

    return {
        presets: [
            '@babel/preset-env',
            [
                '@emotion/babel-preset-css-prop',
                {
                    sourceMap: true,
                    autoLabel: process.env.NODE_ENV !== 'production',
                    labelFormat: '[local]',
                    cssPropOptimization: true,
                },
            ],
        ],
        plugins: [],
    };
};

module.exports = config;
