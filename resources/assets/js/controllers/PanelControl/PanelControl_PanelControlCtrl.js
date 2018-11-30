angular.module('PanelControl_PanelControlCtrl', [])
.controller('PanelControl_PanelControlCtrl', ['$scope', '$rootScope', '$http', '$mdDialog',
	function($scope, $rootScope, $http, $mdDialog) {

		console.info('PanelControl_PanelControlCtrl');
		var Ctrl = $scope;
		var Rs = $rootScope;

		Ctrl.Hoy = moment().toDate();
		Ctrl.Filters = {
			Fecha: angular.copy(Ctrl.Hoy),
		};
		Ctrl.EstadosUsuario = {
			'Activo': 	{ Color: '#01a727' }, 
			'Baño': 	{ Color: '#d66702' },
			'Brake': 	{ Color: '#bb069a' },
			'Almuerzo': { Color: '#bd9804' },
		};

		Ctrl.getControl = () => {
			Rs.http('api/Validaciones/control', { Filters: Ctrl.Filters }).then((r) => {
				Ctrl.ValidacionesControl = r[0];
				Ctrl.Hours = r[1];
				Ctrl.minStart = Ctrl.Hours[0]['hour'] * 60;
			});
		};
		Ctrl.getControl();
		
	}
]);