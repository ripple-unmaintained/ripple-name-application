'use strict';

var rippleNames = angular
    .module('clientApp', [
        'ngResource',
        'ngRoute'
    ]);

rippleNames.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});
