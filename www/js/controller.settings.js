angular.module('nix.controllers')
.controller('settingsCtrl', function($scope, httpService) {
    
    if(window.localStorage.getItem("baseurl") == undefined || window.localStorage['baseurl'] == "") {
          window.localStorage['baseurl'] =  'http://localhost:40405/';
        }
	
    $scope.serverAddress = window.localStorage['baseurl'];  
    $scope.onServerAddressChange = function () {
        window.localStorage['baseurl'] = $scope.serverAddress;
        $scope.installations = httpService.getHospitals();
        console.log(window.localStorage['baseurl'] );
        console.log(  $scope.installations );
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