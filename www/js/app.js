// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('nix', ['ionic'])
 .constant('urls', {
       BASE: 'http://localhost:40405/',      
	   TOKEN_REQUEST: '/oauth/token'
   })
.controller('LogInCtrl', function($scope, $state, $http, formData, auth) {
 $scope.user = {};
	
 $scope.submitForm = function(user) {	
   if (user.userId && user.password) {
	 formData.updateForm(user);	 
	 
	 auth.login(user, function(){ $state.go('landing');});
	
     console.log("Logging In ", user);
	
   } else {
     alert("Please enter user name and password");
   }
 };
})

.controller('LandingCtrl', function($scope, $state, auth, httpService) {
	$scope.user = auth.getLoggedInUser();
	$scope.hospitals = httpService.getHospitals();
	console.log($scope.hospitals);
	$scope.getHospitals = function()
	{
		$scope.hospitals = httpService.getHospitals();
		console.log("hospitals ", $scope.hospitals);
	}	
	$scope.logout = function() {
		 console.log("Logging Out ", $scope.user);
		 auth.logout( function(){$state.go('login')});
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
.service('auth', function($http, urls) {
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
	   
	   function loginuser(loggindata, success) {
            $http({
						method: 'POST',
						url: urls.BASE + urls.TOKEN_REQUEST,
						headers: {'OCClientContext': '{   "ProductName" : "CP",   "PartnerProductId" : "",   "OmniCenterInstallation" : "CPC01",   "TimeStamp" : "06/26/2015 19:40:05"  }', 'Content-Type': 'application/x-www-form-urlencoded'},
						data: 'UserName='+ encodeURIComponent(loggindata.userId)+'&Password='+ encodeURIComponent(loggindata.password) + '&grant_type=password'
							}).then(function successCallback(response) {
								console.log(response.data)
								window.localStorage['token'] = response.data.access_token;
								console.log(getClaimsFromToken())
								success();
						},
							function errorCallback(response) {console.log(response.data)
					});
       }

       var tokenClaims = '';//getClaimsFromToken();
	   
       return {
           signup: function (data, success, error) {
               $http.post(urls.BASE + '/signup', data).success(success).error(error)
           },
           login: function (loggindata, success, error) {
                 loginuser(loggindata, success);
				},
           logout: function (success) {
               tokenClaims = {};
               window.localStorage['token']= '';
               success();
           },
           getTokenClaims: function () {
			   tokenClaims = getClaimsFromToken();
               return tokenClaims;
           },
			getLoggedInUser : function(){				
				return { userId : tokenClaims.Omnicell_UserId, userName : tokenClaims.Omnicell_UserName};
			}		   
       };
   })
.service('httpService', function($http, urls) {
	 function getHospitals() {
		 console.log("Getting Hospitals ");	
		 var hospitals = {};
		 $http.get( urls.BASE + '/System/GetHospitals')
			   .then(function (response) {				 
				 console.log('Get Hospitals', response.data);
				 hospitals =  response.data;				 
			   });		
         return hospitals;   
	};
	
	return {
           getHospitals: function (data, success, error) {
               return getHospitals();
			},
	};
})

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
 $urlRouterProvider.otherwise('login');
});
