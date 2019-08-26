const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = function override(config, env) {
  // do stuff with the webpack config...
  return config;
};
//antd 按需加载
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  //自定义组件颜色
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#1DA57A' },
  }),
);