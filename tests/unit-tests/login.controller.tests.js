describe('Controllers', function(){
  
   var controller, 
        abc,
        authServiceMock,
        stateMock,
        ionicPopupMock,
        scopeMock,
        rootScopeMock;

    
    // load the controller's module
    beforeEach(module('nix.controllers'));

    beforeEach(inject(function($rootScope, $controller) {        
        scopeMock = $rootScope.$new();    


        authServiceMock = {
            sucesslogin: true,
            loginWasCalled: false,
            login: function (loggindata, success, error) {                
                this.loginWasCalled = true;
                if(this.sucesslogin){
                     success();
                } else {                   
                    error({status:'500'});
                } 
			}     
        };

        // mock $state
        stateMock = jasmine.createSpyObj('$state spy', ['go']);

        // mock $ionicPopup
        ionicPopupMock = jasmine.createSpyObj('$ionicPopup spy', ['alert']);

        controller = $controller('LogInCtrl', { 
                            $scope: scopeMock,
                            $state: stateMock, 
                            'auth': authServiceMock,
                            '$ionicPopup': ionicPopupMock                    
                            } );
        //console.log(controller.user.ServerAddress);
    }));

    // tests start here
    it('should have server address populated', function(){       
        expect(controller.serverAddressNotPopulated()).toEqual(false);
        expect(controller.ServerAddress).toEqual('https://omninix.omnicellanalytics.com:40405');
        expect(window.localStorage['baseurl']).toEqual('https://omninix.omnicellanalytics.com:40405');    
    });
  
    it('doLogin Sucessful', function(){ 
        var user = {userId:'abc', password:'abc'}
        controller.doLogin(user);
        expect(authServiceMock.loginWasCalled).toEqual(true);
        expect(stateMock.go).toHaveBeenCalledWith('menu.cyclecount');
        expect(controller.showServerAddress).toEqual(false);
        expect(scopeMock.control.isLoggedIn ).toEqual(true);         
    });

     it('doLogin UnSucessful', function(){ 
         var user = {userId:'abc', password:'abc'}
        authServiceMock.sucesslogin = false;
        controller.doLogin(user);

        expect(authServiceMock.loginWasCalled).toEqual(true); 
        expect(controller.showServerAddress).toEqual(true);  
        expect(ionicPopupMock.alert).toHaveBeenCalled();
    });

    it('doLogin requires userid and password', function(){ 
        var user = {};
        controller.doLogin(user);
        expect(authServiceMock.loginWasCalled).toEqual(false);    
        expect(ionicPopupMock.alert).toHaveBeenCalled();
    });

});