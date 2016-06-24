angular.module('nix.controllers')
.controller('cycleCountCtrl', function($scope, $state, formData, httpService, $cordovaBarcodeScanner, $ionicPlatform, $ionicPopup) {
	 
     httpService.getAllCPs().then(function(data) {
		  $scope.cps=data;          
          $scope.selectedCp =  data[0]; 
		});
           
	$scope.item = { ItemId : "", FormattedGenericName : "", QuantityOnHand : "", ExpirationDate : "", Location : "", ItemBarCode : "" };
   
    $scope.numeric_options = {
    start: function (event, ui) { console.log('numeric start'); },
    spin: function (event, ui) { console.log('numeric spin'); }
    }
    
  
    $scope.setCpSelection = function(cp) {
        window.localStorage['SelectedCP'] = cp;
        window.localStorage['omnisiteid'] = cp.OmniSiteId;
        window.localStorage['omniIpAddress'] = cp.IpAddress;                
     };

    // $scope.selectedCp =  JSON.parse(window.localStorage['SelectedCP']);
    //console.log( $scope.selectedCp);
   
	$scope.headerText = 'Cycle Count';

    if (!window.cordova)
    {
        // running in dev browser mode
        $scope.item.ItemBarCode = '1234567';  
        // $scope.item.ItemBarCode = '5026859315';
    }
    		 
    $scope.submitForm = function(item) {		
		 formData.updateForm(item);	 
		 httpService.updateQty(item);
	 };
     
     $scope.getitem = function(){   
           $scope.currentlyScanning = false;                 
            httpService
                .getItemDetails($scope.item.ItemBarCode)
                .then(function(data) {
                    $scope.item = data;
                    $scope.item.ExpirationDate = new Date($scope.item.ExpirationDate);
                }); 
        };
        
     if ($scope.currentlyScanning === true) {           
            return;
      }
     else if (!window.cordova) {
         // running in dev browser mode
        $scope.currentlyScanning = false;        
        $scope.scan =  $scope.getitem;
    } else {
        $scope.currentlyScanning = true;
        // running in mobile device  
        $scope.scan = function(){
            $ionicPlatform.ready(function() {
                $cordovaBarcodeScanner
                .scan()
                .then(function(result) {
                    $scope.currentlyScanning = false;
                    $scope.item.ItemBarCode = result.text;
                    console.log("Scanned barcode: " + $scope.item.ItemBarCode);                    
                    httpService
                        .getItemDetails($scope.item.ItemBarCode)
                        .then(function(data) {
                            $scope.item=data;
                            console.log(data);
                            });                    
                }, function(error) {
                    $ionicPopup.alert({ title: 'Error: ' + error });
                    console.log('Error: ' + error);
                });
            });
        };
    }
})