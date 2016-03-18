angular.module('nix.controllers')
.controller('cycleCountCtrl', function($scope, $state, formData, httpService, $cordovaBarcodeScanner, $ionicPlatform) {
	    
	$scope.item = {ItemId : "", FormattedGenericName : "", QuantityOnHand : "", ExpirationDate : ""};
   
    $scope.numeric_options = {
    start: function (event, ui) { console.log('numeric start'); },
    spin: function (event, ui) { console.log('numeric spin'); }
    }
         
     $scope.scan2 = function(){
          console.log("Logging Out ", $scope.user);
         alert('abc');
         };
	$scope.headerText = 'Cycle Count';
    
    if (!window.cordova)
    {
        // running in dev browser mode
        //$scope.rawBarcode = '1234567';  
        $scope.rawBarcode = '5026859315';
    }
    		 
    $scope.submitForm = function(item) {		
		 formData.updateForm(item);	 
		 httpService.updateQty(item);
	 };
     
     var getitem = function(){                    
            httpService
                .getItemDetails($scope.rawBarcode)
                .then(function(data) {
                    $scope.item = data;
                    }); 
        };
        
     if ($scope.currentlyScanning === true) {           
            return;
      }
     else if (!window.cordova) {
         // running in dev browser mode
        $scope.currentlyScanning = false;
        
        $scope.scan = getitem;
    } else {
        $scope.currentlyScanning = true;
        // running in mobile device  
        $scope.scan = function(){
            $ionicPlatform.ready(function() {
                $cordovaBarcodeScanner
                .scan()
                .then(function(result) {
                    $scope.currentlyScanning = false;
                    $scope.rawBarcode = result.text;
                    console.log("Scanned barcode: " + $scope.rawBarcode);                    
                    httpService
                        .getItemDetails($scope.rawBarcode)
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