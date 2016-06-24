
(function () {
    angular.module("ocDirective")
        .directive("checkbox", checkboxDirective);
    checkboxDirective.$inject = ["$timeout"];

    function checkboxDirective($timeout) {
        var dir = {
            restrict: "E",
           // replace: true,
            scope: {
                range: "=?",
                selectAllDefault: "=?",
                selectedPeriod: "=?",
                selection: "&selection",// &selection is the name of the attr in the directive (selection='someCtrl.someHandler(period)')
                selectall: "&selectall",
                filterdata: "=?",
                filterValue: "=?"
            },
            bindToController: true,
            controller: controller,
            controllerAs: "ctrl",
            template: template,
            link: link
        };

        function template(element, attrs) {
            var valueField = (attrs.valueField || "weeks");
            var textField = (attrs.textField || "name");
            var stateField = (attrs.stateField || "state");


            //var tmpl = "<div class='input-group'> " +
            //" <input type='text' class='form-control' aria-label='...' placeholder='Click here, then press Tab'  > " +
            //"  <div class='input-group-btn' id='myDropDown'> " +
            //"   <button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Action <span class='caret'></span></button> " +

            //"    <ul class='dropdown-menu dropdown-menu-right oc-checkbox-section'> " +
            //            "<div class='chosen-search'>" +
            //                "<input type='text' class='' aria-label='...' placeholder='Search...' ng-model='ctrl.filterValue'  ng-keyup='ctrl.filterdata(ctrl.filterValue)'  />" +
            //            "</div>" +
            //            "<li>" +
            //                        "<label class='checkbox' >" +
            //                            "<input id='checkboxAll'  type='checkbox' ng-model='ctrl.selectAllDefault' ng-true-value='true' ng-false-value='false' ng-change='ctrl.selectall()'  />" +
            //                            "<label class='checkbox' for='checkboxAll'><span></span>Select All</label>" +
            //                        "</label> " +
            //                    "</li>" +
            //                    "<li>" +
            //                        "<label class='checkbox' ng-repeat='r in ctrl.range | filter:ctrl.filterValue'>" +
            //                            "<input id='checkbox_{{$index}}'  type='checkbox' ng-model='r." + stateField + "' ng-true-value='true' ng-false-value='false' ng-change='ctrl.selection({ period: r." + valueField + " })' />" +
            //                            "<label class='checkbox' for='checkbox_{{$index}}'><span></span>{{ r." + textField + " }}{{ r." + stateField + " }}</label>" +
            //                        "</label>" +
            //            "</li>" +

            //"    </ul> " +
            //"  </div><!-- /btn-group --> " +
            //"</div><!-- /input-group -->"

//            var tmpl = " <div class='btn-group' id='myDropDown'>" +
// " <a class='btn dropdown-toggle' data-toggle='dropdown' href='#'>" +
// "   Menu" +
// "   <span class='caret'></span>" +
// " </a>" +
// " <ul class='dropdown-menu'>" +
// "   <li><a href='#'><label class='checkbox'><input type='checkbox' value=''>Option 1</label></a></li>" +
// "   <li><a href='#'><label class='checkbox'><input type='checkbox' value=''>Option 1</label></a></li>" +
// "   <li><a href='#'><label class='checkbox'><input type='checkbox' value=''>Option 1</label></a></li>" +
// "   <li class='divider'></li>" +
// "   <li><a href='#'><label class='checkbox'><input type='checkbox' value=''>......</label></a></li>" +
// " </ul>" +
//"</div>";
            //element.bind('.input-group input').keydown(function (e) {
            //    if (e.which == 9) { // tab
            //        e.preventDefault();
            //        $(this).parent().find('.dropdown-toggle').click();
            //        $(this).parent().find('.dropdown-menu li label:first').focus();
            //        console.log("first element");
            //        console.log($(this).parent().find('.dropdown-menu li label:first'));
            //    }
            //});

            //element.bind('.dropdown-menu li label').keydown(function (e) {
            //    console.log("keydown fired");
            //    switch (e.which) {
            //        case 36: // home
            //            e.preventDefault();
            //            $(this).closest('.dropdown-menu').find('label:first').focus();
            //            break;
            //        case 35: // end
            //            e.preventDefault();
            //            $(this).closest('.dropdown-menu').find('label:last').focus();
            //            break;
            //    }
            //    e.preventDefault();
            //});

            //element.bind('body').on('click', function (e) {
            //    if (!$('input-group-btn').is(e.target) && $('input-group-btn').has(e.target).length === 0 && $('.open').has(e.target).length === 0) {
            //        console.log("body click");
            //        console.log(e.target);
            //        //$('input-group-btn').removeClass('open');
            //    } else {
            //        console.log("Outside body click");
            //    }
            //});
            //element.bind('input-group-btn btn').on('click', function (event) {
            //    console.log("button click");
            //    $(this).parent().toggleClass("open");
            //});
            //element.bind('input-group-btn checkbox').on('click', function (event) {
            //    console.log("checkbox click");
            //    $(this).parent().toggleClass("open");
            //});
            //element.bind('#myDropDown .dropdown-menu').on({
            //    "click": function (e) {
            //        console.log("button click called");
            //        //e.stopPropagation();
            //    }
            //});



            var tmpl = "<div class='input-group dropdown-checkbox' id='myDropDown'> " +
            //"  <div class='input-group-btn' > " +
            "   <button type='button' class='btn btn-primary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Dropdown Checkbox Example. Click here... <span class='caret'></span></button> " +
            "    <ul class='dropdown-menu'> " +
                        "<li class='dropdown-header'>" +
                            "<input type='text' class='' aria-label='...' placeholder='Search...' ng-model='ctrl.filterValue'  ng-keyup='ctrl.filterdata(ctrl.filterValue)'  />" +
                        "</li>" +
                         "<div class='oc-checkbox-section'>" +
                            "<li>" +
                                        "<label class='checkbox' >" +
                                            "<input id='checkboxAll'  type='checkbox' ng-model='ctrl.selectAllDefault' ng-true-value='true' ng-false-value='false' ng-change='ctrl.selectall()'  />" +
                                            "<label class='checkbox' for='checkboxAll'><span></span>Select All</label>" +
                                        "</label> " +
                                    "</li>" +
                                    "<li>" +
                                        "<label class='checkbox' ng-repeat='r in ctrl.range | filter:ctrl.filterValue'>" +
                                            "<input id='checkbox_{{$index}}'  type='checkbox' ng-model='r." + stateField + "' ng-true-value='true' ng-false-value='false' ng-change='ctrl.selection({ period: r." + valueField + " })' />" +
                                            "<label class='checkbox' for='checkbox_{{$index}}'><span></span>{{ r." + textField + " }}</label>" +
                                        "</label>" +
                            "</li>" +
                        "</div>" +

            "    </ul> " +
            //"  </div><!-- /btn-group --> " +
            "</div><!-- /input-group -->"


            return tmpl;
        }
        function link(scope, element, attrs) {
            $timeout(function () {
                console.log("check link");
                checkContainerReady();
            }, 1000, false);

            scope.filterdata = function () {
                console.log("filter text");

            }
        }
        function checkContainerReady() {
            console.log("check");
            var el = $('#myDropDown .dropdown-menu');
            console.log(el);
            if (el != undefined) { //if the container is visible on the page
                console.log("dropdown is READY ");
                el.on({
                    "click": function (e) {
                        console.log("hello");
                        e.stopPropagation();
                    }
                });

                $('.input-group input').keydown(function (e) {
                    console.log("key press");
                    if (e.which == 9) { // tab
                        e.preventDefault();
                        $(this).parent().find('.dropdown-toggle').click();
                        $(this).parent().find('.dropdown-menu li:first').focus();
                        console.log("first element");
                        //console.log($(this).parent().find('.dropdown-menu li label:first'));
                    }
                });


                //$('.dropdown-menu a').keydown(function (e) {
                //    console.log("keydown fired");
                //    switch (e.which) {
                //        case 36: // home
                //            e.preventDefault();
                //            $(this).closest('.dropdown-menu').find('a:first').focus();
                //            break;
                //        case 35: // end
                //            e.preventDefault();
                //            $(this).closest('.dropdown-menu').find('a:last').focus();
                //            break;
                //    }
                //    e.preventDefault();
                //});



            } else {
                //console.log("dropdown is NOT NOT NOT READY " + elem[0].id);
                $timeout(function () {
                    checkContainerReady();
                }, 1000, false);
            }
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
            vm.filterdata = function (filterText) {
                console.log("filter text");
                console.log(filterText  );
                //var charCode = (e.which) ? e.which : e.keyCode;
                //console.log(charCode);
            }
        }

        return dir;
    }
})();