angular.module('domoApp').controller('globeCtrl', ($scope, $http) => {

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

    return $http({
        method: 'POST',
        url: '/location/data',
        data: {
          screenName: $scope.user.screenName
        }
    }).then((response) => {
            var data = response.data;
            window.data = data;
            globe.addData(data, {
                format: 'legend'
            });
            globe.createPoints();
            globe.animate();
            // $('.globe-container').css('backgroundImage', 'none'); // remove loading
        });
    }
});
