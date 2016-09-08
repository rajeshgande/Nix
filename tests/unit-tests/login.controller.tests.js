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
        abc = true;
        scopeMock = $rootScope.$new();      

        authServiceMock = {
            login: function (loggindata, success, error) {
                 /* do something */
				}     
        };

        // mock $state
        stateMock = jasmine.createSpyObj('$state spy', ['go']);

        // mock $ionicPopup
        ionicPopupMock = jasmine.createSpyObj('$ionicPopup spy', ['alert']);

        controller = $controller('LogInCtrl', { 
                            $scope: scopeMock,
                            '$state': stateMock, 
                            'auth': authServiceMock,
                            '$ionicPopup': ionicPopupMock                    
                            } );
    }));

    // tests start here
    it('should have server populated', function(){
        expect(scopeMock.serverAddressNotPopulated()).toEqual(false);
    });
});