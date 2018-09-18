angular.module('ListSelectorCtrl', [])
.controller('ListSelectorCtrl', ['$scope', '$rootScope', '$http', '$mdDialog', 'List', 'Config',
	function($scope, $rootScope, $http, $mdDialog, List, Config) {

		//console.info('ListSelectorCtrl');
		var Ctrl = $scope;
		var Rs = $rootScope;
		Ctrl.Config = Config;
		Ctrl.Searching = false;

		Ctrl.Cancel = function(){ $mdDialog.cancel(); }

		Ctrl.getData = function(){
			Ctrl.Searching = true;
			//Traer los datos del servidor
			$http({
				method: Ctrl.Config.remoteMethod,
				url: Ctrl.Config.remoteUrl,
				data: Ctrl.Config.remoteData,
			}).then(function(r){
				Ctrl.Searching = false;
				Ctrl.List = r.data;
			}, function(){
				Ctrl.Searching = false;
			});
		};

		//Si pasan la lista usarla
		if(List !== null){
			Ctrl.List = List;
		}else if(Ctrl.Config.remoteUrl){
			Ctrl.getData();
		};

		Ctrl.changeSearch = function(){

			if(Ctrl.Config.remoteQuery){
				if(Ctrl.Searching) return false;
				Ctrl.Config.remoteData.filter = Ctrl.Search;
				Ctrl.getData();
			}else{
				Ctrl.SearchFilter = Ctrl.Search;
			}
		}

		Ctrl.Resp = function(Row){
			$mdDialog.hide(Row);
		}


	}
]);