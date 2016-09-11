angular.module('nix.controllers')
.controller('LogInCtrl', function($scope, $state, auth, $rootScope, $ionicPopup) {
    var vm = this;
    
    vm.user = {};
    vm.showServerAddress = false;

    vm.serverAddressNotPopulated = function() {
    	return window.localStorage.getItem("baseurl") == undefined || window.localStorage['baseurl'] == "" || vm.showServerAddress ;
    } 
 
	if(vm.serverAddressNotPopulated) {
    	window.localStorage['baseurl'] =  'https://omninix.omnicellanalytics.com:40405';
    }
        
    if(window.localStorage.getItem("proxycalls") == undefined || window.localStorage['proxycalls'] == "") {
        window.localStorage['proxycalls'] =  true;
    }
    
    vm.ServerAddress = window.localStorage['baseurl'];
    
   var loginFailureAlert = function(responsedata){ 
       vm.showServerAddress =  responsedata.status != '400';
        $ionicPopup.alert({
            title: 'Login Error',
            template: responsedata.status == '400' ? 'Invalid User Id and Password' : "Server Error"        
   });};
		 
	 vm.doLogin = function(user) {	
	 
	   if (user.userId && user.password) {
		
        window.localStorage.setItem("baseurl", vm.ServerAddress);
        auth.login(user, 
            function(){
                 vm.showServerAddress = false;
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