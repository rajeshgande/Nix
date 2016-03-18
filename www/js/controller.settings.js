angular.module('nix.controllers')
.controller('settingsCtrl', function($scope, httpService) {
    
    if(window.localStorage.getItem("baseurl") == undefined || window.localStorage['baseurl'] == "") {
           window.localStorage['baseurl'] =  'https://omninix.omnicellanalytics.com:40405';
        }
    $scope.serverAddress = window.localStorage['baseurl'];     
    $scope.onServerAddressChange = function () {
        window.localStorage['baseurl'] = $scope.serverAddress;
    };
    
    if(window.localStorage.getItem("proxycalls") == undefined || window.localStorage['proxycalls'] == "") {
        window.localStorage['proxycalls'] =  true;
    }
    $scope.proxycalls = { checked : window.localStorage['proxycalls']};
    $scope.proxycalls.checked = JSON.parse(window.localStorage['proxycalls']); 
    $scope.onProxycallsChange = function () {
        window.localStorage['proxycalls'] = $scope.proxycalls.checked;        
        console.log('settings - proxycall:' + window.localStorage['proxycalls']);
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