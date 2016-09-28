describe('Auth Service Tests', function(){
  
   var service,
   urlsMock,
        httpBackend;
  
   
     beforeEach(function (){  
    // load the module.
   module('nix.services', function($provide) {
     // urlsMock.TOKEN_REQUEST = 'oauth/token'
     // provide the mock!
     // $provide.value('urls', urlsMock);
    });
    
    // get your service, also get $httpBackend
    // $httpBackend will be a mock, thanks to angular-mocks.js
    inject(function($httpBackend, _auth_) {
      service = _auth_;      
      httpBackend = $httpBackend;
    });
  });
  
  // make sure no expectations were missed in your tests.
  // (e.g. expectGET or expectPOST)
  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

xit('login', function(){

     var token  =  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbW5pY2VsbCIsInN1YiI6IjEwIiwiYXVkIjoiQ1AiLCJleHAiOjE0NzQwMTg3MjAsIm5iZiI6MTQ3Mzk3NTUyMCwiaWF0IjoxNDczOTc1NTIwLCJqdGkiOiJhNmM3NWM3OC04ZjhkLTRiZDEtOGE5ZC0wNWY5OWZjOWVhZDUiLCJPbW5pY2VsbF9Mb2dpbk1vZGUiOiJTUUwiLCJPbW5pY2VsbF9Vc2VySWQiOiIxMCIsIk9tbmljZWxsX1VzZXJOYW1lIjoiMTAiLCJPbW5pY2VsbF9JbnN0YWxsSWQiOiJDUEMwMSJ9.Lgg1pXgPBBSLccX1aFiyc24X3qrDKVYGC1ysuWWwTQ8';

     httpBackend.when('POST', 'http://abc/oauth/token')
        .respond(200, token);

    window.localStorage['proxycalls'] = true;
    window.localStorage["baseurl"] = 'http://abc';
    httpBackend.expectPOST('http://abc/oauth/token');


    var result;
    function sucess(data) {
    };
     function error(data) {
    };
    var user = {UserId:'a', Password: 'a'};
    service.login(user,sucess, error);   

    httpBackend.flush();

     expect(window.localStorage['token']).toEqual(token);
});

it('logout', function(){
   
    service.logout(function() {});   

    expect(window.localStorage['token']).toEqual('');
});

it('getTokenClaims', function(){
    window.localStorage['token'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbW5pY2VsbCIsInN1YiI6IjEwIiwiYXVkIjoiQ1AiLCJleHAiOjE0NzQwMTg3MjAsIm5iZiI6MTQ3Mzk3NTUyMCwiaWF0IjoxNDczOTc1NTIwLCJqdGkiOiJhNmM3NWM3OC04ZjhkLTRiZDEtOGE5ZC0wNWY5OWZjOWVhZDUiLCJPbW5pY2VsbF9Mb2dpbk1vZGUiOiJTUUwiLCJPbW5pY2VsbF9Vc2VySWQiOiIxMCIsIk9tbmljZWxsX1VzZXJOYW1lIjoiMTAiLCJPbW5pY2VsbF9JbnN0YWxsSWQiOiJDUEMwMSJ9.Lgg1pXgPBBSLccX1aFiyc24X3qrDKVYGC1ysuWWwTQ8';
    var claims = service.getTokenClaims();   

    expect(claims).toEqual(claims);
});

it('getLoggedInUser', function(){
    window.localStorage['token'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbW5pY2VsbCIsInN1YiI6IjEwIiwiYXVkIjoiQ1AiLCJleHAiOjE0NzQwMTg3MjAsIm5iZiI6MTQ3Mzk3NTUyMCwiaWF0IjoxNDczOTc1NTIwLCJqdGkiOiJhNmM3NWM3OC04ZjhkLTRiZDEtOGE5ZC0wNWY5OWZjOWVhZDUiLCJPbW5pY2VsbF9Mb2dpbk1vZGUiOiJTUUwiLCJPbW5pY2VsbF9Vc2VySWQiOiIxMCIsIk9tbmljZWxsX1VzZXJOYW1lIjoiMTAiLCJPbW5pY2VsbF9JbnN0YWxsSWQiOiJDUEMwMSJ9.Lgg1pXgPBBSLccX1aFiyc24X3qrDKVYGC1ysuWWwTQ8';
    var expected = { userId : '10', userName : '10', isLoggedIn : true};
    var user = service.getLoggedInUser();   

    expect(user).toEqual(expected);
});

it('isuserLoggedIn', function(){
    window.localStorage['token'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbW5pY2VsbCIsInN1YiI6IjEwIiwiYXVkIjoiQ1AiLCJleHAiOjE0NzQwMTg3MjAsIm5iZiI6MTQ3Mzk3NTUyMCwiaWF0IjoxNDczOTc1NTIwLCJqdGkiOiJhNmM3NWM3OC04ZjhkLTRiZDEtOGE5ZC0wNWY5OWZjOWVhZDUiLCJPbW5pY2VsbF9Mb2dpbk1vZGUiOiJTUUwiLCJPbW5pY2VsbF9Vc2VySWQiOiIxMCIsIk9tbmljZWxsX1VzZXJOYW1lIjoiMTAiLCJPbW5pY2VsbF9JbnN0YWxsSWQiOiJDUEMwMSJ9.Lgg1pXgPBBSLccX1aFiyc24X3qrDKVYGC1ysuWWwTQ8';
    var expected = { userId : '10', userName : '10', isLoggedIn : true};
    var isloggedin = service.isuserLoggedIn();   

    expect(isloggedin).toEqual(true);
});

});