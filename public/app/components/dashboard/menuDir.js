angular.module('domoApp').directive('menuDirective', function(){
  return  {
      restrict: 'E',
      templateUrl: './app/components/dashboard/menuTmpl.html',
      link: function (scope, element, attrs) {
        $('.hamburger').click(function(){
           $('.dash-nav-mobile-menu').stop().slideToggle();
        });
      }
    };
})
