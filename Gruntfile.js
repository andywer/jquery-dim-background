'use strict';

module.exports = function (grunt) {

  var fs = require('fs');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    jshint: {
      plugin: ['jquery.dim-background.js'],
      grunt: {
        options: {
          node: true
        },
        files: {
          src: ['Gruntfile.js']
        }
      }
    },
    uglify: {
      js: {
        files: {
          'jquery.dim-background.min.js': ['jquery.dim-background.js']
        }
      }
    },
    watch: {
      js: {
        files: ['jquery.dim-background.js'],
        tasks: ['uglify']
      }
    }
  });

  grunt.registerTask('check-version', 'Checks that the version is the same in all manifest files.', function () {
    var jsonFromFile = function (file) {
      return JSON.parse( fs.readFileSync(file, 'utf-8') );
    };

    var assertVersion = function (file, version) {
      var fileVersion = jsonFromFile(file).version;

      if (fileVersion !== version) {
        errors++;
        grunt.log.error('Version of '+file+' should be "'+version+'", but is "'+fileVersion+'"');
      }
    };

    var errors = 0;
    var version = jsonFromFile('dim-background.jquery.json').version;

    assertVersion('bower.json', version);
    assertVersion('package.json', version);

    return errors === 0;
  });

  grunt.registerTask('default', ['jshint', 'uglify', 'check-version']);

};
