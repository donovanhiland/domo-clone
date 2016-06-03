angular.module('domoApp').directive('cardDirective', function(){

  return  {
      restrict: 'A',
      link: function (scope, element, attrs) {

        $('.card-lg').on('click', function(){
          $(this).parent().css('height', '80vh');
          $(this).parent().css('width', '80vw');
          // $(this).parent().css('transition', 'all 0.9s ease-in-out');
        });

        $('.card-sm').on('click', function(){
          $(this).parent().css('height', '40vh');
          $(this).parent().css('width', '20vw');
        })

      }
    };

});
