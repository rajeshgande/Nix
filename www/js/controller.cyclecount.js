angular.module('nix.controllers')
.controller('cycleCountCtrl', function($scope, $state, httpService, $cordovaBarcodeScanner, $ionicPlatform, $ionicPopup) {
	 var vm = this;

     httpService.getAllCPs().then(function(data) {
		  vm.cps=data;
          vm.selectedCp =  data[0]; 
          window.localStorage['SelectedCP'] = vm.selectedCp;
          window.localStorage['omnisiteid'] = vm.selectedCp.OmniSiteId;
          window.localStorage['omniIpAddress'] = vm.selectedCp.IpAddress;
		});
           
	vm.item = { ItemId : "", FormattedGenericName : "", QuantityOnHand : "", ExpirationDate : "", Location : "", ItemBarCode : "" };
   
   /*
    $scope.numeric_options = {
    start: function (event, ui) { console.log('numeric start'); },
    spin: function (event, ui) { console.log('numeric spin'); }
    }
    */
  
    vm.setCpSelection = function(cp) {
        window.localStorage['SelectedCP'] = cp;
        window.localStorage['omnisiteid'] = cp.OmniSiteId;
        window.localStorage['omniIpAddress'] = cp.IpAddress;                
     };

    // vm.selectedCp =  JSON.parse(window.localStorage['SelectedCP']);
    //console.log( vm.selectedCp);
   
	vm.headerText = 'Cycle Count';

    if (!window.cordova)
    {
        console.log("runnign i ndev")
        // running in dev browser mode
        vm.item.ItemBarCode = '1234567';
        // vm.item.ItemBarCode = '5026859315';
    }
    		 
    vm.submitForm = function(item) {		
		 formData.updateForm(item);	 
		 httpService.updateQty(item);
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
        
     if (vm.currentlyScanning === true) {           
            return;
      }
     else if (!window.cordova) {
         // running in dev browser mode
        vm.currentlyScanning = false;        
        vm.scan =  vm.getitem;
    } else {
        vm.currentlyScanning = true;
        // running in mobile device  
        vm.scan = function(){
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
        };
    }
})