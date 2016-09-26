describe('http Service Tests', function(){
  
   var service,
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
                { name: 'cptwo', IpAddress: '127.0.0.2', OmniSiteId: 'site1' }];
    mockitem = { ItemId : "123", FormattedGenericName : "", QuantityOnHand : "10", ExpirationDate : "11/30/2016", Location : "", ItemBarCode : "1234" };
   
   
    httpServiceMock = {  
        getAllCPs: jasmine.createSpy('getAllCPs spy')
                        .and.callFake(function () {
                    return {
                        then: function (callback) {
                            //controller.cps = mockcplist;
                            return callback(mockcplist);
                        } 
                    }    
            }),
        getItemDetails: jasmine.createSpy('getItemDetails spy')
                        .and.callFake(function (barcode) {
                    return {
                        then: function (callback) {
                            return callback(mockitem);
                        } 
                    }    
            }),
           updateQty : jasmine.createSpy('updateQty spy')
        };
    
    ionicPopupMock = jasmine.createSpyObj('$ionicPopup spy', ['alert']);
   
    ionicPlatformMock = {
        ready: function(callback){callback()}
            };
    
     scannerMock = {
         scan:jasmine.createSpy('scan spy')
                        .and.callFake(function () {
                    return {
                        then: function (callback, callback2) {
                            //callback('1234');
                            callback2();
                            return callback('1234');
                        } 
                    }    
            }),
     }
     

    controller = $controller('CycleCountCtrl', { 
                        $scope: scopeMock,
                        'httpService': httpServiceMock, 
                        '$ionicPopup': ionicPopupMock,
                        '$cordovaBarcodeScanner': scannerMock,
                        '$ionicPlatform': ionicPlatformMock           
                        } );
    }));

    it('Scan calls ionicPlatform if it is running in mobile', function(){
        // controller.item = {ItemBarCode:"1234"};
         controller.isRunningInBrowser = false;
         controller.scan();      
         expect(controller.currentlyScanning).toEqual(false);
         expect(scannerMock.scan).toHaveBeenCalled();
         expect(controller.item.ItemBarCode).toEqual('1234');
         expect(httpServiceMock.getItemDetails).toHaveBeenCalled();         
         expect(ionicPopupMock.alert).toHaveBeenCalled();

    });
  
    it('Gets cp list and sets default selection', function(){

        expect(httpServiceMock.getAllCPs).toHaveBeenCalled();
        expect(controller.cps.length).toEqual(2);
        expect(controller.selectedCp.IpAddress).toEqual('127.0.0.1');
        expect(window.localStorage['omniIpAddress']).toEqual('127.0.0.1');
    }); 

    it('Is Running in browser', function(){        
        expect(controller.isRunningInBrowser).toEqual(true);
    });  

     
    it('PerfomCycleCount Function Test', function(){      
        controller.perfomCycleCount();
         expect(httpServiceMock.updateQty).toHaveBeenCalled();
    });

    it('getitem  Function Test', function(){      
         controller.item = {ItemBarCode:"1234"};
         controller.getitem();        
         expect(controller.currentlyScanning).toEqual(false);
         expect(httpServiceMock.getItemDetails).toHaveBeenCalledWith(controller.item.ItemBarCode);
         expect(controller.item).toEqual(mockitem);
    });  

    it('Scan calls getitems if it is running in browser', function(){
         controller.item = {ItemBarCode:"1234"};
         controller.scan();      
         expect(controller.currentlyScanning).toEqual(false);
         expect(httpServiceMock.getItemDetails).toHaveBeenCalledWith(controller.item.ItemBarCode);
         expect(controller.item).toEqual(mockitem);
    });  


    it('Scan calls nothing if it is already scanning', function(){  
         controller.currentlyScanning = true;    
         controller.item = {ItemBarCode:"1234"};
         controller.scan();        
         expect(controller.currentlyScanning).toEqual(true);
         expect(httpServiceMock.getItemDetails).not.toHaveBeenCalled();
    });  

   
});