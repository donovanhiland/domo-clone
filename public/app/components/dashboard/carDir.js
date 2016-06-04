angular.module('domoApp').directive('cardDirective', function(){

  return  {
      restrict: 'A',
      link: function (scope, element, attrs) {

        $('.card-lg').on('click', function(){
          $(this).parent().parent().css('height', '100%');
          $(this).parent().parent().css('width', '40%');
          // $(this).parent().css('transition', 'all 0.9s ease-in-out');
        });

        $('.card-sm').on('click', function(){
          $(this).parent().parent().css('height', '100%');
          $(this).parent().parent().css('width', '20vw');
        })

      }
    };

});