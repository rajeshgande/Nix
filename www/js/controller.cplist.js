angular.module('nix.controllers')
.controller('cplistCtrl', function($scope, $state, httpService, auth) {	
    
	$scope.user = auth.getLoggedInUser();
	
	httpService.getAllCPs().then(function(data) {
		  $scope.cps=data;
		});
			
	 $scope.gotoCycleCount = function(cp) {  
        console.log('go to cycle count screen');
        window.localStorage['omnisiteid'] = cp.OmniSiteId;
        window.localStorage['omniIpAddress'] = cp.IpAddress;        
		$state.go('menu.cyclecount');
	};
})
