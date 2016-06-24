
(function () {
    "use strict";

    angular.module("ocService")
        .factory("urlService", urlService);

    urlService.$inject = ["$location", "$window"];

    function urlService($location, $window) {
        var svc = {
            api: api,
            action: action
        };

        var qmark = "?";
        var amp = "&";
        var slash = "/";
        var eq = "=";
        var baseUrl = $window.Application.appSettings.baseUrl ? ($window.Application.appSettings.baseUrl) || "" : "";

        function action(ctrl, action, query) {
            /// <summary>Generates a url to an Action in a Controller</summary>
            /// <param name='ctrl' type='String'>The name of the controller</param>
            /// <param name='action' type='String'>The name of the action in the controller</param>
            /// <param name='query' type='Object'>The keyvalue pair object of query parameters ({ "someQueryParam" : "someValue", ..., "lastParam" : "lastValue" })</param>

            return generateUrl(ctrl, action, query);
        }

        function api(ctrl, action, query) {
            /// <summary>Generates a url to a WebApi Action in a Controller</summary>
            /// <param name='ctrl' type='String'>The name of the controller</param>
            /// <param name='action' type='String'>The name of the action in the controller</param>
            /// <param name='query' type='Object'>The keyvalue pair object of query parameters ({ "someQueryParam" : "someValue", ..., "lastParam" : "lastValue" })</param>

            return generateUrl(ctrl, action, query, true);
        }

        // private
        function generateUrl(ctrl, action, query, isApi) {
            var url = baseUrl + (isApi ? "api/" : "") + ctrl + slash + action;

            if (query) {
                // append query starting point
                url += qmark;

                // query should be a collection of javascript literal keyvalue pairs (i.e. { key: value}  ex: { "someQueryParam" : "someValue" })
                angular.forEach(query, function (value, key) {
                    url += key + eq + encodeURIComponent(value) + amp;
                });

                // remove the trailing '&'
                url = url.replace(/&$/, "");
            }

            return url;
        }

        return svc;
    }
})();