// $(document).ready(function(){
//   console.log('jquery');
//     $('.hamburger').click(function(e){
//         e.preventDefault();
//         console.log("this is the click");
//     });
// });

$(document).on("click", ".hamburger", function() {
  console.log("click");
  $( ".menu" ).slideToggle( "slow", function() {

  });
});
