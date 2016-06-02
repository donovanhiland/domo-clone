angular.module('domoApp').directive('cardDirective', function(){

  return  {
      restrict: 'A',
      link: function (scope, element, attrs) {

        $('.card-btn').on('click', function(){
          $(this).parent().css('height', '80vh');
          $(this).parent().css('width', '80vh');
        })

      }
    };

});
