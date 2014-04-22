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

rippleNames.directive('checkDomain', [function(){
    return{
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            elem.bind('blur', function(){
                 scope.checkDomain(elem.val());
            });
        }
    }
}]);