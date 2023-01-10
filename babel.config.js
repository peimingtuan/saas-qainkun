module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'meri-design',
        camel2Dash: false,
        libDir: 'dist',
        styleLibrary: { name: 'theme', base: true }
      }
    ]
  ]
}
