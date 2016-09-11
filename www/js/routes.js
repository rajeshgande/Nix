angular.module('nix.routes', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('menu', {
                cache: false,
                url: '/menu',
                abstract:true,
                templateUrl: 'views/menu.html',
                controller: 'menuCtrl'                
                })
            .state('menu.settings', {
                url: '/settings',
                views: {
                    'menuContent': {
                        templateUrl: 'views/settings.html',
                        controller: 'settingsCtrl'
                    }
                }
            })        
            .state('menu.login', {
                cache: false,
                url: '/login',
                views: {
                    'menuContent': {
                        templateUrl: 'views/login.html',
                        controller: 'LogInCtrl'
                    }
                }
            })                  
            .state('menu.cyclecount', {
                cache: false,
                url: "/cyclecount",
                  views: {
                    'menuContent': {
                        templateUrl: 'views/cyclecount.html',
                        controller: 'cycleCountCtrl'
                    }
                }
            })
            .state('menu.barcodescan', {
                cache: false,
                url: "/barcodescan",
                  views: {
                    'menuContent': {
                        templateUrl: 'views/barcodescan.html',
                        controller: 'barcodeScanCtrl'
                    }
                }
            })
        $urlRouterProvider.otherwise('/menu/login');
    })
;