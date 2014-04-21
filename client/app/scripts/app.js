'use strict';

var rippleNames = angular
    .module('clientApp', [
        'ngResource',
        'ngRoute',
        'reCAPTCHA'
    ]);

rippleNames.config(function (reCAPTCHAProvider) {
    reCAPTCHAProvider.setPublicKey('6LdEJfISAAAAAMYNSPq0RwTDBTOPxh8d40u744GJ');
});

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
