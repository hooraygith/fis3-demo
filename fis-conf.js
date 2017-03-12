'use strict';

const projectConf = require('./project-conf.js');

fis.set('project.md5Connector', '-');
fis.set('project.md5Length', 8);


// 相对路径会导致 __uri 错误
// fis.hook('relative');
// // 相对路径
// fis.match('**', {
//     relative: true
// })


// 设置了这个packTo才生效
fis.match('::package', {
    postpackager: fis.plugin('loader', {
        allInOne: true
    })
});
fis.match('*.{jpg, png, gif}', {
    useHash: true,
    domain: projectConf.cdn,
    release: '$0'
});
fis.match('*.png', {
    // png 自动压缩
    optimizer: fis.plugin('png-compressor')
});

// npm install -g fis-parser-less-2.x
fis.match('*.{less, css}', {
    parser: fis.plugin('less-2.x', {
        // fis-parser-less-2.x option
    }),
    postprocessor: fis.plugin('autoprefixer'),
    useHash: true,
    domain: projectConf.cdn,
    optimizer: fis.plugin('clean-css'),
    rExt: '.css',
    packTo: '/css/bundle.css'
});
fis.match('*.js', {
    useHash: true,
    domain: projectConf.cdn,
    optimizer: fis.plugin('uglify-js'),
    preprocessor: fis.plugin('browserify'),
    release: '$0'
    // packTo: '/res/js/bundle.js'
});
fis.match('*.woff2', {
    domain: projectConf.cdn,
    release: '$0'
});
fis.match('*.md', {
    release: false
});
fis.match('/*/**.html', {
    release: false
});

// // 上传到阿里云oss
// fis.media('upload')
//     .match('*.{js, css, png, jpg, gif, woff2}', {
//     deploy: fis.plugin('smart-alioss', {
//         accessKey: projectConf.oss.accessKey,
//         secretKey: projectConf.oss.secretKey,
//         bucket: projectConf.oss.bucket,
//         ossServer: projectConf.oss.ossServer
//     })
// });

// // ftp到线上环境
// fis.media('upload').match('/res/**', {
//     deploy: fis.plugin('ftp', {
//         //console: true,
//         cache : true,           // 是否开启上传列表缓存，开启后支持跳过未修改文件，默认：true
//         remoteDir : projectConf.sftp.path,   // 远程文件目录，注意！！！设置错误将导致文件被覆盖
//         connect : {
//             host : projectConf.sftp.host,
//             port : projectConf.sftp.port,
//             user : projectConf.sftp.user,
//         }
//     })
// });



// 这里设置了会导致阿里oss不执行
fis.match('*', {
    deploy: [
        fis.plugin('skip-packed'),
        fis.plugin('local-deliver', {
            to: './dist'
        })
    ]
});
