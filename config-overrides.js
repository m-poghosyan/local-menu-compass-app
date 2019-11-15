// const {
//   override,
//   disableChunk,
//   addBabelPlugins,
//   fixBabelImports,
//   addLessLoader,
//   addBundleVisualizer,
// } = require('customize-cra')

// const rewireStyledComponents = require('react-app-rewire-styled-components')

// const styledComponents = obj => config =>
//   rewireStyledComponents(config, process.env.NODE_ENV, obj)

// /* Override CRA (Webpack, Babel, etc.) Configuration */

// module.exports = override(
//   disableChunk(), // ! Remove this once we get a proper server!

//   ...addBabelPlugins([
//     'babel-plugin-root-import',
//     {
//       paths: [
//         {
//           rootPathPrefix: '~',
//           rootPathSuffix: 'src',
//         },
//       ],
//     },
//   ]),

//   fixBabelImports('import', {
//     libraryName: 'antd',
//     libraryDirectory: 'es',
//     style: true,
//   }),

//   addLessLoader({
//     javascriptEnabled: true,
//     modifyVars: { '@primary-color': '#1DA57A' },
//   }),

//   styledComponents({
//     displayName: process.env.NODE_ENV !== 'production',
//   }),

//   process.env.BUNDLE_VISUALIZE === 1 &&
//     addBundleVisualizer(
//       { analyzerMode: 'static', reportFilename: 'report.html' },
//       true
//     )
// )
