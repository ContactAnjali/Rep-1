define("jira/togglelist/toggle-list",["jira/lib/class","jquery"],function(Class,jQuery){return Class.extend({init:function(options){var more=options.more,showMoreContainer=options.showMoreContainer||options.showMoreLink,showLessContainer=options.showLessContainer||options.showLessLink,showMoreLink=options.showMoreLink,showLessLink=options.showLessLink;if(!more||!more.length){showMoreContainer.hide();showLessContainer.hide();return }more.hide();showMoreContainer.show();showLessContainer.hide();var toggle=function(e){e.preventDefault();more.toggle();showMoreContainer.toggle();showLessContainer.toggle()};showMoreLink.click(toggle);showLessLink.click(toggle)}})});AJS.namespace("JIRA.ToggleList",null,require("jira/togglelist/toggle-list"));