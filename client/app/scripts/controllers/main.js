'use strict';

rippleNames.controller('MainCtrl', function ($scope) {
    $scope.submitForm = function(isValid){
        $scope.submitted = true;
        console.log(isValid);
        if(isValid){

        }
    }
});
