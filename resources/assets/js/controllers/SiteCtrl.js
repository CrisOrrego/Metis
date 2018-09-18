angular.module('SiteCtrl', [])
.controller('SiteCtrl', ['$scope', '$rootScope', '$localStorage', '$state', 
	function($scope, $rootScope, $localStorage, $state) {

		console.info('SiteCtrl');
		var Ctrl = $scope;
		var Rs = $rootScope;

		Ctrl.goLogin = () => {

			if($localStorage.token){
				$state.go('Home');
			}else{
				$state.go('Login');
			};

		};



	}
]);