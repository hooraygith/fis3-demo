const $ = require('jquery');
const Vue = require('vue/dist/vue.common.js');
const CONFIG = require('./config.js');
const articleDetailTpl = __inline('./tmpl/article-detail.html');

console.log(22, typeof $, typeof Vue, typeof CONFIG)

Vue.component('article-detail', {
    props: ['article'],
    template: articleDetailTpl,
    methods: {
        isPrevExit: function() {
            return true;
        },
        isNextExit: function() {
            return true;
        },
        prev: function(item) {},
        next: function(item) {}
    }
});

new Vue({
    el: '#app',
    data: {
        currentType: 'all',
        works: CONFIG.works,
        currentArticle: {},
        typeMap: CONFIG.typeMap,
        articleMap: CONFIG.articlesMap,
        isShowArticleDetail: false
    },
    methods: {
        changeType: function(item) {
            this.currentType = item.type;
        },
        _listenToShowArticle: function() {
            var self = this;
            $(document).on('click', '[data-articleid]', function() {
                var id = $(this).data('articleid');
                var article = self.articleMap[id];
                article.mdHTML = markdown.toHTML(article.md);
                self.currentArticle = article;

                self.isShowArticleDetail = true;
            });
        },
        _listenToHideArticle: function() {
            var self = this;
            $(document).on('click', '[data-close]', function() {
                self.isShowArticleDetail = false;
            });
        },
        _renderSlide: function() {

            if (this.typeMap[this.currentType].listPaged.length < 2) {
                return;
            }
        }
    },
    created: function() {
        this._listenToShowArticle();
        this._listenToHideArticle();
        this._renderSlide();
    }
});







