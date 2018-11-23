define('jira/project/browse/layout',
    ['jquery', 'underscore', 'backbone'],
    function($, _, Backbone) {
        return Backbone.Marionette.Layout.extend({
            regions: {
                nav: '.aui-page-panel-nav',
                filter: '#filter-projects',
                content: '#projects',
                pagination: '#pagination'
            }
        });
});