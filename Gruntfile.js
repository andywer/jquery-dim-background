'use strict';

module.exports = function (grunt) {
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

  grunt.registerTask('default', ['jshint', 'uglify']);
};
