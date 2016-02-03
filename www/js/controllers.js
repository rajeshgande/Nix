angular.module('nix.controllers', [])

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
	 $scope.scan2 = function(){
          console.log("Logging Out ", $scope.user);
         alert('abc');
         };
	$scope.headerText = 'Enter Cycle Count';
	$scope.CP = 'abcd';
	
	$scope.gotoCPList = function() {
		 $state.go('landing');
	};	
		 
    $scope.submitForm = function(item) {	
	
		 formData.updateForm(item);	 
		 
		 httpService.updateQty(item);	
	  
	 };
     
	 $scope.scan2 = function(){
          var barcode = "1234";
          alert('123');
                 httpService
                    .getItemDetails(barcode)
                    .then(function(data) {
                        $scope.item = data;
                        });   
     };
     
	 $scope.scan = function(){
        $ionicPlatform.ready(function() {
            $cordovaBarcodeScanner
            .scan()
            .then(function(result) {
                 var barcode = result.text
                
                 alert(barcode);
                 console.log("Scanned barcode: " + barcode);
                
                 httpService
                    .getItemDetails(barcode)
                    .then(function(data) {
                        $scope.item=data;
                        });                    
            }, function(error) {
                alert('Error: ' + error);
                console.log('Error: ' + error);
            });
        });
    };
    
    vm.scanResults = '';
	
})