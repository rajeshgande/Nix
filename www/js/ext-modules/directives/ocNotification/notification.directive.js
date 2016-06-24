
(function () {
    "use strict";

    angular.module("ocDirective")
        .directive("notification", notificationDirective);

    notificationDirective.$inject = ["$timeout", "topicService", "NOTIFICATION_TYPES"];

    function notificationDirective($timeout, topicService, NOTIFICATION_TYPES) {
        var dir = {
            restrict: "E",
            scope: {
                dismissAfter: "=?", // in milliseconds
                defaultType: "=?",
            },
            template: template,
            controller: ["$attrs", controller],
            controllerAs: "ctrl",
            bindToController: true
        };

        var dismissPromise;
        var genericMessage = "An error occurred.  Please contact a system administrator";

        function template(element, attrs) {
            var tmpl = "<div name='notificationBox' ng-show='ctrl.visible' ng-class='ctrl.type' class='alert alert-dismissible' role='alert'>" +
                            "<button name='closeButton' type='button' class='close' aria-label='Close' ng-click='ctrl.closeClick()'><span aria-hidden='true'>&times;</span></button>" +
                            "<span name='notificationMessage' ng-bind='ctrl.message'></span>" +
                        "</div>";

            return tmpl;
        }

        function controller(attrs) {
            var scope = this;

            scope.message = "";
            scope.visible = false;

            if (!scope.dismissAfter || scope.dismissAfter <= 0) {
                // 0 to not set a timeout
                scope.dismissAfter = 0;
            }

            if (!scope.defaultType) {
                scope.type = NOTIFICATION_TYPES.INFO;
            }

            var notificationTopic = "oc-notification-" + (attrs.uniqueName || "generic");

            topicService.subscribe(notificationTopic, function (args) {
                // using timeout to trigger a digest cycle since a call to the topic service will be out of a cycle
                $timeout(function () { showMessage(scope, args.message, args.notificationType, args.dontDismiss); });
            });

            scope.closeClick = function () {
                // cancel any fade away pending promises
                cancelDismissPromise(dismissPromise);

                var notificationClosetopic = "oc-notification-close";
                topicService.notify(notificationClosetopic);
                
                scope.visible = false;
            };
        }

        function showMessage(scope, message, type, dontDismiss) {
            cancelDismissPromise(dismissPromise);

            scope.visible = true;
            scope.message = message;
            scope.type = type;

            if (!dontDismiss) {
                dismissPromise = $timeout(function () {
                    scope.message = "";
                    scope.type = scope.defaultType;
                    scope.visible = false;
                }, scope.dismissAfter).then(function () {
                    dismissPromise = null;
                });
            }
        }

        function cancelDismissPromise(promise) {
            if (promise) {
                $timeout.cancel(promise);
            }
        }

        return dir;
    }
})();