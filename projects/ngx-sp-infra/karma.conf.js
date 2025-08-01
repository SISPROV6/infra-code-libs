// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false // deixa os resultados visíveis no navegador
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    angularCli: {
      environment: 'dev'
    },
    coverageReporter: {
      dir: require('path').join(__dirname, '../../coverage/ngx-sp-infra'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'lcovonly', subdir: '.', file: 'lcov.info' },
        { type: 'text-summary' }
      ]
    },
    reporters: [ 'progress', 'kjhtml', 'coverage' ],
    browsers: [ 'Chrome', 'ChromeHeadless' ],
    singleRun: true,
    restartOnFileChange: true,
    colors: true
  });
};
