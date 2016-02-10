angular.module('nix.controllers')
.controller('ItemEntryCtrl', function($scope, $state, formData, httpService, $cordovaBarcodeScanner, $ionicPlatform) {
	    
	 $scope.item = {};
	 $scope.scan2 = function(){
          console.log("Logging Out ", $scope.user);
         alert('abc');
         };
	$scope.headerText = 'Enter Cycle Count';
	$scope.rawBarcode = '300080923603';
    
	
	$scope.gotoCPList = function() {
		 $state.go('landing');
	};	
		 
    $scope.submitForm = function(item) {	
	
		 formData.updateForm(item);	 
		 
		 httpService.updateQty(item);	
	  
	 };
     
    if (!window.cordova) {
    // running in dev mode
        $scope.scan = function(){                    
            httpService
                .getItemDetails($scope.rawBarcode)
                .then(function(data) {
                    $scope.item = data;
                    });   
        };
    } else {
        // running in mobile device  
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
                            console.log(data);
                            });                    
                }, function(error) {
                    alert('Error: ' + error);
                    console.log('Error: ' + error);
                });
            });
        };
    }
})