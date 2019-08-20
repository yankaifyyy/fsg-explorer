const { fixBabelImports, addLessLoader } = require('customize-cra');
const removeWebpackPlugins = require('react-app-rewire-unplug');
const rewireReactHotLoader = require('react-app-rewire-hot-loader');

module.exports = function override(config, env) {
    config = fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    })(config);

    config = addLessLoader({
        javascriptEnabled: true,
        // modifyVars: { '@primary-color': '#e29c45' },
    })(config);

    config = removeWebpackPlugins(config, env, {
        pluginNames: ['ForkTsCheckerWebpackPlugin'],
        verbose: true,
    });

    config = rewireReactHotLoader(config, env);

    return config;
};
