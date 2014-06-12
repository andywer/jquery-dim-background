'use strict';

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
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

  grunt.registerTask('default', 'uglify');
};
