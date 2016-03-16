angular.module('nix.controllers')
.controller('LogInCtrl', function($scope, $state, $http, formData, auth, $rootScope) {
	
    $scope.user = {};   

 
	if(window.localStorage.getItem("serveraddress") == undefined ) {
          window.localStorage['baseurl'] =  'http://localhost:40405/';          
        }
	else{
		$scope.user.ServerAddress = window.localStorage['baseurl'];
	}				
	
	 $scope.goToItemEntry = function(){
		 $state.go('cyclecount');
	 };
	 
	 $scope.submitForm = function(user) {	
	 
	   if (user.userId && user.password) {
		
        window.localStorage.setItem("baseurl", $scope.user.ServerAddress);
        formData.updateForm(user);
		auth.login(user, function(){ $state.go('menu.cplist');});
         
        $rootScope.control = {
            isLoggedIn: true
        };	 
		
        console.log("Logging In ", user);
         
		
	   } else {
		 alert("Please enter user name and password");
	   }
	 };
})