angular.module('BasicDialogCtrl', [])
.controller(   'BasicDialogCtrl', ['$scope', 'Config', '$mdDialog', 
	function ($scope, Config, $mdDialog) {

		var Ctrl = $scope;

		Ctrl.Config = Config;

		Ctrl.Cancel = function(){
			$mdDialog.hide();
		}

		Ctrl.SendData = function(){
			$mdDialog.hide(Ctrl.Config);
		}

		Ctrl.Delete = function(ev) {
			if(Config.HasDelete){
				Config.HasDeleteConf = true;

				Ctrl.SendData();
			}
		}
	}

]);