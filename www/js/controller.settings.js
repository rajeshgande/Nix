angular.module('nix.controllers')
.controller('settingsCtrl', function($scope, httpService) {
  
    var vm = this;
    //serverAddress
    if(window.localStorage.getItem("baseurl") == undefined || window.localStorage['baseurl'] == "") {
           window.localStorage['baseurl'] =  'https://omninix.omnicellanalytics.com:40405';
        }

    if(window.localStorage.getItem("demoMode") == undefined || window.localStorage['demoMode'] == "") {
           window.localStorage['demoMode'] =  true;
        }
    
     if(window.localStorage.getItem("proxycalls") == undefined || window.localStorage['proxycalls'] == "") {
        window.localStorage['proxycalls'] =  true;
    }
     
    vm.settings = {serverAddress: window.localStorage['baseurl'],
                       demoMode : JSON.parse(window.localStorage['demoMode']),
                      // proxycalls :JSON.parse(window.localStorage['proxycalls'])
                    };

    vm.onServerAddressChange = function () {
        window.localStorage['baseurl'] =  vm.settings.serverAddress;
        console.log('settings - serverAddress:' + window.localStorage['baseurl']);
    };

   //proxycalls 
     if(window.localStorage.getItem("proxycalls") == undefined || window.localStorage['proxycalls'] == "") {
        window.localStorage['proxycalls'] =  true;
    }
    vm.proxycalls = { checked : window.localStorage['proxycalls']};
    vm.proxycalls.checked = JSON.parse(window.localStorage['proxycalls']); 
    
    vm.onProxycallsChange = function () {
        window.localStorage['proxycalls'] = vm.proxycalls.checked;        
        console.log('settings - proxycall:' + window.localStorage['proxycalls']);
    };

     vm.onDemoModeChange = function () {
        window.localStorage['demoMode'] = vm.settings.demoMode;        
        console.log('settings - demoMode:' + window.localStorage['demoMode']);
    };
    
    /*
    //installation settings
    httpService.getHospitals().then(function(data) {
		   $scope.installations=data;
		});
   
    console.log(  $scope.installations );
    if($scope.installations != undefined)  {
        window.localStorage['installId'] =    $scope.installations[0].InstallId;
    }
    $scope.installId = window.localStorage['installId'];  
    $scope.onInstallIdChange = function () {
        window.localStorage['installId'] = $scope.installId;
        console.log( window.localStorage['installId']);
    };    
    */
})