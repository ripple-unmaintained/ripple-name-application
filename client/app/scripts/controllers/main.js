'use strict';

rippleNames.controller('MainCtrl', function ($scope, $http) {
//    $scope.rippleName = {
//        full_name: "Abiy",
//        organization: "Ripple",
//        email: "abiy@ripple.com",
//        phone: '9879879879',
//        website: 'http://www.ripple.com',
//        ripple_name: 'Ripple name',
//        ripple_address: 'iuyweiruywqer7123',
//        justification: 'Long sentence'
//    };

    $scope.isSubmitting = false;
    $scope.submittedSuccessfully = false;

    $scope.submitForm = function(isValid){

        //form statuses
        $scope.submitted = true;
        $scope.submitErrors = [];

        console.log(isValid);
        if(isValid){
            $scope.isSubmitting = true;
            $http.post('/v1/application', $scope.rippleName).success(successCallback).error(errorCallback);
        }

        function successCallback(data){
            $scope.submittedSuccessfully = true;
            console.log(data);
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
