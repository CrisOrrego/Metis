angular.module('PQRS__PQRSCtrl', [])
.controller('PQRS__PQRSCtrl', ['$scope', '$rootScope', 
	function($scope, $rootScope) {

		console.info('PQRS__PQRSCtrl');
		var Ctrl = $scope;
		var Rs = $rootScope;

		
		Ctrl.Hoy = moment().toDate();

		//var Desde = moment().add('-2', 'months').toDate();
		var Desde = moment('2018-01-01', 'YYYY-MM-DD').toDate();
		var Hasta = moment().toDate();

		var DefFilters = {
			Fecha_Radicado: [ Desde, Hasta ],
			Formato: false,
			
			Fecha_Respuesta: [ false, false ],
			Tipificacion: false,
			Subtipificacion: false,
			Canal: false,
			Favorabilidad: false,

			Tipo_Cre: false,
			Nombre: '',
			Nro_Credito: '',
			Descripcion: '',
		};

		Ctrl.Subtipificaciones = [
			'CONFIRMACIÓN PROCESO DE LEVANTAMIENTO DE PRENDA',
			'APLICACIÓN DE ABONO A REDUCE CUOTA',
			'SOLICITUD VALOR DE LA CUOTA MENSUAL A PAGAR',
			'SOLICITUD DEL SALDO TOTAL ADEUDADO',
			'SOLICITUD LEVANTAMIENTO DE PRENDA',
			'DETALLE DEL PAGO REALIZADO DE LA CUOTA MENSUAL - CONCEPTOS',
		];

		Ctrl.Canales = [
			'LLAMADA',
			'CORREO',
		];

		Ctrl.Favorabilidad = [
			'LA ENTIDAD',
			'DEL CLIENTE',
			'N/A'
		];


		//Obtener
		Ctrl.Headers = false;
		Ctrl.getRows = () => {
			Ctrl.Rows = [];
			Rs.http('api/PQRS', { 'filters' : Ctrl.filters }, Ctrl, 'Rows').then(() => {
				if(!Ctrl.Headers && Ctrl.Rows.length > 0){
					Ctrl.Headers = Object.keys(Ctrl.Rows[0]);
				};
			});
		};


		Ctrl.getRows();

		Ctrl.resetFilters = () => {
			Ctrl.filters = angular.copy(DefFilters);
		};
		Ctrl.resetFilters();

	}
]);