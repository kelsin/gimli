module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      server: {
        src: ['src/**/*.js', '!src/public/**'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      server: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.server.dest %>']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        expr: true,
        latedef: true,
        onevar: true,
        noarg: true,
        node: true,
        trailing: true,
        //undef: true,
        //unused: true,
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    copy: {
      options: {
        expand: true
      },
      views: {
        files: [
          { expand: true, cwd: 'src/', src: ['views/**'], dest: 'dist' }
        ]
      },
      images: {
        files: [
          { expand: true, cwd: 'src/public', src: ['images/**'], dest: 'dist/public' }
        ]
      },
      vendor: {
        files: [
          { expand: true, src: ['vendor/**'], dest: 'dist/public' }
        ]
      }
    },
    watch: {
      files: ['src/**'],
      tasks: ['jshint', 'build']
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: 'coverage/blanket'
        },
        src: ['test/**/*.js']
      },
      coverage: {
        options: {
          reporter: 'mocha-lcov-reporter',
          quiet: true,
          captureFile: 'coverage/coverage.lcov'
        },
        src: ['test/**/*.js']
      },
      coverageHtml: {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'coverage/coverage.html'
        },
        src: ['test/**/*.js']
      }
    },
    coveralls: {
      options: {
        // LCOV coverage file relevant to every target
        src: 'coverage/coverage.lcov',

        // When true, grunt-coveralls will only print a warning rather than
        // an error, to prevent CI builds from failing unnecessarily (e.g. if
        // coveralls.io is down). Optional, defaults to false.
        force: false
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-coveralls');

  grunt.registerTask('test',   ['jshint', 'mochaTest', 'coveralls']);

  grunt.registerTask('build',  ['jshint', 'concat', 'uglify', 'copy']);
  grunt.registerTask('dev',    ['build', 'watch']);
  grunt.registerTask('heroku', ['build']);

  grunt.registerTask('default', ['dev']);
};
