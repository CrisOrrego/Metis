var elixir = require('laravel-elixir');
elixir.config.sourcemaps = false;

//gulp --gulpfile libs.js --production

elixir(function (mix) {
  mix
    .styles([
      '**/*.css',
    ], 'public/css/libs.min.css')
    .scripts([

      'libs/jquery.min.js',
      'libs/angular.min.js',
      'libs/angular-material.min.js',

      'libs/jquery_plugins/**/*.js',

      'libs/angular_modules/**/*.js',
      'libs/other/**/*.js',

    ], 'public/js/libs.min.js');
    
});