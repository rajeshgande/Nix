describe('Settings Controller Tests', function(){
    
 var controller,
        scopeMock,
        httpServiceMock;

    
    // load the controller's module
    beforeEach(module('nix.controllers'));

    beforeEach(inject(function($rootScope, $controller) {        
        scopeMock = $rootScope.$new();    

       window.localStorage['baseurl'] = "";
       window.localStorage['proxycalls'] = "";
       window.localStorage['demoMode'] = "";
     

        // mock $state
        stateMock = jasmine.createSpyObj('$state spy', ['go']);
        
       
       controller = $controller('settingsCtrl', { 
                        $scope: scopeMock,
                        'httpService': httpServiceMock       
                        } );
     
    }));

     it('should set to default value', function(){
        expect(window.localStorage['baseurl']).toEqual('https://omninix.omnicellanalytics.com:40405');
        expect(window.localStorage['proxycalls']).toEqual('true');                
        expect(window.localStorage['demoMode']).toEqual('true');    
    });
    
     // OnServerAddressChanged
    it('should have server address changed', function(){       
        expect(controller.onServerAddressChange()).toEqual(undefined);
        expect(window.localStorage['baseurl']).toEqual('https://omninix.omnicellanalytics.com:40405');    
    });
    
    
     // OnSonProxycallsChanged
    it('should have proxy calls changed', function(){       
        expect(controller.onProxycallsChange()).toEqual(undefined);
        expect(window.localStorage['proxycalls']).toEqual('true');    
    });
    
    
     // OnSonProxycallsChanged
    it('should have Demo Mode changed', function(){       
        expect(controller.onDemoModeChange()).toEqual(undefined);
        expect(window.localStorage['demoMode']).toEqual('true');    
    });
    
      
});
