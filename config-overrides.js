/* config-overrides.js */
const { injectBabelPlugin } = require("react-app-rewired");
const rewireMobX = require("react-app-rewire-mobx");
const rewireLess = require("react-app-rewire-less");
const rewireReactHotLoader = require("react-app-rewire-hot-loader");

module.exports = function override(config, env) {
  // antd design
  config = injectBabelPlugin(
    ["import", { libraryName: "antd", style: true }],
    config
  );
  // change importing css to less
  config = rewireLess.withLoaderOptions({
    javascriptEnabled: true,
    modifyVars: {
      "@primary-color": "#1DA57A",
      "@font-family": "'Roboto', sans-serif",
    },
  })(config, env);

  // use the MobX rewire
  config = rewireMobX(config, env);

  // hot-reload
  config = rewireReactHotLoader(config, env);

  return config;
};
