angular.module('ConfirmDeleteCtrl', [])
.controller(   'ConfirmDeleteCtrl', ['$scope', 'Config', '$mdDialog', 
	function ($scope, Config, $mdDialog) {

		var Ctrl = $scope;

		Ctrl.Config = Config;

		Ctrl.Cancel = function(){
			$mdDialog.hide(false);
		}

		Ctrl.Delete = function(){
			$mdDialog.hide(true);
		}
		
	}

]);