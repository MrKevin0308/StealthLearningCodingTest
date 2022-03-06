// module.exports = {
//   presets: [
//     'module:metro-react-native-babel-preset',
//   ],
//   plugins: [
//     'react-native-reanimated/plugin',
//   ],
// };
const path = require('path');
const pak = require('./package.json');

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.js', '.json'],
      }
    ],
    'react-native-reanimated/plugin', // PUT IT HERE
    ["module:react-native-dotenv"],
    ["transform-inline-environment-variables"]
  ]
};