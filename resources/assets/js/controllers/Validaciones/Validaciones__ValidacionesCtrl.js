angular.module('Validaciones__ValidacionesCtrl', [])
.controller('Validaciones__ValidacionesCtrl', ['$scope', '$rootScope', '$http', '$mdDialog', '$injector',
	function($scope, $rootScope, $http, $mdDialog, $injector) {

		console.info('Validaciones__ValidacionesCtrl');
		var Ctrl = $scope;
		var Rs = $rootScope;
	
		Ctrl.Title = 'Titulo';
		Ctrl.Cancel = function(){ $mdDialog.cancel(); }

		Ctrl.EstadosUsuario = [
			{ Nombre: 'Activo', 	Color: '#01a727' }, 
			{ Nombre: 'Baño',      	Color: '#d66702' },
			{ Nombre: 'Brake',     	Color: '#bb069a' },
			{ Nombre: 'Almuerzo',  	Color: '#bd9804' },
		];

		Ctrl.EstadoUsuario = 'Activo';

		Ctrl.filterNavOpen = true;
		Ctrl.Hoy = moment().toDate();
		Ctrl.Desde = moment().add(-1, 'months').toDate();
		Ctrl.Hasta = angular.copy(Ctrl.Hoy);
		Ctrl.Estado = 'Pendientes';
		Ctrl.TipoCliente = 'Todos';
		Ctrl.CausalFilter = false;
		Ctrl.NumeroFilter = '';

		//Validaciones
		Ctrl.ValidacionesCRUD = $injector.get('CRUD').config({ 
			base_url: '/api/Validaciones',
			order_by: ['-id'],
			query_scopes: [ 
				[ 'usuario', Rs.Usuario.Id ],
				[ 'entre',   [] ],
				[ 'estado',  'Pendientes' ],
				[ 'causal',  false ],
			],
			add_append: 'refresh',
			limit: 1000
		});

		Ctrl.getValidaciones = () => {
			Ctrl.ValidacionesCRUD.setScope('entre', [ moment(Ctrl.Desde).format('YYYY-MM-DD'), Ctrl.Hasta ]);
			Ctrl.ValidacionesCRUD.setScope('estado', Ctrl.Estado );
			Ctrl.ValidacionesCRUD.setScope('tipocliente', Ctrl.TipoCliente );
			Ctrl.ValidacionesCRUD.setScope('causal', Ctrl.CausalFilter );
			Ctrl.ValidacionesCRUD.setScope('numero', Ctrl.NumeroFilter );
			Ctrl.ValidacionesCRUD.get();
		};

		Ctrl.validacionDiag = (Obj) => {
			$mdDialog.show({
				controller:  'Validaciones__ValidacionDiagCtrl',
				templateUrl: 'Frag/Validaciones.ValidacionDiag',
				locals: 	{ Validacion: Obj, Causales: Ctrl.Causales },
				clickOutsideToClose: false,
				escapeToClose: false,
				fullscreen:  true,
				multiple: 	 true
			}).then(() => {
				Ctrl.getValidaciones();
			});
		};

		Rs.http('api/Validaciones/causales', {}, Ctrl, 'Causales').then(() => {
			//Ctrl.validacionDiag(null);
			Ctrl.getValidaciones();
		});


		Ctrl.estadoUsuarioChange = () => {
			Rs.log('USUARIO.ESTADO', Ctrl.EstadoUsuario);
		};
		Ctrl.estadoUsuarioChange();
		

	}
]);