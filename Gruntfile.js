/*global module:false*/
module.exports = function(grunt) {
  var pkgInfo = {
    src: 'app',
    destDir: 'dist'
  };
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkgInfo: pkgInfo,
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.

    clean: {
      dist: [
        '<%= pkgInfo.destDir %>/css',
        '<%= pkgInfo.destDir %>/fonts',
        '<%= pkgInfo.destDir %>/images',
        '<%= pkgInfo.destDir %>/scripts',
        '<%= pkgInfo.destDir %>/templates',
        '<%= pkgInfo.destDir %>/index.html'
      ]
    },

    copy: {
      fonts: {
        expand: true,
        flatten: true,
        dest: '<%= pkgInfo.destDir %>/fonts/',
        src: ['<%= pkgInfo.src %>/bower_components/font-awesome/fonts/*']
      },
      css: {
        expand: true,
        flatten: true,
        dest: '<%= pkgInfo.destDir %>/css/',
        src: ['<%= pkgInfo.src %>/bower_components/font-awesome/css/font-awesome.min.css']
      },
      images: {
        expand: true,
        flatten: true,
        dest: '<%= pkgInfo.destDir %>/images/',
        src: ['<%= pkgInfo.src %>/images/*']
      },
      template: {
        expand: true,
        flatten: true,
        dest: '<%= pkgInfo.destDir %>/templates/',
        src: ['<%= pkgInfo.src %>/templates/*']
      },
      index: {
        expand: true,
        flatten: true,
        dest: '<%= pkgInfo.destDir %>/',
        src: ['<%= pkgInfo.src %>/*.html']
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        expand: true,
        cwd: 'build',
        dest: '<%= pkgInfo.destDir %>/templates/',
        src: ['<%= pkgInfo.src %>/templates/*.html']
      }
    },

    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      styles: {
        dest: '<%= pkgInfo.destDir %>/css/app.css',
        src: [
          '<%= pkgInfo.src %>/css/*.css'
        ]
      },
      scripts: {
        options: {
          separator: ';'
        },
        src: ['<%= pkgInfo.src %>/scripts/*.js'],
        dest: '<%= pkgInfo.destDir %>/scripts/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.scripts.dest %>',
        dest: '<%= pkgInfo.destDir %>/scripts/<%= pkg.name %>.min.js'
      }
    },

    connect: {
      options: {
        base: 'app/'
      },
      webserver: {
        options: {
          port: 8888,
          keepalive: true
        }
      },
      devserver: {
        options: {
          port: 8888
        }
      },
      publishServer: {
        options: {
          port: 8889,
          base: 'dist'
        }
      },
      testserver: {
        options: {
          port: 9999
        }
      },
      coverage: {
        options: {
          base: 'coverage/',
          port: 5555,
          keepalive: true
        }
      }
    },

    shell: {
      options : {
        stdout: true
      },
      npm_install: {
        command: 'npm install'
      },
      bower_install: {
        command: 'bower install'
      },
      font_awesome_fonts: {
        command: 'cp -R bower_components/components-font-awesome/font app/font'
      }
    },
    open: {
      devserver: {
        path: 'http://localhost:8888'
      },
      publishServer: {
        path: 'http://localhost:8889'
      },
      coverage: {
        path: 'http://localhost:5555'
      }
    },
    watch: {
      assets: {
        files: ['app/css/**/*.css','app/scripts/**/*.js']
      }
    },

    karma: {
      unit: {
        configFile: './test/karma-unit.conf.js',
        autoWatch: false,
        singleRun: true
      },
      unit_auto: {
        configFile: './test/karma-unit.conf.js'
      },
      e2e: {
        configFile: './test/karma-e2e.conf.js',
        autoWatch: false,
        singleRun: true
      },
      e2e_auto: {
        configFile: './test/karma-e2e.conf.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    }
  });


  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  //installation-related
  grunt.registerTask('install', ['shell:npm_install','shell:bower_install','shell:font_awesome_fonts']);

  // Default task.
  grunt.registerTask('default', ['dev']);

  //development
  grunt.registerTask('dev', ['install', 'connect:devserver', 'open:devserver', 'watch:assets']);

  //publish
  grunt.registerTask('publish', ['install', 'clean', 'copy', 'concat', 'uglify', 'htmlmin', 'connect:publishServer', 'open:publishServer', 'watch:assets']);
  
  //Test
  grunt.registerTask('test', ['connect:testserver','karma:unit', 'karma:e2e']);
  grunt.registerTask('test:unit', ['karma:unit']);
  grunt.registerTask('test:e2e', ['connect:testserver', 'karma:e2e']);

  //keeping these around for legacy use
  grunt.registerTask('autotest', ['autotest:unit']);
  grunt.registerTask('autotest:unit', ['connect:testserver','karma:unit_auto']);
  grunt.registerTask('autotest:e2e', ['connect:testserver','karma:e2e_auto']);

};
