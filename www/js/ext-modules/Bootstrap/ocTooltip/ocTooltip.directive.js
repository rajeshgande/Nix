(function () {
    angular.module("ocBootstrap")
        .directive("ocTooltip", ocTooltipDirective);

    ocTooltipDirective.$inject = ["$log"];

    function ocTooltipDirective($log) {
        var dir = {
            restrict: "AEC",
            link: link
        };

        function link(scope, el, attrs) {
            var elem = $(el);

            attrs.$observe("tooltiptitle", function () {

                $(el).tooltip('hide')
                          .attr('data-original-title', attrs.tooltiptitle)
                          .tooltip('fixTitle');
                //.tooltip('show');
                $(el).data('bs.tooltip').options.placement = attrs.tooltipplacement || "";
                $(el).data('bs.tooltip').options.delay = { show: 1500 };
                $(el).data('bs.tooltip').options.trigger = 'hover';
                $(el).data('bs.tooltip').options.container = 'body';

            });
        }
        return dir;
    }
})();