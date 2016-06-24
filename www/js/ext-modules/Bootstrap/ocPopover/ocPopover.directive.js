(function () {
    angular.module("ocBootstrap")
        .directive("ocPopover", ocPopoverDirective);
    ocPopoverDirective.$inject = ["$window", "$log"];

    function ocPopoverDirective($window, $log) {
        var dir = {
            restrict: "AE",
            link: link,
        };

        function getTitle(attrs) {
            if (attrs.popoverHide === "true") return '';
            else {
                return '<span class="text-info"><strong> ' + attrs.popoverTitle + '</strong></span> <button type="button" id="close" class="close" onclick="$(&quot;.popover&quot;).popover(&quot;hide&quot;);">&times;</button>';
            }
        }

        function link(scope, el, attrs) {
            var elem = $(el);
            $(el).popover({
                trigger: attrs.popoverTrigger,
                html: true,
                title: getTitle(attrs),
                content: attrs.popoverContent,
                placement: attrs.popoverPlacement,
                container:'body'
            })
            .on('shown.bs.popover', function () {
                var offSetValue = 20;
                var topValue = elem.data("bs.popover").tip().css('top').replace('px', '');
                var scrollTop = $(window).scrollTop(); // current window's top position

                if (topValue < scrollTop) {
                    window.scrollTo(0, topValue - offSetValue);
                }
            });
        }
        return dir;
    }
})();