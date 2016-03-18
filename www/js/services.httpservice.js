angular.module('nix.services')
.service('httpService', function($http, urls) {
	 
	 function gethospitals() {
		 console.log("Getting Hospitals ");	
		 var hospitals = {};
		 
		 var getHospitalsurl = window.localStorage.getItem("baseurl") + '/System/GetHospitals';
		hospitals = $http({
			  method: 'GET',
			  url: getHospitalsurl
			}).then(function successCallback(response) {
				 console.log('Get Hospitals', response.data);
				 return response.data;		
			  }, function errorCallback(response) {
				console.log('Error Geting Hospitals...' + response.data);
				alert('Error Geting Hospitals' + response.data);
				return {};
			  });
			  
		return hospitals;   
	};
	
	function getcps() {
		 console.log("Getting CPS ");	
		 var cps = {};
		 
		 var cpurl = window.localStorage.getItem("baseurl") + '/Cp/Cps';
		cps = $http({
			  method: 'GET',
			  url: cpurl,
			  headers: {
						'OCClientContext': '{   "ProductName" : "CP",   "PartnerProductId" : "",   "OmniCenterInstallation" : "CPC01",   "TimeStamp" : "06/26/2016 19:40:05"  }', 
						'Content-Type': 'application/json',
                        'Authorization' : 'bearer ' + window.localStorage['token']
						},
			}).then(function successCallback(response) {
				 console.log('Get CPs', response.data);
				 return response.data;		
			  }, function errorCallback(response) {
				console.log('Error Getting CPs...' + response.data);
				alert('Error Getting CPs' + response.data);
				return {};
			  });
			  
		return cps;   
	};
	
	  function updateQty(item) {
          
        var uri = 'http://' +  window.localStorage.getItem("omniIpAddress") + ':40407/api/items';
        var targeturl = uri;
        if( JSON.parse(window.localStorage['proxycalls']) === true)
        {
             uri = window.localStorage.getItem("baseurl")  + '/Proxy/Post';
             console.log('proxy call');
        }
        else {
            console.log('non proxy call');
        }
        
        var cycleCount = { ItemId : item.ItemId, Quantity: item.QuantityOnHand, ExpirationDate: item.ExpirationDate}        
        $http({
                    method: 'POST',
                    url: uri,
                    headers: {
                        'OCClientContext': '{   "ProductName" : "CP",   "PartnerProductId" : "",   "OmniCenterInstallation" : "CPC01",   "TimeStamp" : "06/26/2016 19:40:05"  }', 
                        'Content-Type': 'application/json',
                        'Authorization' : 'bearer ' + window.localStorage['token'],
                        'x-clientId' : '00000000-0000-0000-0000-000000000000',
                        'x-apikey' : 'sdkfjnb983t47h39gn7fh92fg39ng9h87ghf298h',
                        'x-targeturl' : targeturl
                    },
                    
                    data: cycleCount// '{ItemId:"'+ item.ItemId+'",Quantity:"'+ item.QuantityOnHand +'",ExpirationDate:"'+ item.ExpirationDate+'}'						
                        }).then(function successCallback(response) {	
                        //alert('Item: ' + item.ItemId+ '\'s quantity updated to ' + item.Quantity )
                    },
                        function errorCallback(response) {
                            alert('error updating item quantity...' + response.data)
                            console.log(response.data)
                });
	};
    
    function getItemDetails(barcode){       
        var uri = 'http://' +  window.localStorage.getItem("omniIpAddress") + ':40407/api/items?barcode='+ barcode;    
        var targeturl = uri;
        if( JSON.parse(window.localStorage['proxycalls']) === true)
        {
             uri = window.localStorage.getItem("baseurl")  + '/Proxy/Get?barcode='+ barcode;
             console.log('proxy call to cp');
        }
        else {
            console.log('non proxy call to cp');
        }
         
         return $http({
						method: 'GET',
						url:  uri,
						headers: {
							'OCClientContext': '{   "ProductName" : "CP",   "PartnerProductId" : "",   "OmniCenterInstallation" : "CPC01",   "TimeStamp" : "06/26/2016 19:40:05"  }', 
						    'Content-Type': 'application/json',
                            'Authorization' : 'bearer ' + window.localStorage['token'],
                            'x-clientId' : '00000000-0000-0000-0000-000000000000',
                            'x-apikey' : 'sdkfjnb983t47h39gn7fh92fg39ng9h87ghf298h',
                            'x-targeturl' : targeturl
						}
                        }).then(function successCallback(response) {
                            var item = 	response.data;
							console.log('Item Id: ' + item.ItemId + ' itemName ' + item.ItemId )
                             return item;
						},
							function errorCallback(response) {
                                var errorstr = 'Error getting Item details by barcode.' + response.data;
								alert(errorstr)
								console.log(errorstr)
                                return {};
					});
    }
	
	return {
           getHospitals: function (data, success, error) {
               return gethospitals();
			},
			getAllCPs: function (data, success, error) {
               return getcps();
			},
			updateQty: function (item) {
               return updateQty(item);
			},
            getItemDetails: function (barcode) {
               return getItemDetails(barcode);
			},	
	}
})