angular.module('horizontalScroll', []).
directive('horizontalScroll', function () {

    return {
        link:function (scope, element, attrs) {
            var base = 0

            element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {

                // cross-browser wheel delta
                var event = window.event || event; // old IE support
                var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));


                scope.$apply(function(){
                    base += (30*delta);
                    //console.log(element, base);
                    element.children().css({'transform':'translateX('+base+'px)'});
                    //element.scrollLeft(base);
                });

                // for IE
                event.returnValue = false;
                // for Chrome and Firefox
                if(event.preventDefault) { event.preventDefault(); }


            });
        }
    };
});