angular.module('nix.controllers')
.controller('LogInCtrl', function($scope, $state, $http, formData, auth, $rootScope, $ionicPopup) {
	
    $scope.user = {};   

    var showServerAddress = false;

    $scope.serverAddressNotPopulated = function() {
    	return window.localStorage.getItem("baseurl") == undefined || window.localStorage['baseurl'] == "" || showServerAddress ;
    } 
 
	if(window.localStorage.getItem("baseurl") == undefined || window.localStorage['baseurl'] == "") {
    	window.localStorage['baseurl'] =  'https://omninix.omnicellanalytics.com:40405';
    }
        
     if(window.localStorage.getItem("proxycalls") == undefined || window.localStorage['proxycalls'] == "") {
           window.localStorage['proxycalls'] =  true;
        }
    
    $scope.user.ServerAddress = window.localStorage['baseurl'];	

   
   var loginFailureAlert = function(responsedata){ 
       showServerAddress =  responsedata.status != '400';
        $ionicPopup.alert({
            title: 'Login Error',
            template: responsedata.status == '400' ? 'Invalid User Id and Password' : "Server Error"        
   });};
		 
	 $scope.submitForm = function(user) {	
	 
	   if (user.userId && user.password) {
		
        //window.localStorage.setItem("baseurl", $scope.user.ServerAddress);
        formData.updateForm(user);
		auth.login(user, 
            function(){
                 showServerAddress = false;
                 $state.go('menu.cyclecount');}, 
            loginFailureAlert
       );
         
        $rootScope.control = {
            isLoggedIn: true
        };	 
		
        console.log("Logging In ", user);
         
		
	   } else {
           //An alert dialog          
            $ionicPopup.alert({
                title: 'Login Error',
                template: 'Please enter user name and password'
            });
	   }
	 };
})