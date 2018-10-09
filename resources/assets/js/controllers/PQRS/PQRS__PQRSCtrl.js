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

		Ctrl.downloadUrl = false;

		Ctrl.query = {
			limit: 20,
			page: 1,
		};

		Ctrl.limitOps = [ 20, 50, 100 ];

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
		Ctrl.firstLoad = false;

		Ctrl.getRows = (reset) => {
			if(Ctrl.loading) return;

			Ctrl.firstLoad = true;

			if(reset){
				Ctrl.query.page = 1;
				Ctrl.downloadUrl = false;
			};

			//Ctrl.Rows = false;
			Ctrl.loading = true;
			Rs.http('api/PQRS', { 'filters' : Ctrl.filters, 'query': Ctrl.query }, Ctrl, 'Rows').then(() => {
				if(!Ctrl.Headers && Ctrl.Rows.data.length > 0){
					Ctrl.Headers = Object.keys(Ctrl.Rows.data[0]);
					//Ctrl.downloadCSV();
				};

				Ctrl.loading  = false;
			});
		};

		Ctrl.prepPag = (page, limit) => {
			Ctrl.getRows(false);
		};


		//Ctrl.getRows();

		Ctrl.resetFilters = () => {
			//Ctrl.firstLoad = false;
			Ctrl.filters = angular.copy(DefFilters);
		};
		Ctrl.resetFilters();


		Ctrl.creatingCSV = false;
		Ctrl.downloadCSV = () => {
			if(Ctrl.creatingCSV) return;

			Ctrl.creatingCSV = true;
			Rs.http('api/PQRS/create-csv', { 'filters' : Ctrl.filters, 'query': Ctrl.query }).then((d) => {
				console.log(d);
				Ctrl.downloadUrl = d;
				Ctrl.creatingCSV = false;
			});

		};

		//Ctrl.getRows(true);


	}
]);