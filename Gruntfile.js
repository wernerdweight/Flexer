module.exports = function (grunt) {

    require('time-grunt')(grunt);

    var config = {

        pkg: grunt.file.readJSON('package.json'),

        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

        // [DIRS]
        dirs: {
            app: 'app',
            src: {
                root: '',
                stylesheets: 'dev/sass',
            },
            dest: {
                root: 'dist',
                stylesheets: 'dist/css',
            },
            dest_generated: {
                root: 'dist',
                stylesheets: 'dist/css',
            },
        },

        compass: {
            options: {
                force: true
            },
            dist: {
                options: {
                    environment: 'production',
                    outputStyle: 'compressed',
                    sassDir: '<%= dirs.src.stylesheets %>',
                    cssDir: '<%= dirs.dest_generated.stylesheets %>',
                }
            },
            dev: {
                options: {
                    environment: 'development',
                    outputStyle: 'expanded',
                    sourcemap: false,
                    debugInfo: false,
                    sassDir: '<%= dirs.src.stylesheets %>',
                    cssDir: '<%= dirs.dest_generated.stylesheets %>',
                }
            }
        },

        autoprefixer: {
            dist: {
                expand: true,
                flatten: true,
                src: '<%= dirs.dest_generated.stylesheets %>/**/*.css',
                dest: '<%= dirs.dest_generated.stylesheets %>'
            }
        },

        clean: {
            base: [
                '<%= dirs.dest_generated.stylesheets %>/*',
            ],
        },

        // [WATCH]
        watch: {
            options: {
                livereload: true,
                spawn: false
            },

            css: {
                options: {
                    livereload: true
                },
                files: '<%= compass.dev.options.cssDir %>/**/*.css'
            },

            compass: {
                options: {
                    livereload: true
                },
                files: '<%= compass.dev.options.sassDir %>/**/*.{sass,scss}',
                tasks: ['compass:dev', 'autoprefixer', 'notify:compass']
            },

        },

        availabletasks: {
            all: {},
            user: {
                options: {
                    showTasks: ['user']
                }
            }
        },

        notify: {
            options: {
                enabled: false
            },
            build_finish: {
                options: {
                    message: 'Build finished'
                }
            },
            compass: {
                options: {
                    title: 'SASS done!',
                    message: 'Compass + Autoprefixer tasks successfully finished!'
                }
            },
        },

        notify_hooks: {
            options: {
                enabled: true,
                success: true, // whether successful grunt executions should be notified automatically
            }
        },

    };

    //---

    grunt.config.init(config);

    //---

    grunt.loadNpmTasks('grunt-available-tasks');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-notify');

    grunt.task.run('notify_hooks');

    //---

    grunt.registerTask('debug', 'Debug task.', function () {
        console.log(JSON.stringify(env, null, 2));
        console.log(JSON.stringify(config, null, 2));
        console.log(JSON.stringify(process.env, null, 2));
    });

    //---

    grunt.registerTask('tasks', ['availabletasks']);
    grunt.registerTask('default', ['tasks']);

    // [BUILD]
    grunt.registerTask('build', [
        'clean:base',
        'build_css',
        'notify:build_finish'
    ]);
    grunt.registerTask('build_css', ['compass:dist', 'autoprefixer']);

    // dev
    grunt.registerTask('build_dev', [
        'clean:base',
        'compass:dev',
        'autoprefixer',
        'notify:build_finish'
    ]);
    grunt.registerTask('build_dev_css', ['compass:dev', 'autoprefixer']);
    grunt.registerTask('build_dev_watch', ['build_dev', 'watch']);

}
