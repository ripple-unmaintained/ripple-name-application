'use strict';

rippleNames.directive('nullIfEmpty', [function() {
        return {
            require: 'ngModel',
            link: function(scope, elm, attr, ctrl) {
                ctrl.$parsers.unshift(function(value) {
                    return value === '' ? null : value;
                });
            }
        };
    }]
);

rippleNames.controller('MainCtrl', function ($scope, $http) {
    //form status
    $scope.isSubmitting = false;
    $scope.submittedSuccessfully = false;

    $scope.submitForm = function(isValid){

        //form status
        $scope.submitErrors = [];

        if(isValid){
            $scope.isSubmitting = true;
            $http.post('/v1/application', $scope.rippleName).success(successCallback).error(errorCallback);
        }

        function successCallback(data){
            $scope.submittedSuccessfully = true;
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
