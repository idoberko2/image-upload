const config = api => {
    api.cache(true);

    return {
        env: {
            test: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/plugin-transform-react-jsx'],
            },
        },
    };
};

module.exports = config;
