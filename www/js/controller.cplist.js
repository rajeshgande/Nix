angular.module('nix.controllers')
.controller('cplistCtrl', function($scope, $state, httpService, auth) {
	
	$scope.user = auth.getLoggedInUser();
	
	httpService.getAllCPs().then(function(data) {
		  $scope.cps=data;
		});
		
	console.log($scope.hospitals);
	
	$scope.logout = function() {
		 console.log("Logging Out ", $scope.user);
		 auth.logout( function(){$state.go('login')});	
	};
	
	 $scope.gotoItemEntry = function(cp) {         
        window.localStorage['omnisiteid'] = cp.OmniSiteId;
		$state.go('menu.cyclecount');
	};
})
