angular.module('nix.controllers')
    .controller('barcodeScanCtrl', function($scope, httpService, $ionicPopup, $cordovaBarcodeScanner, $ionicPlatform, $window) {
        var vm = this;
        vm.headerText = 'Barcode Scanner';

        vm.refreshItem = function() {
            vm.item = { ItemId: "", FormattedGenericName: "", QuantityOnHand: "", ExpirationDate: "", Location: "", ItemBarCode: "" };

            // Just for debugging
            if (!$window.cordova) {
                vm.item.ItemBarCode = '1234';
            }
        };
        vm.refreshItem();

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

        vm.isRunningInBrowser = false;
        if (!$window.cordova) {
            console.log("running in dev mode")
            vm.isRunningInBrowser = true;
        }

        vm.submitForm = function(item) {
            httpService.updateQty(item);
        };

        vm.getitem = function() {
            vm.currentlyScanning = false;
            httpService
                .getItemDetails(vm.item.ItemBarCode)
                .then(function(data) {
                    vm.item = data;
                    vm.item.ExpirationDate = new Date(vm.item.ExpirationDate);
                });
        };

        vm.mapItemData = function(data) {
            if (data) {
                vm.item = data;
            } else {
                vm.refreshItem();
            }
        }

        vm.scan = function() {
            if (vm.currentlyScanning === true) {
                return;
            } else if (vm.isRunningInBrowser) {
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
                            vm.item = { ItemId: "", FormattedGenericName: "", QuantityOnHand: "", ExpirationDate: "", Location: "", ItemBarCode: "" };
                            vm.item.ItemBarCode = result.text;
                            console.log("Scanned barcode: " + vm.item.ItemBarCode);
                            httpService
                                .getItemDetails(vm.item.ItemBarCode)
                                .then(function(data) {
                                    vm.mapItemData(data);
                                });
                        }, function(error) {
                            $ionicPopup.alert({ title: 'Error: ' + error });
                            console.log('Error: ' + error);
                        });
                });
            }
        };
    })
