// Reacts upon enter key press.
angular.module('printThis', []).directive('printThis',
  function () {
    return function (scope, element, attrs) {
      element.bind('click', function (event) {
          event.preventDefault();
          //console.log(_config);

          //return false;

          $(attrs.printThis).printThis({
          		debug: false,
              importStyle: true,
          });
      });
    };
  }
);