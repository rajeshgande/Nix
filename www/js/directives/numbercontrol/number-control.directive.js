(function () {
    'use strict';

    angular.module("nix")
        .directive("numberControl", numberControlDirective);

    numberControlDirective.$inject = ["topicService", "$timeout", "$log", "$window"];
    function numberControlDirective(topicService, $timeout, $log, $window) {
        return {
            restrict: 'E',
            scope: {
                quantity: "=",
                unit: "=",
                max: "=",
                controlid: "@",
                indexid: "@indexid",
                controlSelected: "=", // This field is used to Trigger the input textbox focus event on number control from outside
                callbackId:"="
            },
            replace: false,
           // bindToController: true,
            //controller: controller,
            // controllerAs: "ctrl",
            link: function (scope, element, attrs) {
                var controlElement = element;
                var btnUp = $('#btnUp', element);
                var btnDown = $('#btnDown', element);
                var input = $('input', element);
                //$log.debug(btnUp);
                
                input.keydown(function (e) {
                    //console.log("key down event fired");
                    // Allow: backspace, delete, tab, escape, enter and .
                    if ($.inArray(e.keyCode, [46, 8, 9, 27, 39, 40, 13]) !== -1 ||
                        // Allow: Ctrl+A, Command+A
                        (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                        // Allow: home, end, left, right, down, up
                        (e.keyCode >= 35 && e.keyCode <= 37)) {
                        // let it happen, don't do anything
                        return;
                    }
                    // Ensure that it is a number and stop the keypress
                    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                        e.preventDefault();
                    }
                });
                input.bind("keyup", function (e) {
                    // console.log("key up event fired" + e.keyCode);
                    // Allow: home, end, left and right arrow and TAB and SHIFT
                    if (e.keyCode >= 35 && e.keyCode <= 37 || e.keyCode == 39 || e.keyCode == 9 || e.keyCode == 16) {
                        return;
                    }
                    //$log.debug(input.val() + '   ' + e.keyCode);
                    if (e.keyCode == 38) { // up key
                        if (input.val() == undefined || input.val() == "") input.val(0);
                        if (parseInt(input.val()) < scope.max) {
                            scope.quantity = parseInt(input.val()) + 1;
                        }
                        //scope.quantity = parseInt(input.val()) + 1;
                    }

                    if (e.keyCode == 40) { // down key
                        if (input.val() > 0) {
                            scope.quantity = parseInt(input.val()) - 1;
                        } else {
                            input.val(0);
                            scope.quantity = 0;
                        }
                    }

                    if (input.val() != '' && input.val().startsWith("0")) {
                        var newInput = parseInt(input.val());
                        
                        input.val(newInput);
                    }
                    scope.$apply();
                    topicService.notify("Change-Order-Quantity");
                   
                });

                //Keep a watch on this field to trigger the focus event
                //The value of this watch is controlled from outside
                scope.$watch("controlSelected", function (controlSelectionValue) {
                   // console.log("Number Input contol Fired");
                    $log.debug(controlSelectionValue);
                    $log.debug(controlElement);
                    if (controlSelectionValue) {
                        var input = $('input', controlElement);
                        $(input).focus();                        
                    }
                });


                // *******************Button Click events******************************
                btnUp.on("click", function () {

                    //$log.debug(input.val());
                    if (input.val() == undefined || input.val() == "") input.val(0);
                    var newValue = parseInt(input.val());
                    if (newValue < scope.max) {
                        newValue = newValue + 1;
                    }
                    scope.quantity = newValue;
                    scope.$apply();
                    //Give external notification that value has changed
                    topicService.notify("Change-Order-Quantity");
                });
                btnDown.on("click", function () {

                    //$log.debug(input.val());
                    if (input.val() > 0) {
                        scope.quantity = parseInt(input.val()) - 1;
                    } else {
                        input.val(0);
                        scope.quantity = 0;
                    }

                    scope.$apply();
                    //Give external notification that value has changed
                    topicService.notify("Change-Order-Quantity");
                });

                // *********Send notification when focus is set on button or input control********
                if (attrs.notifyOnFocus !== undefined && attrs.notifyOnFocus == "true") {
                    btnUp.on("focus", function () {

                        topicService.notify(attrs.notifyOnFocusTopic, scope.callbackId);
                    });
                    btnDown.on("focus", function () {

                        topicService.notify(attrs.notifyOnFocusTopic, scope.callbackId);
                    });
                    input.on("focus", function () {
                        
                        topicService.notify(attrs.notifyOnFocusTopic, scope.callbackId);
                    });
                }
                // ********************************************************************
            },
            //templateUrl: Application.appSettings.baseUrl + 'Scripts/app/directives/numbercontrol/number-control.html'
            templateUrl: 'js/directives/numbercontrol/number-control.html'
        }
    }


})();