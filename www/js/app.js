// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('nix', ['ionic','ngCordova'])
 .constant('urls', {
       BASE: 'http://10.6.47.16:40405/', 
      // BASE: 'http://localhost:40405/', 
	   TOKEN_REQUEST: '/oauth/token'
   })
.controller('LogInCtrl', function($scope, $state, $http, formData, auth) {
	$scope.user = {};
 
	if(window.localStorage.getItem("serveraddress") == undefined ) {
          $scope.user.ServerAddress =  localhost;
        }
	else{
		$scope.user.ServerAddress = window.localStorage.getItem("serveraddress");
	}				
	
	 $scope.goToItemEntry = function(){
		 $state.go('itementry');
	 };
	 
	 $scope.submitForm = function(user) {	
	 
	   if (user.userId && user.password) {
	    
		window.localStorage.setItem('serveraddress', $scope.user.ServerAddress);
		window.localStorage.setItem("baseurl", 'http://' + $scope.user.ServerAddress + ':40405/');	
		
        formData.updateForm(user);	 
		 
		 auth.login(user, function(){ $state.go('landing');});
		
		 console.log("Logging In ", user);
		 
		 
		
	   } else {
		 alert("Please enter user name and password");
	   }
	 };
})

.controller('LandingCtrl', function($scope, $state, httpService, auth) {
	
	$scope.user = auth.getLoggedInUser();
	
	httpService.getAllCPs().then(function(data) {
		  $scope.cps=data;
		});
		
	console.log($scope.hospitals);
	
	$scope.logout = function() {
		 console.log("Logging Out ", $scope.user);
		 auth.logout( function(){$state.go('login')});	
	};
	
	 $scope.gotoItemEntry = function() {		
		$state.go('itementry');
	};
})

.controller('ItemEntryCtrl', function($scope, $state, formData, httpService, $cordovaBarcodeScanner, $ionicPlatform) {
	
    var vm = this;
	 $scope.item = {};
	
	$scope.headerText = 'Enter Cycle Count';
	$scope.CP = 'abcd';
	
	$scope.gotoCPList = function() {
		 $state.go('landing');
	};	
		 
    $scope.submitForm = function(item) {	
	
		 formData.updateForm(item);	 
		 
		 httpService.updateQty(item);	
	  
	 };
	 
	 vm.scan = function(){
        $ionicPlatform.ready(function() {
            $cordovaBarcodeScanner
            .scan()
            .then(function(result) {
                // Success! Barcode data is here
                vm.scanResults = "We got a barcoden" +
                "Result: " + result.text + "n" +
                "Format: " + result.format + "n" +
                "Cancelled: " + result.cancelled;
            }, function(error) {
                // An error occurred
                vm.scanResults = 'Error: ' + error;
            });
        });
    };
    
    vm.scanResults = '';
	
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
						url: window.localStorage.getItem("baseurl")  + urls.TOKEN_REQUEST,
						headers: {
							'OCClientContext': '{   "ProductName" : "CP",   "PartnerProductId" : "",   "OmniCenterInstallation" : "CPC01",   "TimeStamp" : "06/26/2016 19:40:05"  }', 
						'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: 'UserName='+ encodeURIComponent(loggindata.userId)+'&Password='+ encodeURIComponent(loggindata.password) + '&grant_type=password'
							}).then(function successCallback(response) {
								console.log(response.data)
								window.localStorage['token'] = response.data.access_token;
								console.log(getClaimsFromToken())
								success();
						},
							function errorCallback(response) {
								alert('error logging in...'+ response.data + ' serveraddress : ' + window.localStorage.getItem("baseurl") )
								console.log(response.data)
					});
       }

       var tokenClaims = '';//getClaimsFromToken();
	   
       return {
           signup: function (data, success, error) {
               $http.post(window.localStorage.getItem("baseurl") + '/signup', data).success(success).error(error)
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
				tokenClaims = getClaimsFromToken();			
				return { userId : tokenClaims.Omnicell_UserId, userName : tokenClaims.Omnicell_UserName};
			}		   
       };
   })
.service('httpService', function($http, urls) {
	 
	 function gethospitals() {
		 console.log("Getting Hospitals ");	
		 var hospitals = {};
		 
		 var getHospitalsurl = window.localStorage.getItem("baseurl") + '/System/GetHospitals';
		hospitals = $http({
			  method: 'GET',
			  url: getHospitalsurl
			}).then(function successCallback(response) {
				 console.log('Get Hospitals', response.data);
				 return response.data;		
			  }, function errorCallback(response) {
				console.log('Error Geting Hospitals...' + response.data);
				alert('Error Geting Hospitals' + response.data);
				return {};
			  });
			  
		return hospitals;   
	};
	
	function getcps() {
		 console.log("Getting CPS ");	
		 var cps = {};
		 
		 var cpurl = window.localStorage.getItem("baseurl") + '/System/GetAllCPs';
		cps = $http({
			  method: 'GET',
			  url: cpurl,
			  headers: {
						'OCClientContext': '{   "ProductName" : "CP",   "PartnerProductId" : "",   "OmniCenterInstallation" : "CPC01",   "TimeStamp" : "06/26/2016 19:40:05"  }', 
						'Content-Type': 'application/json'
						},
			}).then(function successCallback(response) {
				 console.log('Get CPs', response.data);
				 return response.data;		
			  }, function errorCallback(response) {
				console.log('Error Getting CPs...' + response.data);
				alert('Error Getting CPs' + response.data);
				return {};
			  });
			  
		return cps;   
	};
	
	  function updateQty(item) {
		  var updateqtyURl = window.localStorage.getItem("baseurl")  + '/System/UpdateQuantity?itemId='+ item.itemId +'&quantity='+ item.Quantity;
            $http({
						method: 'POST',
						url: updateqtyURl,
						headers: {
							'OCClientContext': '{   "ProductName" : "CP",   "PartnerProductId" : "",   "OmniCenterInstallation" : "CPC01",   "TimeStamp" : "06/26/2016 19:40:05"  }', 
						'Content-Type': 'application/json'
						},
						
						data: '{itemId:"'+ item.ItemId+'",quantity:"'+ item.Quantity +'"}'						
							}).then(function successCallback(response) {	
							alert('Item: ' + item.ItemId+ '\'s quantity updated to ' + item.Quantity )
						},
							function errorCallback(response) {
								alert('error updating item quantity...' + response.data)
								console.log(response.data)
					});
	};
	
	return {
           getHospitals: function (data, success, error) {
               return gethospitals();
			},
			getAllCPs: function (data, success, error) {
               return getcps();
			},
			updateQty: function (item) {
               return updateQty(item);
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
