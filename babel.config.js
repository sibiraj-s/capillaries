module.exports = (api) => {
  const isEnvTest = api.env('test');

  return {
    presets: [
      !isEnvTest && '@babel/preset-env',
      isEnvTest && [
        '@babel/preset-env',
        {
          targets: {
            node: 'current',
          },
        },
      ],
    ].filter(Boolean),
  };
};
