
(function () {
    "use strict";

    angular
		.module("ocService")
		.factory("dataService", dataService);

    dataService.$inject = ["$q", "$http", "notificationService", "topicService", "errorHandlerService", "HTTP_STATUS_CODES"];

    function dataService($q, $http, notificationService, topicService, errorHandlerService, HTTP_STATUS_CODES) {
        // the interface for this service
        var svc = {
            get: get,
            post: post,
            postXSRFInHeaders: postXSRFInHeaders
        };

        var deferredPromises = [];
        var abortStatusCode = HTTP_STATUS_CODES.ABORTED;

        /**
            @description Makes a get request for the data
            @param {String} url The url where the data resides
        */
        function get(url) {
            validateUrl(url);
            cancelAwaitingPromises(url);

            var deferred = createDeferredTokens(url);

            $http.get(url, { timeout: deferred.abortToken.promise }).then(function success(response) {
                deferred.resolve(response.data);
            }, function error(response) {
                var hem = handleErrorResponse(response);
                // if the error handler service is not set to throw errors, reject with the http error message from the 
                // error handler service
                deferred.reject(hem);
            });

            return deferred.promise;
        }

        /**    
            @description Post data to be saved
            @param {String} url The url where to post or submit data
            @param {Object} postData data to post to the url
         */
        function post(url, postData) {
            validateUrl(url);
            cancelAwaitingPromises(url);

            var deferred = createDeferredTokens(url);

            $http.post(url, postData, { timeout: deferred.abortToken.promise }).then(function success(response) {
                deferred.resolve(response.data);
            }, function error(response) {
                var hem = handleErrorResponse(response);

                // if the error handler service is not set to throw errors, reject with the http error message from the 
                // error handler service
                deferred.reject(hem);
            });

            return deferred.promise;
        }

        /**    
        @description Post data to be saved
        @param {String} url The url where to post or submit data
        @param {Object} postData data to post to the url
        */
        function postXSRFInHeaders(url, postData) {
            validateUrl(url);
            cancelAwaitingPromises(url);

            var deferred = createDeferredTokens(url);
            $http({
                method: 'POST',
                url: url,
                data: postData,
                headers: {
                    'X-XSRF-Token': angular.element('input[name="__RequestVerificationToken"]').attr('value')
                },
                config: { timeout: deferred.abortToken.promise, withCredentials: true }
            }).then(function success(response) {
                deferred.resolve(response.data);
            }, function error(response) {
                var hem = handleErrorResponse(response);

                // if the error handler service is not set to throw errors, reject with the http error message from the 
                // error handler service
                deferred.reject(hem);
            });
            return deferred.promise;
        }

        /**
            @description Creates the deferred promise for cancelation
            @param {String} url The url to create the cancelation token
        */
        function createDeferredTokens(url) {
            var deferred = $q.defer();
            var abortDeferred = $q.defer();
            var key = getKey(url);

            deferred.abortToken = abortDeferred;

            // add an abort function to the promise and have it call the timeout deferred object's resolve method
            // to abort the call. this will cause the .error block to execute with a status of 0
            deferred.promise.abort = function () {
                //Aborts this promise's call to the server
                abortDeferred.resolve();
            };

            setPromise(url, deferred);

            return deferred;
        }

        function validateUrl(url) {
            if (!url) {
                throw new Error("missing url");
            }
        }

        function setPromise(url, deferred) {
            var key = getKey(url);

            deferredPromises.push({ key: key, promise: deferred.promise, aborted: false });
        }

        /**
            @description Cancels any pending http requests
            @param {String} url The url to search for pending requests with
        */
        function cancelAwaitingPromises(url) {
            var key = getKey(url);
            var aborted = false;
            var awaiting = deferredPromises.filter(function (p) { return p.key === key; });

            angular.forEach(awaiting, function (p) {
                p.promise.abort();
                p.aborted = aborted = true;
            });

            if (aborted) {
                deferredPromises = deferredPromises.filter(function (p) { return !p.aborted; });
            }
        }

        function getKey(url) {
            var pos = url.indexOf("?");
            if (pos >= 0)
            {
                return url.substr(0, pos).replace(/=+|\/+|&|\?+/g, "");
            }
            
            var key = url.replace(/=+|\/+|&|\?+/g, "");
            return key;
        }

        /**
            @description Handles the http errors from the $http service
            @param {Object} response The response from the http request
        */
        function handleErrorResponse(response) {
            var hem;
            var status = response.status;
            var statusText = response.statusText;
            var description = response.statusText;
            if (response.data.Message)
            {
                description = response.data.Message;
            }
            

            if (status !== abortStatusCode) {
                hem = errorHandlerService.httpError(description, status);

                switch (hem.status) {
                    case HTTP_STATUS_CODES.SERVICE_UNAVAILABLE:
                        notificationService.showError(hem.message);
                        topicService.notify("oc-forced-logout");
                        break;
                    case HTTP_STATUS_CODES.BAD_REQUEST:
                        notificationService.showError(hem.message);
                        break;
                    case HTTP_STATUS_CODES.UNAUTHORIZED:
                        notificationService.showError(hem.message);
                        break;
                    case HTTP_STATUS_CODES.EXPECTATIONFAILED:
                        notificationService.showError(hem.message);
                        break;
                    default:
                        // all other error status codes
                        // re-throw it so that the globel exception handler will catch it.
                           throw new Error(hem.message);
                }
            } else {
                hem = errorHandlerService.createHttpErrorMessage("Aborted", status, statusText);
            }

            return hem;
        }

        // return the service definitions/interface
        return svc;
    }
})();