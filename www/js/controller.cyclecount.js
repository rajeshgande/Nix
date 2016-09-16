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
   
    vm.changeExpDateInput = function(dateType) {
        // Default first
        vm.dateShow = false;
        vm.monthShow = false;
        vm.datetimeShow = false;
        vm.noneDateShow = false;

        // console.log("printing out: -" + dateType + "-");
        if (dateType == 'undefined' || dateType === "None") {
            vm.noneDateShow = true;
        } else if (dateType == "1") {
            vm.dateShow = true;
        } else if (dateType == "2") {
            vm.monthShow = true;
        } else if (dateType == "3") {
            vm.datetimeShow = true;
        }
    };

    // vm.selectedCp =  JSON.parse(window.localStorage['SelectedCP']);
    //console.log( vm.selectedCp);
    vm.isRunningInBrowser = false;
    if (!$window.cordova)
    {
        console.log("runnign in dev mode")
        vm.item.ItemBarCode = '1234';
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
                vm.mapItemData(data);
            }); 
    };

    vm.mapItemData = function(data) {
        if (data) {
            vm.item = data;
            vm.item.ExpirationDate = new Date(vm.item.ExpirationDate);
            vm.changeExpDateInput(data.ExpirationDateGranularity);
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