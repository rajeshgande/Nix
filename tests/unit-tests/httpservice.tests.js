describe('http Service Tests', function(){
  
   var service,
   urlsMock,
        httpBackend;
   // mocks
   mockcplist = [
                { name: 'cpone', IpAddress: '127.0.0.1', OmniSiteId: 'site1' }, 
                { name: 'cptwo', IpAddress: '127.0.0.2', OmniSiteId: 'site1' }];
    mockitem = { ItemId : "123", FormattedGenericName : "", QuantityOnHand : "10", ExpirationDate : "11/30/2016", Location : "", ItemBarCode : "1234" };
   
   
     beforeEach(function (){  
    // load the module.
   module('nix.services', function($provide) {
      
      // Jasmine's createSpyObj will create an object
      // that has spies on the specified array of properties.
      // it's equivalent to creating an object, then adding a
      // spy to a property, or simply spying on an existing property.
      urlsMock = jasmine.createSpyObj('urls', ['bar']);
      ionicPopupMock = jasmine.createSpyObj('$ionicPopup spy', ['alert']);
      // provide the mock!
      $provide.value('$ionicPopup', ionicPopupMock);
    });
    
    // get your service, also get $httpBackend
    // $httpBackend will be a mock, thanks to angular-mocks.js
    inject(function($httpBackend, _httpService_) {
      service = _httpService_;      
      httpBackend = $httpBackend;
    });
  });
  
  // make sure no expectations were missed in your tests.
  // (e.g. expectGET or expectPOST)
  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

it('Get CP List', function(){
    window.localStorage["baseurl"] = 'http://abc';
    httpBackend.expectGET('http://abc/Cp/Cps')
            .respond(mockcplist);

    var result;
    service.getAllCPs().then(function(data) {
		result = data;       
    }   
    );;   

    httpBackend.flush();

     expect(result).toEqual(mockcplist);
});

it('getItemDetails', function(){
    window.localStorage['proxycalls'] = true;
    window.localStorage["baseurl"] = 'http://abc';
    httpBackend.expectGET('http://abc/Proxy/Get?barcode=1234')
            .respond(mockitem);

    var result;
    service.getItemDetails('1234').then(function(data) {
		result = data;       
    }
    );;   

    httpBackend.flush();

     expect(result).toEqual(mockitem);
});

it('updateQty', function(){
   var mockitem2 = { ItemId : "123", FormattedGenericName : "", QuantityOnHand : "10", ExpirationDate : "11/30/2016", Location : "", ItemBarCode : "1234" };
 
    httpBackend.when('POST', 'http://abc/Proxy/Post')
        .respond(200, mockitem2);

    window.localStorage['proxycalls'] = true;
    window.localStorage["baseurl"] = 'http://abc';
    httpBackend.expectPOST('http://abc/Proxy/Post');

   
    var result;
        service.updateQty(mockitem2);

    httpBackend.flush();

var mockitem3 = { ItemId : "", FormattedGenericName : "", QuantityOnHand : "", ExpirationDate : "", Location : "", ItemBarCode : "" };
 
expect(mockitem2).toEqual(mockitem2);
});

it('updateQty eroor', function(){
   var mockitem2 = { ItemId : "123", FormattedGenericName : "", QuantityOnHand : "10", ExpirationDate : "11/30/2016", Location : "", ItemBarCode : "1234" };
 
    httpBackend.when('POST', 'http://abc/Proxy/Post')
        .respond(500, mockitem2);

    window.localStorage['proxycalls'] = true;
    window.localStorage["baseurl"] = 'http://abc';
    httpBackend.expectPOST('http://abc/Proxy/Post');

   
    var result;
        service.updateQty(mockitem2);

    httpBackend.flush();

var mockitem3 = { ItemId : "", FormattedGenericName : "", QuantityOnHand : "", ExpirationDate : "", Location : "", ItemBarCode : "" };
 
expect(mockitem2).toEqual(mockitem2);
});
});