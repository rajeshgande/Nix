(function () {
    "use strict";

    angular.module("ocDirective")
       .directive("chosen", chosenDirective);

    function chosenDirective($timeout) {
        var dir = {
            restrict: 'A',
            controller: ["$scope", "$element", "$attrs", "$timeout", controller],
            controllerAs: "ctrl",
            bindToController: true
        };

        function controller(scope, element, attrs, $timeout) {
            // This attribute is always defined in the dropdown selector directive for select and range
            var searchOption = attrs.disableSearch || true; // default enable the search

            scope.$watch('list', function () {
                $timeout(function () {
                    element.trigger('chosen:updated');
                }, 0, false);
            }, true);

            scope.$watch('disableChosen', function () {
                $timeout(function () {
                    element.trigger('chosen:updated');
                }, 0, false);
            }, true);

            scope.$watch('selectedItem', function () {
                $timeout(function () {
                    element.trigger('chosen:updated');
                    //$log.debug("update selected item" + scope.selectedItem);
                }, 0, false);
            }, true);

            $timeout(function () {
                var val = (searchOption === "true"); // this is to convert to a boolean type
                element.chosen({ search_contains: true, disable_search: val });
                element.chosen();
            }, 0, false);
        }

        return dir;
    }
})();