describe('barcodeScanCtrl Controller Tests', function() {

    var controller,
        scopeMock,
        httpServiceMock,
        scannerMock,
        ionicPlatformMock,
        ionicPopupMock,
        mockitem,
        mockcplist;

    // load the controller's module
    beforeEach(module('nix.controllers'));

    beforeEach(inject(function($rootScope, $controller, $q) {
        scopeMock = $rootScope.$new();

        // mocks
        mockcplist = [
            { name: 'cpone', IpAddress: '127.0.0.1', OmniSiteId: 'site1' },
            { name: 'cptwo', IpAddress: '127.0.0.2', OmniSiteId: 'site1' }
        ];
        mockitem = { ItemId: "123", FormattedGenericName: "", QuantityOnHand: "10", ExpirationDate: "11/30/2016", Location: "", ItemBarCode: "1234" };


        httpServiceMock = {
            getAllCPs: jasmine.createSpy('getAllCPs spy')
                .and.callFake(function() {
                    return {
                        then: function(callback) {
                            //controller.cps = mockcplist;
                            return callback(mockcplist);
                        }
                    }
                }),
            getItemDetails: jasmine.createSpy('getItemDetails spy')
                .and.callFake(function(barcode) {
                    return {
                        then: function(callback) {
                            return callback(mockitem);
                        }
                    }
                }),
            updateQty: jasmine.createSpy('updateQty spy')
        };

        ionicPopupMock = jasmine.createSpyObj('$ionicPopup spy', ['alert']);

        ionicPlatformMock = {
            ready: function(callback) { callback() }
        };

        scannerMock = {
            scan: jasmine.createSpy('scan spy')
                .and.callFake(function() {
                    return {
                        then: function(callback, callback2) {
                            callback2();
                            return callback('1234');
                        }
                    }
                }),
        }


        controller = $controller('barcodeScanCtrl', {
            $scope: scopeMock,
            'httpService': httpServiceMock,
            '$ionicPopup': ionicPopupMock,
            '$cordovaBarcodeScanner': scannerMock,
            '$ionicPlatform': ionicPlatformMock
        });
    }));

    it('Scan calls ionicPlatform if it is running in mobile', function() {
        // controller.item = {ItemBarCode:"1234"};
        controller.isRunningInBrowser = false;
        controller.scan();
        expect(controller.currentlyScanning).toEqual(false);
        expect(scannerMock.scan).toHaveBeenCalled();
        expect(controller.item.ItemBarCode).toEqual('1234');
        expect(httpServiceMock.getItemDetails).toHaveBeenCalled();
        expect(ionicPopupMock.alert).toHaveBeenCalled();
    });
});
