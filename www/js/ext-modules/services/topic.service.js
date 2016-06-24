
// style of a function is called an iife (immedialty invoked function expression)
(function () {
    "use strict";

    // 'angular' is what Angular registers itself as on the window object
    angular
        .module("ocService") // our main module is called 'app'
        // factory in this case defines an singleton instance of our topic service
        // we want a factory because this code will be called by various controllers that
        // need to share data or events in this case
        .factory("topicService", topicService);

    // use this service in controllers that want to notify or be notified of other controller's events
    // listen and emit topics using 'spinal-case' to follow the angular naming pattern
    function topicService() {
        // our service methods
        var svcInterface = {
            notify: notify,
            subscribe: subscribe,
            unsubscribe: unsubscribe,
            contains: contains
        };

        var topics = {};

        function notify(topic, args) {
            ///<summary>Notifies subscribers on an event</summary>
            ///<param name="topic" type="String">The topic (event name) to raise</param>
            ///<param name="args" type="Object">The arguments for the topic</param>

            // raise a topic to anyone subscribing to it
            var camelCaseTopic = toCamelCase(topic);

            if (topics[camelCaseTopic]) {
                topics[camelCaseTopic].forEach(function (e) {
                    e.call(null, args);
                });
            }
        }

        function subscribe(topic, fn) {
            ///<summary>Subscribes to an event</summary>
            ///<param name="topic" type="String">The topic (event name) to get notified of</param>
            ///<param name="fn" type="function">The handler to call when notifications are raised</param>

            // subscribe to topics here
            // input is is hyphenated topic  e.g. upper-percentile-checked
            // convert topic to camelcase
            var camelCaseTopic = toCamelCase(topic);

            var t = topics[camelCaseTopic] || (topics[camelCaseTopic] = []);
            t.push(fn);

            return fn;
        }

        function unsubscribe(topic, fn) {
            ///<summary>unsubscribes from an event</summary>
            ///<param name="topic" type="String">The topic (event name) to unsubscribe from</param>
            ///<param name="fn" type="function">The handler to remove</param>

            // unsubscribe from the given topic
            var camelCaseTopic = toCamelCase(topic);
            var fnToRemove = [];

            if (topics[camelCaseTopic]) {
                // could have multiple functions to remove for this topic
                topics[camelCaseTopic].forEach(function (e, i) {
                    if (fn == e) {
                        fnToRemove.push(i);
                    }
                });

                // iterate in reverse order to remove functions
                var a = null;
                while ((a = fnToRemove.pop()) != null) {
                    topics[camelCaseTopic].splice(a, 1);
                }
            }
        }

        function contains(topic) {
            ///<summary>Checks to see if a topic is already registered</summary>
            ///<param name="topic" type="String">The topic to check for</param>
            ///<returns>true, if topic is already registered with at least 1 function, false otherwise</returns>
            var fnArray = topics[toCamelCase(topic)];

            return angular.isArray(fnArray) && fnArray.length > 0;
        }

        function toCamelCase(inTopic) {
            //capitalize after hyphen
            return inTopic.toLowerCase().replace(/-(.)/g,
                function (match, group1) {
                    return group1.toUpperCase();
                });
        }

        // return the service interface method
        return svcInterface;
    }
})();