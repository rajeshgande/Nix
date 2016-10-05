angular.module('nix.controllers')
.controller('CycleCountCtrl', function($scope, httpService, $ionicPopup, $cordovaBarcodeScanner, $ionicPlatform, $window, $rootScope) {
	 var vm = this;
     
     vm.refreshItem = function() {
        
        vm.item = { ItemId : "", FormattedGenericName : "", QuantityOnHand : "", ExpirationDate : "", Location : "", ItemBarCode : "" };
        $rootScope.hasItemData = false;

        // Just for debugging
        if (!$window.cordova) {
            vm.item.ItemBarCode = '1234';
        }
    }; 

    vm.setCpSelection = function(cp) {
        vm.selectedCp = cp;
        if (cp == null) {
            console.log("Error: CP selection is null");
            return;
        }

        // Check if new CP was picked, if not, exit.
        if (window.localStorage['omniIpAddress'] === vm.selectedCp.IpAddress) {
            return;
        }

        vm.refreshItem();
        window.localStorage['SelectedCP'] = vm.selectedCp;
        window.localStorage['omnisiteid'] = vm.selectedCp.OmniSiteId;
        window.localStorage['omniIpAddress'] = vm.selectedCp.IpAddress;                
    };

    httpService.getAllCPs().then(function(data) {
		vm.cps = data;
        vm.setCpSelection(data[0]);
    });
           
   
    vm.refreshItem(); 

    vm.changeExpDateInput = function(dateType) {
        // Default first
        vm.dateShow = false;
        vm.monthShow = false;
        vm.noneDateShow = false;

        if (dateType == 'undefined' || dateType === "None") {
            vm.noneDateShow = true;
        } else if (dateType == "Day" || dateType == "Time") {
            vm.dateShow = true;
        } else if (dateType == "Month") {
            vm.monthShow = true;
        }     
    };

    // vm.selectedCp =  JSON.parse(window.localStorage['SelectedCP']);
    //console.log( vm.selectedCp);
    vm.isRunningInBrowser = false;
    if (!$window.cordova)
    {
        console.log("running in dev mode")
        vm.isRunningInBrowser = true;        
    }
    		 
    vm.perfomCycleCount = function() {	
		 httpService.updateQty(vm.item, 
         function(){
               $ionicPopup.alert({title: 'Item Updated'});
                vm.refreshItem();
         },
          function(){
               $ionicPopup.alert({
     							title: 'Item Update Unsuccessful',
     							template: 'Please verify all your information and try again.'
   							});
         }
         );
	 };
     
    vm.getitem = function(){   
        vm.currentlyScanning = false;                 
        httpService
            .getItemDetails(vm.item.ItemBarCode)
            .then(function(data) {
                vm.mapItemData(data);               
            }); 
    };

    vm.mapItemData = function(data) {
        if (data) {             
            vm.item = data;
            
            if (vm.item.ExpirationDate) {
                vm.item.ExpirationDate = new Date(vm.item.ExpirationDate);
            } 
            
            vm.changeExpDateInput(data.ExpirationDateGranularity);
            $rootScope.hasItemData = true;
        } else {
            vm.refreshItem();           
        }
    }
        
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