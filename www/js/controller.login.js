angular.module('nix.controllers')
.controller('LogInCtrl', function($scope, $state, $http, formData, auth) {
	$scope.user = {};
 
	if(window.localStorage.getItem("serveraddress") == undefined ) {
          $scope.user.ServerAddress =  'localhost';
        }
	else{
		$scope.user.ServerAddress = window.localStorage.getItem("serveraddress");
	}				
	
	 $scope.goToItemEntry = function(){
		 $state.go('cyclecount');
	 };
	 
	 $scope.submitForm = function(user) {	
	 
	   if (user.userId && user.password) {
	    
		window.localStorage.setItem('serveraddress', $scope.user.ServerAddress);
		window.localStorage.setItem("baseurl", 'http://' + $scope.user.ServerAddress + ':40405/');	
		
        formData.updateForm(user);
		 
		 auth.login(user, function(){ $state.go('menu.cplist');});
		window.localStorage['isuserLoggedIn'] = true;
		 console.log("Logging In ", user);
		
	   } else {
		 alert("Please enter user name and password");
	   }
	 };
})