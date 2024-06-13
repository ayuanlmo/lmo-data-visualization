const path = require('path');

module.exports = {
    style: {
        postcss: {
            plugins: [
                require('tailwindcss'),
                require('autoprefixer'),
            ],
        },
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                pathRewrite: {'^/api': ''},
            },
            '/connect': {
                target: 'http://localhost:3000/connect',
                changeOrigin: true,
                ws: true,
                pathRewrite: {'^/connect': ''},
            },
        },
    },
    webpack: {
        alias: {
            '@': path.resolve(__dirname, 'src/'),
        },
        configure: (webpackConfig, {paths}) => {

            webpackConfig.optimization = {
                splitChunks: {
                    chunks: 'all',
                }
            }
            const oneOfRule = webpackConfig.module.rules.find((rule) => rule.oneOf);
            if (oneOfRule) {
                oneOfRule.oneOf.unshift({
                    test: /\.(scss|sass)$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                implementation: require('sass'),
                            },
                        },
                    ],
                });
            }
            webpackConfig.output.path = path.join(path.resolve(), 'build'); // build to
            webpackConfig.plugins.forEach((plugin) => {
                if (plugin.constructor.name === 'MiniCssExtractPlugin')
                    plugin.options.filename = 'css/_t_script_[contenthash].ting.css';
            });
            webpackConfig.output.filename = 'script/_t_script_[contenthash].ting.js';
            webpackConfig.output.chunkFilename = 'script/_t_script_[contenthash].chunk.ting.js';
            webpackConfig.module.rules.push({
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'static/_t_static_[contenthash].ting.[ext]'
                        },
                    },
                ],
            });

            return webpackConfig;
        },
    },
    jest: {
        configure: {
            moduleNameMapper: {
                '^@/(.*)$': '<rootDir>/src/$1'
            },
        },
    }
};
