module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js', 'lib/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    simplemocha: {
      all: { src: 'test/**/*.js' }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      lib: {
        files: {
          'viewstate.min.js' : ['lib/viewstate.js']
        }
      }
    }
  })

  grunt.registerTask('default', ['simplemocha'])
  grunt.registerTask('min', ['default', 'uglify'])

  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-simple-mocha')
  grunt.loadNpmTasks('grunt-contrib-uglify')
};
