angular.module('ConfiguracionCtrl', [])
.controller('ConfiguracionCtrl', ['$scope', '$rootScope', '$http', '$mdDialog',
	function($scope, $rootScope, $http, $mdDialog) {

		console.info('ConfiguracionCtrl');
		var Ctrl = $scope;
		var Rs = $rootScope;
	
		Ctrl.Subsecciones = [
			{ Icon: 'fa-home', 		Titulo: 'General',  url: 'General' },
			{ Icon: 'fa-user', 		Titulo: 'Usuarios', url: 'Usuarios' },
			{ Icon: 'fa-id-card', 	Titulo: 'Perfiles', url: 'Perfiles' },
		];

		if(Rs.State.route.length < 4){
			Rs.navTo('Home.Section.Subsection', { subsection: Ctrl.Subsecciones[0].url })
		};

		//Generales
		Ctrl.saveOpts = function(){
			Rs.http('/api/Main/save-opts', { Opts: Rs.Opts });
		};



	}
]);