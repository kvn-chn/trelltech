module.exports = {
    preset: 'jest-expo',
    moduleDirectories: ['node_modules', 'src'],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    verbose: true,
};
