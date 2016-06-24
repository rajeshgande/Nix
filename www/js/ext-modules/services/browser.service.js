
(function () {
    "use strict";

    angular.module("ocService")
        .factory("browserService", browserService);

    browserService.$inject = ["$window", "BROWSERS"];

    function browserService($window, BROWSERS) {
        var svc = {
            determineBrowser: determineBrowser
        };

        // supprted browsers
        var agents = [
            { value: /Trident\//i, browser: BROWSERS.IE },
            { value: /Chrome\//i, browser: BROWSERS.CHROME },
            { value: /Firefox\//i, browser: BROWSERS.FIREFOX },
            { value: /Safari\//i, browser: BROWSERS.SAFARI }
        ];

        function determineBrowser() {
            ///<summary>
            /// Determines what the user's current browser is based off of the user agent.
            ///<para>NOTE: only supports IE, Chrome, Firefox and Safari.  Other browsers will return Unknown.</para>
            ///</summary>
            var detectedBrowser = BROWSERS.UNKNOWN;
            var userAgent = $window.navigator.userAgent;

            for (var i = 0; i < agents.length; i++) {
                var agent = agents[i];

                if (agent.value.test(userAgent)) {
                    detectedBrowser = agent.browser;
                    break;
                }
            }

            return detectedBrowser;
        }

        return svc;
    }
})();