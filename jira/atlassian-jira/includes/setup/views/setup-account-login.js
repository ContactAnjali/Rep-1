define("jira/setup/setup-account-login-view", [
    "jquery",
    "backbone",
    "underscore",
    "jira/setup/setup-account-abstract-view",
    "jira/setup/setup-tracker"
], function ($, Backbone, _, AccountAbstractView, setupTracker) {

    return AccountAbstractView.extend({
        template: JIRA.Templates.Setup.Account.loginForm,

        ui: {
            "spinnerLogging": ".jira-setup-account-spinner-logging"
        },

        formType: "login",
        _isLoginForm: true,
        _loginFailedAttempts: 0,
        _userLoggedIn: false,

        ViewStateHandler: AccountAbstractView.prototype.ViewStateHandler.extend({

            awaitUserData: function () {
                AccountAbstractView.prototype.ViewStateHandler.prototype.awaitUserData.apply(this, [true]);

                if ( !this.view._licenseGenerationInProgress ) {
                    this.view.ui.forgotPasswordLink.removeClass("hidden");

                    if (this.view._switchFormRecommended){
                        this.view.ui.descWrapper.removeClass("hidden");
                        this.view.ui.descEmailNotExisting.removeClass("hidden");
                    } else if (this.view._switchFormRecommendedAfterSubmit){
                        this.view.ui.descWrapper.removeClass("hidden");
                        this.view.ui.descEmailNotExistingAfterSubmit.removeClass("hidden");
                    }
                } else {
                    this.view.ui.forgotPasswordLink.addClass("hidden");
                }

                this.view.ui.spinnerLogging.addClass("hidden");

                this.restoreFocusedElement();
            },
            awaitSubmitResult: function () {
                AccountAbstractView.prototype.ViewStateHandler.prototype.awaitSubmitResult.apply(this);

                this.view.ui.spinnerLogging.removeClass("hidden");
                this.view.ui.forgotPasswordLink.addClass("hidden");
            },
            awaitLicenseGeneration: function() {
                AccountAbstractView.prototype.ViewStateHandler.prototype.awaitLicenseGeneration.apply(this);

                this.view.ui.spinnerLogging.addClass("hidden");
            }
        }),

        initialize: function (options) {
            this.macUtil = options.macUtil;
            this.setupTracker = _.isEmpty(options.setupTracker) ? setupTracker : options.setupTracker;
            this.templateHelpers.values.email = options.email;
            this.templateHelpers.values.password = options.password;
        },

        onShow: function () {
            this.ui.password.focus();
            this.ui.password.val(this.ui.password.val());
        },

        userExistenceConfirmed: function (exists) {
            this._switchFormRecommended = !exists;
        },

        doSubmit: function () {
            var values = this.getValues();

            if (this._userLoggedIn) {
                this.handleLicenseGeneration();
            } else {
                this.macUtil.loginUser(values)
                    .fail(_.bind(this.handleLoginFailure, this))
                    .fail(_.bind(function() {
                            this.validationStateMachine.submitFailure();
                        }, this))
                    .done(_.bind(function () {
                        this._userLoggedIn = true;
                        this.validationStateMachine.submitSuccess();

                        this.setupTracker.sendUserLoggedInEvent();
                        this.handleLicenseGeneration();
                    }, this));
            }
        },

        handleLoginFailure: function (response) {
            if (response.error) {
                this.templateHelpers.loginWarning = false;
                this.templateHelpers.errors.password = this.macUtil.transformAIDErrorMessage(response.error);

                if (this.macUtil.isEmailNotVerifiedErrorMessage(response.error)){
                    this._switchFormRecommendedAfterSubmit = true;
                }
            } else {
                this._loginFailedAttempts++;

                this.templateHelpers.loginWarning = true;
                this.templateHelpers.loginWarningError = this._loginFailedAttempts >= 3;
            }

            this.render();
        }
    });
});