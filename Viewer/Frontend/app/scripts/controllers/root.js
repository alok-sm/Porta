'use strict';

angular.module('viewerApp')
.controller('RootCtrl', function ($scope) {
    $scope.names = "";
    $scope.redirect = function() {
        if($scope.names.indexOf(',') === -1){
            window.location.href = `#!/single?logName=${$scope.names}`
        }else{
            window.location.href = `#!/aggregate?logNames=${$scope.names}`
        }
    }
});
