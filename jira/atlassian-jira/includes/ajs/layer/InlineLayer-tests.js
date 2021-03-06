AJS.test.require("jira.webresources:inline-layer", function() {

    var JS_TICK = 4;

    function fakeStandardPositioning() {
        return Class.extend({
            offset: function() {
                return { top: 0, left: 0 };
            }
        });
    }

    module('AJS.InlineLayer XSS', {
        setup: function(){
            this.context = AJS.test.mockableModuleContext();
            this.context.mock('jira/ajs/layer/inline-layer/standard-positioning', fakeStandardPositioning());
            this.xssElement = document.createElement('iframe');
            document.querySelector('#qunit-fixture').appendChild(this.xssElement);
        },
        teardown: function(){
            window.xssSpy = null;
        }
    });

    asyncTest("offset still works without window.name xss", function(assert) {
        window.xssSpy = this.spy();
        var xssName = "1,<img src='/' onerror=xssSpy()>";
        this.xssElement.name = xssName;
        var IFramePositioning = this.context.require('jira/ajs/layer/inline-layer/iframe-positioning');
        this.stub(IFramePositioning, 'window').returns({ name: xssName });
        this.stub(IFramePositioning, 'topWindow').returns(window); // i.e., the context of this test, not the test runner
        var ours = new IFramePositioning();

        ours.offset(); // throws exception if fails

        setTimeout(function() {
            ok(window.xssSpy.notCalled, "xssSpy() was called, when it shouldn't have");
            start();
        }, JS_TICK);
    });

});