;(function() {
    var DropdownFactory = require('jira/dropdown/dropdown-factory');
    var Events = require('jira/util/events');
    var Types = require('jira/util/events/types');
    var $ = require('jquery');

    function getIssueActionFormatHandlers() {
        var options = {};

        if (JIRA.Issues && JIRA.Issues.Api) {
            options.ajaxOptions = {};
            options.ajaxOptions.formatError = JIRA.Issues.Api.showInlineIssueLoadError; // KickAss' override to the default error handling for AJAX content retriever error cases
        }

        return options;
    }

    $(function () {
        DropdownFactory.bindNavigatorOptionsDds();
        DropdownFactory.bindConfigDashboardDds();
    });

    Events.bind("Issue.subtasksRefreshed", function (e, ctx) {
        DropdownFactory.bindIssueActionsDds(ctx, getIssueActionFormatHandlers());
    });

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, ctx) {
        DropdownFactory.bindIssueActionsDds(ctx, getIssueActionFormatHandlers());
        DropdownFactory.bindGenericDropdowns(ctx);
    });

})();
