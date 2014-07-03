'use strict';

module.exports = function (grunt) {

  var fs = require('fs');

  require('load-grunt-tasks')(grunt, {
    pattern: ['grunt-*', '!grunt-template-jasmine-istanbul']
  });

  grunt.initConfig({
    shell: {
      'bower-install': {
        command: './node_modules/bower/bin/bower install'
      }
    },
    jasmine: {
      test: {
        src: 'jquery.dim-background.js',
        options: {
          vendor: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/jasmine-jquery/lib/jasmine-jquery.js'
          ],
          specs: 'specs/*.spec.js',
          template : require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            coverage: 'reports/coverage.json',
            report: {
              type: 'lcov',
              options: {
                dir: 'reports/coverage'
              }
            }
          }
        }
      }
    },
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
    },

    // github pages deployment:
    copy: {
      public: {
        files: [
          { expand: true, src: ['jquery.dim-background.js', 'jquery.dim-background.min.js', 'demo/**'], dest: 'public/' }
        ]
      }
    },
    'gh-pages': {
      options: {
        base: 'public'
      },
      src: ['**']
    },

    clean: ['.grunt/', 'public/']
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

  grunt.registerTask('test', ['shell:bower-install', 'jasmine']);
  grunt.registerTask('deploy', ['uglify', 'copy:public', 'gh-pages']);
  grunt.registerTask('default', ['jshint', 'uglify', 'test', 'check-version']);

};
