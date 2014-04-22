'use strict';

rippleNames.controller('MainCtrl', function ($scope, $http, reCAPTCHA) {
    //form status
    $scope.isSubmitting = false;
    $scope.submittedSuccessfully = false;
    $scope.submitForm = function(isValid){
        //form status
        $scope.submitErrors = [];
        $scope.rippleName = {};

        if(isValid){
            $scope.isSubmitting = true;
            $http.post('/v1/application', $scope.rippleName).success(successCallback).error(errorCallback);
        }

        function successCallback(data){
            if(data.success) {
                $scope.submittedSuccessfully = true;
            }
        }

        function errorCallback(data){
            if (!data.success){
                $scope.isSubmitting = false;
                angular.forEach(data.error, function(key, value){
                    $scope.submitErrors.push(key);
                });
            }
        }
    }
});
