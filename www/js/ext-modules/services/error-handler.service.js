
(function () {
    "use strict";

    angular.module("ocService")
        .factory("errorHandlerService", errorHandlerService);

    function errorHandlerService() {
        var svc = {
            createHttpErrorMessage: createHttpErrorMessage,
            httpError: httpError,
            throwErrors: false
        };

        // the error message object
        var HttpErrorMessage = function (msg, status, err) {
            this.message = msg;
            this.status = status;
            this.originalErrorObject = err;
        }

        // include only lowercase prop names
        var messageProperties = ["message"];

        /**
            @description Handles http errors from data service or other http related calls
            @param {Object} err The http error object from an http request
            @param {Number} status The http error status code
        */
        function httpError(err, status) {
            if (typeof status !== "number") {
                throw Error("Invalid http status code");
            }

            if (status >= 200 && 300 > status) {
                throw new Error("Statuses in the 200 range are not http errors");
            }

            var errMsg = processError(err, status);

            if (this.throwErrors) {
                throw new Error("HTTP " + status + ". " + errMsg.message);
            }

            return errMsg;
        }

        function processError(err, status) {
            var em = createHttpErrorMessage("An error occurred", status, err);

            if (typeof err === "string") {
                em.message = err;
            } else if (typeof err === "object") {
                // try and find a 'message' property of the object to set to the http error message object
                // todo: refactor to use angular.forEach
                for (var p in err) {
                    var lp = p.toLowerCase();

                    var found = messageProperties.some(function (mp) {
                        return mp === lp;
                    });

                    if (found) {
                        em.message = err[p];
                        break;
                    }
                }
            }

            return em;
        }

        function createHttpErrorMessage(message, status, origError) {
            ///<summary>Creates a new HttpErrorMessage</summary>
            ///<param name="message" type="String">The error message</param>
            ///<param name="status" type="Number">The error status code (http status, 0 for aborted status)</param>
            ///<param name="origError" type="Object?">Optional: the original error object</param>
            return new HttpErrorMessage(message, status, origError);
        }

        return svc;
    }
})();