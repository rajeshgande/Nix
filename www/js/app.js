// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('nix', ['ionic'])
 .constant('urls', {
       BASE: 'http://jwt.dev:8000',      
	   TOKEN_REQUEST: 'http://localhost:40405/oauth/token'
   })
.controller('LogInCtrl', function($scope, $state, $http, formData, Auth) {
 $scope.user = {};
	
 $scope.submitForm = function(user) {
	
   if (user.userId && user.password) {
	 formData.updateForm(user);	 
	 $http({
			method: 'POST',
			url: 'http://localhost:40405/oauth/token',
			headers: {'OCClientContext': '{   "ProductName" : "CP",   "PartnerProductId" : "",   "OmniCenterInstallation" : "CPC01",   "TimeStamp" : "06/26/2015 19:40:05"  }', 'Content-Type': 'application/x-www-form-urlencoded'},
			data: 'UserName='+ encodeURIComponent($scope.user.userId)+'&Password='+ encodeURIComponent($scope.user.password) + '&grant_type=password'
		}).then(function successCallback(response) {console.log(response.data)
			window.localStorage['token'] = response.data.access_token;
			console.log(Auth.getTokenClaims());
		},
				function errorCallback(response) {console.log(response.data)});
     console.log("Logging In ", user);
	 $state.go('hello');
   } else {
     alert("Please enter user name and password");
   }
 };
})

.controller('HelloCtrl', function($scope, $state, $http, formData) {
	$scope.user = formData.getForm();
	$scope.logout = function() {
		 console.log("Logging Out ", $scope.user);
		 $state.go('login');		 
	};
	$scope.getHospitals = function() {
		 console.log("Getting Hospitals ");		 
		 $http.get('http://10.6.223.25:40405/System/GetHospitals')
			   .then(function (response) {				 
				 console.log('Get Hospitals', response);
				 $scope.hospitals = response.data;
			   });		 
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
.factory('Auth', ['$http', 'urls', function() {
       function urlBase64Decode(str) {
           var output = str.replace('-', '+').replace('_', '/');
           switch (output.length % 4) {
               case 0:
                   break;
               case 2:
                   output += '==';
                   break;
               case 3:
                   output += '=';
                   break;
               default:
                   throw 'Illegal base64url string!';
           }
           return window.atob(output);
       }

       function getClaimsFromToken() {
           var token =  window.localStorage['token'];
           var user = {};
           if (typeof token !== 'undefined') {
               var encoded = token.split('.')[1];
               user = JSON.parse(urlBase64Decode(encoded));
           }
           return user;
       }

       var tokenClaims = getClaimsFromToken();

       return {
           signup: function (data, success, error) {
               $http.post(urls.BASE + '/signup', data).success(success).error(error)
           },
           login: function (data, success, error) {
               $http.post(urls.BASE + '/signin', data).success(success).error(error)
           },
           logout: function (success) {
               tokenClaims = {};
               window.localStorage['token']= '';
               success();
           },
           getTokenClaims: function () {
               return tokenClaims;
           }		   
       };
   }]
 )
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
