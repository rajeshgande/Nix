angular.module('nix.controllers')
.controller('cycleCountCtrl', function($scope, $state, formData, httpService, $cordovaBarcodeScanner, $ionicPlatform) {
	    
	 $scope.item = {ItemId : "", FormattedGenericName : "", QuantityOnHand : "", ExpirationDate : ""};
          
     $scope.scan2 = function(){
          console.log("Logging Out ", $scope.user);
         alert('abc');
         };
	$scope.headerText = 'Enter Cycle Count';
	$scope.rawBarcode = '5026859315';// '300080923603';
    		 
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