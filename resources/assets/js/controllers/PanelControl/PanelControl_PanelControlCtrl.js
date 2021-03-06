angular.module('PanelControl_PanelControlCtrl', [])
.controller('PanelControl_PanelControlCtrl', ['$scope', '$rootScope', '$http', '$mdDialog',
	function($scope, $rootScope, $http, $mdDialog) {

		console.info('PanelControl_PanelControlCtrl');
		var Ctrl = $scope;
		var Rs = $rootScope;

		var Horas = [];
		var Minutos = [];
		for (var i = 0; i <= 23; i++) { Horas.push(i); };
		for (var i = 0; i <= 59; i++) { Minutos.push(i); };


		Ctrl.Hoy = moment().toDate();
		Ctrl.Filters = {
			Fecha: angular.copy(Ctrl.Hoy),
		};
		Ctrl.EstadosUsuario = {
			'Activo': 	 { Color: '#01a727' }, 
			'Baño': 	 { Color: '#d66702' },
			'Brake': 	 { Color: '#bb069a' },
			'Almuerzo':  { Color: '#bd9804' },
			'Validando': { Color: '#b3ff00' },
		};

		Ctrl.getControl = () => {
			Rs.http('api/Validaciones/control', { Filters: Ctrl.Filters }).then((r) => {
				Ctrl.ValidacionesControl = r[0];
				Ctrl.Hours = r[1];
				Ctrl.minStart = Ctrl.Hours[0]['hour'] * 60;
			});
		};
		Ctrl.getControl();
		


		//Informes
		Ctrl.infTiemposAtencion = () => {
			var Today = moment().toDate();
			Rs.BasicDialog({
				Title: 'Fechas',
				Flex: 20,
				Fields: [
					{ Nombre: 'Desde',  Value: angular.copy(Today), Required: true, Type: 'date' },
					{ Nombre: 'Hasta',  Value: angular.copy(Today), Required: true, Type: 'date' },
				],
				Confirm: { Text: 'Descargar' },
			}).then((r) => {
				Rs.http('api/Validaciones/inf-tiempos-atencion', { Filters: { Desde: r.Fields[0].Value, Hasta: r.Fields[1].Value } }).then((d) => {
					Rs.download(d, 'Informe Tiempos de Atención.csv');
				});
			});
		};


		Ctrl.infEstadoValidaciones = () => {
			
			var Today = moment().toDate();
			var Hora = moment().hour();
			var Minuto = moment().minute();

			Rs.BasicDialog({
				Title: 'Fecha y Hora',
				Flex: 20,
				Fields: [
					{ Nombre: 'Fecha',  Value: angular.copy(Today), Required: true, Type: 'date' },
					{ Nombre: 'Hora',   flex: 50, Value: Hora,   Required: true, Type: 'select', List: Horas },
					{ Nombre: 'Minuto', flex: 50, Value: Minuto, Required: true, Type: 'select', List: Minutos },
				],
				Confirm: { Text: 'Descargar' },
			}).then((r) => {
				Rs.http('api/Validaciones/inf-estado-validaciones', { Filters: { Fecha: r.Fields[0].Value, Hora: r.Fields[1].Value, Minuto: r.Fields[2].Value } }).then((d) => {
					Rs.download(d, 'Informe de Estado de Validaciones.csv');
				});
			});
		};




	}
]);