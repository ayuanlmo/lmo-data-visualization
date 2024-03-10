const path = require('path');

module.exports = function override(config, env) {
    config.module.rules.push({
        test: /\.less$/,
        use: [
            require.resolve('style-loader'),
            {
                loader: require.resolve('css-loader'),
                options: {
                    importLoaders: 1,
                },
            },
            {
                loader: require.resolve('less-loader'),
                options: {
                    lessOptions: {
                        javascriptEnabled: true,
                    },
                },
            },
        ],
        include: path.resolve(__dirname, 'src'), // 只在 src 目录下寻找 LESS 文件
    });

    return config;
};