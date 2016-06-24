// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('nix', ['ionic', 'nix.controllers', 'nix.services', 'nix.routes', 'nix.constants', 'ngCordova', 'nix.numeric', 'nix.directives', "ocDirective", "ocService", "ocBootstrap"])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

angular.module('nix.directives', [])
.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
});

angular.module('nix.controllers', [])

angular.module('nix.controllers')
.controller('menuCtrl', function($scope, $state, httpService, auth, $rootScope) {
   $rootScope.control = {
            isLoggedIn: false
        };	    		
   $scope.isloggedIn = auth.isuserLoggedIn();	
   console.log("login in status: " + $scope.isloggedIn)

	$scope.logout = function() {
        //  $scope.user = auth.getLoggedInUser();
		//  console.log("Logging Out ", $scope.user);
		 auth.logout( function(){$state.go('menu.login')});
          $rootScope.control = {
            isLoggedIn: false
        };	
	};	 
})

   
angular.module('nix.services', [])
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

