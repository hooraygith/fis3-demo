"use strict";

const config = {};
module.exports = config;

config.works = [
    {
        type: 'all',
        text: 'ALL',
        pageSize: 8,
        list: [
            {
                id: 0,
                title: '第一篇文章',
                time: '2017-01-07',
                img: __uri('../img/demo2.png'),
                md: __inline('../md/test.md'),
                tags: ''
            },
            {
                id: 1,
                title: '第二篇文章',
                time: '2017-01-07',
                img: __uri('../img/demo3.png'),
                md: __inline('../md/test.md'),
                tags: ''
            },
            {
                id: 2,
                title: '第三篇文章',
                time: '2017-01-07',
                img: __uri('../img/demo4.png'),
                md: __inline('../md/test.md'),
                tags: ''
            },
            {
                id: 3,
                title: '第四篇文章',
                time: '2017-01-07',
                img: __uri('../img/demo6.png'),
                md: __inline('../md/test.md'),
                tags: ''
            },
            {
                id: 4,
                title: '第五篇文章',
                time: '2017-01-07',
                img: __uri('../img/demo1.png'),
                md: __inline('../md/test.md'),
                tags: ''
            }
        ],
        listPaged: []
    },
    {
        type: 'ui',
        text: 'UI/UX',
        pageSize: 8,
        list: [
            {
                id: 200,
                title: '第六篇文章',
                time: '2017-01-07',
                img: __uri('../img/logo.gif'),
                md: __inline('../md/test.md'),
                tags: ''
            }
        ],
        listPaged: []
    },
    {
        type: 'animate',
        text: 'Animated GIFs',
        pageSize: 8,
        list: [
            {
                id: 44,
                title: '第一篇文章',
                time: '2017-01-07',
                img: __uri('../img/logo.gif'),
                md: __inline('../md/test.md'),
                tags: ''
            }
        ],
        listPaged: []
    },
    {
        type: 'article',
        text: 'Writting',
        pageSize: 2,
        list: [
            {
                id: 10,
                title: '交互设计初体验',
                time: '2017-01-07',
                img: __uri('../img/logo.gif'),
                md: __inline('../md/test.md'),
                tags: ''
            }
        ],
        listPaged: []
    }
];
config.typeMap = {};
config.articlesMap = {};

// add type, get map
config.works.forEach(item => {
    config.typeMap[item.type] = item;
    item.list.forEach(subItem => {
        subItem.type = item.type;
        config.articlesMap[subItem.id] = subItem;
    });

    const list = item.list;
    const len = list.length;
    const size = item.pageSize;
    const n = Math.ceil(len / size);
    for (let i = 0; i < n; i++) {
        const _list = list.slice(i * size, (i + 1) * size)
        item.listPaged.push(_list);
    }
});
