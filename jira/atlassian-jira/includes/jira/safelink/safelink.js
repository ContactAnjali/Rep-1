(function () {

    function initSafeLink(el) {
        AJS.$(el || document.body).find('.clickonce').each(function (e) {
            var $link = jQuery(this);

            $link.on("click", function () {
                if (this.clicked) {
                    e.preventDefault();
                }
                else {
                    this.clicked = true;
                }
            });
        })
    };

    JIRA.bind(JIRA.Events.NEW_CONTENT_ADDED, function (e, context, reason) {
        if (reason == JIRA.CONTENT_ADDED_REASON.pageLoad || reason == JIRA.CONTENT_ADDED_REASON.contentRefreshed) {
            initSafeLink(context);
        }
    });

})();