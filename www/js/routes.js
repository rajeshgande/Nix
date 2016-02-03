angular.module('nix.routes', [])
.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('login', {
    url: "/login",
    templateUrl: "views/login.html",
    controller: 'LogInCtrl'
  })
.state('landing', {
   url: "/landing",
   templateUrl: "views/landing.html",
   controller: 'LandingCtrl'
 })
 .state('itementry', {
   url: "/itementry",
   templateUrl: "views/itementry.html",
   controller: 'ItemEntryCtrl'
 })
 $urlRouterProvider.otherwise('login');
});