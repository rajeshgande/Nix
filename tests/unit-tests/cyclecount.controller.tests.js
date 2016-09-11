describe('CycleCount Controller Tests', function(){
  
   var controller,
        scopeMock,
        httpServiceMock,
        scannerMock,
        ionicPlatformMock,
        ionicPopupMock,
        deferredCplist;
    
    // load the controller's module
    beforeEach(module('nix.controllers'));

    beforeEach(inject(function($rootScope, $controller, $q) {        
        scopeMock = $rootScope.$new();    

    deferredCplist = $q.defer();
    var mockcplist = [
                { name: 'cpone', IpAddress: '127.0.0.1', OmniSiteId: 'site1' }, 
                { name: 'cptwo', IpAddress: '127.0.0.2', OmniSiteId: 'site1' }];
    httpServiceMock = {  
            getAllCPs: jasmine.createSpy('getAllCPs spy')
                        .and.callFake(function () {
                    return {
                        then: function (callback) {
                            return callback(mockcplist);
                        } 
                    }    
            }) 
        };

 
      
    // mock $ionicPopup
    ionicPopupMock = jasmine.createSpyObj('$ionicPopup spy', ['alert']);
    scannerMock = jasmine.createSpyObj('$cordovaBarcodeScanner spy', ['scan']);
    ionicPlatformMock = jasmine.createSpyObj('$ionicPlatform spy', ['ready']);

    controller = $controller('CycleCountCtrl', { 
                        $scope: scopeMock,
                        'httpService': httpServiceMock, 
                        '$ionicPopup': ionicPopupMock,
                        '$cordovaBarcodeScanner': scannerMock,
                        '$ionicPlatform': ionicPlatformMock           
                        } );
    }));
  
    it('Gets cp list and sets default selection', function(){

        expect(httpServiceMock.getAllCPs).toHaveBeenCalled();
        expect(controller.cps.length).toEqual(2);
        expect(controller.selectedCp.IpAddress).toEqual('127.0.0.1');
        expect(window.localStorage['omniIpAddress']).toEqual('127.0.0.1'); 
    });   

});