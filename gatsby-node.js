const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

exports.onCreateWebpackConfig = ({
  stage,
  rules,
  loaders,
  plugins,
  actions,
}) => {
  console.log('onCreateWebpackConfig');
  actions.setWebpackConfig({
    plugins: [
     new HtmlWebpackExternalsPlugin({
  externals: [
    {
      module: 'jquery',
      entry: 'https://unpkg.com/jquery@3.2.1/dist/jquery.min.js',
      global: 'jQuery2',
    },
  ],
})
    ],
  })
}