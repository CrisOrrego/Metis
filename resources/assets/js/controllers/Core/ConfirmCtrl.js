angular.module('ConfirmCtrl', [])
.controller(   'ConfirmCtrl', ['$scope', 'Config', '$mdDialog', 
	function ($scope, Config, $mdDialog) {

		var Ctrl = $scope;

		Ctrl.Config = Config;

		Ctrl.Cancel = function(){
			$mdDialog.cancel();
		}

		Ctrl.Send = function(val){
			$mdDialog.hide(val);
		}
		
	}

]);