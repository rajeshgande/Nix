
/**
 * Use this service on pages where you want to show notification messages
 */
(function () {
    "use strict";

    angular.module("ocService")
        .factory("notificationService", notificationService);

    notificationService.$inject = ["topicService", "NOTIFICATION_TYPES"];

    function notificationService(topicService, NOTIFICATION_TYPES) {
        var svc = {
            show: show,
            showError: showError,
        };

        function show(message, type, dontDismiss, uniqueName) {
            ///<summary>Shows a notification message on the oc-notification directive (if exists)</summary>
            ///<param name="message" type="String">The message to show</param>
            ///<param name="type" type="NOTIFICATION_TYPES?">Optional: the type of message to show. Default is INFO (blue)</param>
            ///<param name="dontDismiss" type="Boolean?">Optional: true to keep the notification visible, false to have it dismiss after a period of time defined on the oc-notification directive.</param>
            ///<param name="uniqueName" type="String?">Optional: The unique name of the oc-notification directive to target. Defaults to 'generic'</param>
            if (!message) {
                throw new Error("empty message");
            }

            if (!type) {
                type = NOTIFICATION_TYPES.INFO;
            }

            if (!uniqueName) {
                uniqueName = "generic";
            }

            var topic = formatTopic(uniqueName);

            topicService.notify(topic, { notificationType: type, message: message, dontDismiss: (dontDismiss || false) });
        }

        function showError(message, uniqueName) {
            ///<summary>Shows an error notification message on the oc-notification directive (if exists [unique-name='generic'])</summary>
            ///<param name="uniqueName" type="String?">Optional: The unique name of the oc-notification directive to target. Defaults to 'generic'</param>
            show(message, NOTIFICATION_TYPES.ERROR, true, uniqueName);
        }

        function formatTopic(name) {
            var cleanedName = name.replace(/\s/g, "").trim();

            var topic = "oc-notification-" + cleanedName;

            return topic;
        }

        return svc;
    }
})();