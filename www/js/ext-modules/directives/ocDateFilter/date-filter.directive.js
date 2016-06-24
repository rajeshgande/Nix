
(function () {
    angular.module("ocDirective")
        .directive("dateFilter", dateFilterDirective);

    function dateFilterDirective() {
        var dir = {
            restrict: "E",
            scope: {
                range: "=?",
                selectedPeriod: "=?",
                selection: "&selection" // &selection is the name of the attr in the directive (selection='someCtrl.someHandler(period)')
            },
            bindToController: true,
            controller: controller,
            controllerAs: "ctrl",
            template: template
        };

        function template(element, attrs) {
            var valueField = (attrs.valueField || "weeks");
            var textField = (attrs.textField || "name");

            var tmpl = "<div><label class='radio-inline' ng-repeat='r in ctrl.range'>" +
                            "<input id='radio_{{$index}}' name='dateRange' type='radio' ng-value='r." + valueField + "' ng-model='ctrl.selectedPeriod' ng-click='ctrl.selection({ period: r." + valueField + " })' />" +
                            "<label class='radio-inline' for='radio_{{$index}}'><span></span>{{ r." + textField + " }}</label>" +
                        "</label></div>";


            return tmpl;
        }

        function controller() {
            var vm = this;

            //$translate(['JS_Dashboard_Controller_Weeks', 'JS_Dashboard_Controller_Months', 'JS_Dashboard_Controller_Year', 'JS_Dashboard_Controller_Years'])
            //    .then(function (translations) {
            //        if (!vm.range) {
            //            vm.range = [
            //                { name: "4 " + translations.JS_Dashboard_Controller_Weeks, weeks: 4 },
            //                { name: "12 " + translations.JS_Dashboard_Controller_Weeks, weeks: 12 },
            //                { name: "6 " + translations.JS_Dashboard_Controller_Months, weeks: 26 },
            //                { name: "1 " + translations.JS_Dashboard_Controller_Year, weeks: 52 },
            //                { name: "2 " + translations.JS_Dashboard_Controller_Years, weeks: 104 }
            //            ];
            //        }
            //    });
        }

        return dir;
    }
})();