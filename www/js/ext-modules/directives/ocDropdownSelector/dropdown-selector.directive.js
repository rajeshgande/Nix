
// todo: consider refactoring to follow angular 2 directive controller pattern
(function () {
    "use strict";

    angular.module("ocDirective")
	   .directive("dropdownSelector", dropdownSelectorDirective);

    dropdownSelectorDirective.$inject = ["$log", "$timeout", "topicService", "$compile"];

    function dropdownSelectorDirective($log, $timeout, topicService, $compile) {
        var dir = {
            restrict: "E",
            scope: {
                list: "=",
                selectedItem: "=?",
                itemChanged: "&itemChanged",
                rangeMin: "=",
                rangeMax: "=",
                disableChosen: "="
            },
            template: template,
            link: link
        };

        function link(scope, element, attrs) {
            if (attrs.type !== undefined && attrs.type == "range") {
                var rangeMin = scope.rangeMin;
                scope.values = [];
                for (var i = +attrs.offset; i < +attrs.rangeMax; i++) {
                    scope.values.push(rangeMin + i);
                }
                scope.selectedItem = parseInt(scope.selectedItem, 10);
            }

            attrs.$observe("tooltiptitle", function () {

                bindToolTip(element, scope, attrs);

            });
            var elemToSubscribe = element[0].id + '_chosen';
            topicService.subscribe(elemToSubscribe, function (width) {

                $log.debug(elemToSubscribe + " " + width);
                checkContainerReady(element, width, scope, attrs);
            });
        }

        function bindToolTip(elem, scope, attrs) {
            //console.log("Binding tooltip event called " + elem[0].id + " " + attrs.tooltiptitle + " " + attrs.tooltipplacement);
            var toolTipElem = $('#' + elem[0].id + '_chosen .chosen-single');
            //console.log("tooltip Element " + toolTipElem[0]);

            // Check if the Dropdown DOM has been created by chosen
            if (toolTipElem[0] != undefined) {
                toolTipElem.addClass("oc-tooltip");
                toolTipElem.attr("tooltipplacement", attrs.tooltipplacement);
                toolTipElem.attr("tooltiptitle", attrs.tooltiptitle);
                $compile(toolTipElem)(scope);
            } else {
                $timeout(function () {
                    bindToolTip(elem, scope, attrs);
                }, 1000, false);
            }

        }
        function checkContainerReady(elem, width, scope, attrs) {
            var multiplyFactor = 10;
            $log.debug(elem[0].id);
            var el = $('#' + elem[0].id + '_chosen');
            var elDrop = $('#' + elem[0].id + '_chosen .chosen-drop');
            $log.debug(elDrop[0]);

            if (el.is(':visible')) { //if the container is visible on the page
                //console.log("dropdown is READY " + elem[0].id);
                $log.debug("Hey, I am ready! " + width);
                el.css({ "width": width * multiplyFactor });
                elDrop.css({ "width": width * multiplyFactor });

                bindToolTip(elem, scope, attrs);
                //var toolTipElem = $('#' + elem[0].id + '_chosen .chosen-single');


            } else {
                //console.log("dropdown is NOT NOT NOT READY " + elem[0].id);
                $timeout(function () {
                    checkContainerReady(elem, width, scope, attrs);
                }, 1000, false);
            }
        }

        function template(element, attrs) {
            var optionsExpression = "";
            // the valueField and textField are literal values (cannot be bound or dynamic)
            // they are also not part of the scope
            if (attrs.type == "select") {
                optionsExpression = "item." + (attrs.valueField || "id") + " as item." + (attrs.textField || "name") + " for item in list";
            } else if (attrs.type == "range") {
                optionsExpression = "v for v in values";
            }

            var cssClass = "";
            var cssChosen = "";
            var disableChosenSearch = "false"; // By default search is enabled

            if (attrs.myclass !== undefined) {
                cssClass = "class = '" + attrs.myclass + "'";
            }

            // Check if Chosen features need to be applied
            if (attrs.applyChosen !== undefined) {
                if (attrs.applyChosen == "true") {
                    if (attrs.type == "select") {
                        cssChosen = "chosen ";
                    } else if (attrs.type == "range") {
                        cssChosen = "chosen style='min-width:60px;'";
                    }

                    //Check for disable search attribute
                    if (attrs.disableSearch !== undefined) {
                        if (attrs.disableSearch == "true") {
                            disableChosenSearch = "true";
                        }
                    }
                }
            }

            $log.debug("chosen search disabled: " + disableChosenSearch);
            var str = "";
            if (attrs.type == "select") {
                str = "<select id='" + attrs.id + "' required name='" + attrs.id + "'  required-message='" + attrs.reqValidationMessage + "' data-no_results_text= '" + attrs.noresultsfoundtext + "' ng-disabled = 'disableChosen == " + true + "' data-placeholder= '" + attrs.dataplaceholder + "' " + cssChosen + " disable-search='" + disableChosenSearch + "'  ng-model='selectedItem'" + cssClass + " ng-options='" + optionsExpression + "' ng-change='itemChanged({item: selectedItem})'></select>";
                return str;
            } else if (attrs.type == "range") {
                str = "<select ng-model='selectedItem' data-no_results_text= '" + attrs.noresultsfoundtext + "' data-placeholder= '" + attrs.dataplaceholder + "'" + cssChosen + " disable-search='" + disableChosenSearch + "' " + cssClass + " ng-options='" + optionsExpression + "' ng-change='itemChanged({item: selectedItem})'></select>";
                return str;
            } else {
                return str;
            }
        }
        
        return dir;
    }
})();