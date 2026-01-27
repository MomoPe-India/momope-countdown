module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            // Required for Reanimated (if used)
            'react-native-reanimated/plugin',
        ],
    };
};
