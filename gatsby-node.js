exports.onCreateWebpackConfig = ({
  stage,
  rules,
  loaders,
  plugins,
  actions
}) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /image\.js$/,
          use: ["script-loader"]
        }
      ]
    }
  });
};
