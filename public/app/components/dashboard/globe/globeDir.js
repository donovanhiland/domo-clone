angular.module('domoApp').directive('globeDir', () => {

    return {
        restrict: 'AE',
        templateUrl: './app/components/globe/globeDir.html',
        controller: ($scope, $http) => {
          if (!Detector.webgl) {
            Detector.addGetWebGLMessage();
          } else {

            var globe = DAT.Globe(document.getElementById('container'), {
              colorFn: function(label) {
                return new THREE.Color([
                  0x006BFF, 0x00B1FF, 0x00F7FF, 0x00FFC0,
                  0x00FF7A, 0x00FF34, 0x10FF00, 0x57FF00,
                  0x9DFF00, 0xE2FF00, 0xFFD500
                ][label]);
              }
            });

            return $http ({
              method: 'POST',

            })
            var xhr = new XMLHttpRequest();
            xhr.open('GET', './twittertest.json', true);
            xhr.onreadystatechange = function(e) {
              if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                  var data = JSON.parse(xhr.responseText);
                  window.data = data;
                  globe.addData(data, {
                    format: 'legend'
                  });
                  globe.createPoints();
                  globe.animate();
                  document.body.style.backgroundImage = 'none'; // remove loading
                }
              }
            };
            xhr.send(null);
          }
        },
        // link: (scope, element, attrs) => {

        // }
    };
});
