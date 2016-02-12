angular.module('nix.routes', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('menu', {
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
                url: '/login',
                views: {
                    'menuContent': {
                        templateUrl: 'views/login.html',
                        controller: 'LogInCtrl'
                    }
                }
            })
            .state('menu.cplist', {
                url: '/cplist',
                views: {
                    'menuContent': {
                        templateUrl: 'views/cplist.html',
                        controller: 'cplistCtrl'
                    }
                }
            })            
             .state('menu.cyclecount', {
                url: "/cyclecount",
                  views: {
                    'menuContent': {
                        templateUrl: 'views/cyclecount.html',
                        controller: 'cycleCountCtrl'
                    }
                }
            })
            
            // .state('login', {
            //     url: "/login",
            //     templateUrl: "views/login.html",
            //     controller: 'LogInCtrl'
            // })
            // .state('landing', {
            //     url: "/landing",
            //     templateUrl: "views/landing.html",
            //     controller: 'LandingCtrl'
            // })
            // .state('itementry', {
            //     url: "/itementry",
            //     templateUrl: "views/itementry.html",
            //     controller: 'ItemEntryCtrl'
            // })
           
        $urlRouterProvider.otherwise('/menu/login');
    })
;