angular.module('nix.controllers')
.controller('settingsCtrl', function($scope, httpService) {
  
    var vm = this;

    //serverAddress
    if(window.localStorage.getItem("baseurl") == undefined || window.localStorage['baseurl'] == "") {
           window.localStorage['baseurl'] =  'https://omninix.omnicellanalytics.com:40405';
    }

     vm.onServerAddressChange = function () {
        window.localStorage['baseurl'] =  vm.settings.serverAddress;
        console.log('settings - serverAddress:' + window.localStorage['baseurl']);
    };

   // demo mode
    if(window.localStorage.getItem("demoMode") == undefined || window.localStorage['demoMode'] == "") {
           window.localStorage['demoMode'] =  true;
    }
     
     vm.onDemoModeChange = function () {
        window.localStorage['demoMode'] = vm.settings.demoMode;        
        console.log('settings - demoMode:' + window.localStorage['demoMode']);
    };  
      
    vm.settings = {
                       serverAddress: window.localStorage['baseurl'],
                       demoMode : JSON.parse(window.localStorage['demoMode']),
                      // proxycalls :JSON.parse(window.localStorage['proxycalls'])
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


   
});