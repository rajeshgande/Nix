angular.module('nix.controllers')
.controller('CycleCountCtrl', function($scope, httpService, $ionicPopup, $cordovaBarcodeScanner, $ionicPlatform, $window) {
	 var vm = this;

     vm.setCpSelection = function(cp) {
            vm.selectedCp = cp; 
            window.localStorage['SelectedCP'] = vm.selectedCp;
            window.localStorage['omnisiteid'] = vm.selectedCp.OmniSiteId;
            window.localStorage['omniIpAddress'] = vm.selectedCp.IpAddress;                
     };

     httpService.getAllCPs().then(function(data) {
		  vm.cps=data;
          vm.setCpSelection(data[0]);
         
		});
           
	vm.item = { ItemId : "", FormattedGenericName : "", QuantityOnHand : "", ExpirationDate : "", Location : "", ItemBarCode : "" };
   
    

    // vm.selectedCp =  JSON.parse(window.localStorage['SelectedCP']);
    //console.log( vm.selectedCp);
    vm.isRunningInBrowser = false;
    if (!$window.cordova)
    {
        console.log("runnign in dev mode")
        vm.item.ItemBarCode = '1234567';
        vm.isRunningInBrowser = true;        
    }
    		 
    vm.perfomCycleCount = function() {		 	 
		 httpService.updateQty(vm.item);
	 };
     
     vm.getitem = function(){   
           vm.currentlyScanning = false;                 
            httpService
                .getItemDetails(vm.item.ItemBarCode)
                .then(function(data) {
                    if (data) {
                        vm.item = data;
                        vm.item.ExpirationDate = new Date(vm.item.ExpirationDate);
                    }
                }); 
        };
        
    vm.scan = function(){
        if (vm.currentlyScanning === true) {           
                    return;
            }
            else if (vm.isRunningInBrowser) {
                vm.currentlyScanning = false;        
                vm.getitem();
            } else {
                vm.currentlyScanning = true;
                console.log('running in mobile device');      
                $ionicPlatform.ready(function() {
                    $cordovaBarcodeScanner
                    .scan()
                    .then(function(result) {
                        vm.currentlyScanning = false;
                        vm.item = { ItemId : "", FormattedGenericName : "", QuantityOnHand : "", ExpirationDate : "", Location : "", ItemBarCode : "" };
                        vm.item.ItemBarCode = result.text;
                        console.log("Scanned barcode: " + vm.item.ItemBarCode);                    
                        httpService
                            .getItemDetails(vm.item.ItemBarCode)
                            .then(function(data) {
                                vm.item=data;
                                console.log(data);
                                });                    
                    }, function(error) {
                        $ionicPopup.alert({ title: 'Error: ' + error });
                        console.log('Error: ' + error);
                    });
                });
            }
    };
})