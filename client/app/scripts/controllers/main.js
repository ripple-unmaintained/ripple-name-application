'use strict';

rippleNames.controller('MainCtrl', function ($scope, $rootScope, $http, reCAPTCHA) {
    //form status
    $scope.isSubmitting = false;
    $scope.submittedSuccessfully = false;

    $scope.checkDomain = function(name){
        $http.get('https://ripple-name.herokuapp.com/v1/validate?ripple_name=' + name).success(function(data){
            if(!data.success) {
                $scope.rippleNameForm.ripple_name.$setValidity('domainexists', false);
            } else {
                $scope.rippleNameForm.ripple_name.$setValidity('domainexists', true);
            }
        });
    };

    $scope.submitForm = function(isValid){
        //form status
        $scope.submitErrors = [];
        $scope.captchaError;


        if(isValid){
            $scope.isSubmitting = true;
            $http.post('https://ripple-name.herokuapp.com/v1/application', $scope.rippleName).success(successCallback).error(errorCallback);
        }

        function successCallback(data){
            $scope.isSubmitting = false;

            if(data.captchaError) {
                $scope.captchaError = true;
            } else if(data.success) {
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
    };
});
