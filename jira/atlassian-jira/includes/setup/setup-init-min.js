require(["jquery","jira/setup/setup-product-bundle-view","jira/setup/setup-mode-view","jira/setup/setup-account-layout","jira/setup/setup-finishing-layout","jira/setup/setup-database-view","jira/setup/setup-license"],function($,SetupProductBundleView,SetupModeView,SetupAccountLayout,SetupFinishingLayout,SetupDatabaseView,SetupLicense){$(function(){var views={"jira-setup-product-bundle-page":SetupProductBundleView,"jira-setup-mode-page":SetupModeView,"jira-setup-account-page":SetupAccountLayout,"jira-setup-finishing-page":SetupFinishingLayout,"jira-setup-database-page":SetupDatabaseView};$.each(views,function(classname,ViewClass){if($("body").hasClass(classname)){new ViewClass({el:"."+classname})}});if($("body").hasClass("jira-setup-license-page")){SetupLicense.startPage()}})});