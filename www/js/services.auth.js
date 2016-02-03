angular.module('nix.services')
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