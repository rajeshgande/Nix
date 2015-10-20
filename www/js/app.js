// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('nix', ['ionic'])
.controller('LogInCtrl', function($scope, $state, formData) {
 $scope.user = {};

 $scope.submitForm = function(user) {
   if (user.userId && user.password) {
	 formData.updateForm(user);
     console.log("Logging In ", formData.getForm());
	 $state.go('hello');
   } else {
     alert("Please enter user name and password");
   }
 };
})

.controller('HelloCtrl', function($scope, $state,formData) {
	$scope.user = formData.getForm();
	$scope.logout = function() {
		 console.log("Logging Out ", $scope.user);
		 $state.go('login');		 
	};
})

.service('formData', function() {
 return {
   form: {},
   getForm: function() {
     return this.form;
   },
   updateForm: function(form) {
     this.form = form;
   }
 }
})

.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('login', {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: 'LogInCtrl'
  })
.state('hello', {
   url: "/hello",
   templateUrl: "templates/hello.html",
   controller: 'HelloCtrl'
 })
 $urlRouterProvider.otherwise('login');
});
