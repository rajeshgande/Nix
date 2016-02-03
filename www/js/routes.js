angular.module('nix.routes', [])
.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('login', {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: 'LogInCtrl'
  })
.state('landing', {
   url: "/landing",
   templateUrl: "templates/landing.html",
   controller: 'LandingCtrl'
 })
 .state('itementry', {
   url: "/itementry",
   templateUrl: "templates/itementry.html",
   controller: 'ItemEntryCtrl'
 })
 $urlRouterProvider.otherwise('login');
});