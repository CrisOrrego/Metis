angular.module('Validaciones__ValidacionDiagCtrl', [])
.controller('Validaciones__ValidacionDiagCtrl', ['$scope', '$rootScope', '$http', '$mdDialog', '$filter', 'Validacion', 'Causales',
	function($scope, $rootScope, $http, $mdDialog, $filter, Validacion, Causales) {

		console.info('Validaciones__ValidacionDiagCtrl');
		var Ctrl = $scope;
		var Rs = $rootScope;
	
		Ctrl.Title = 'Nueva Validación';
		Ctrl.Cancel = function(){ $mdDialog.cancel(); }

		Ctrl.TiposDoc = ['CC','NIT'];
		//Ctrl.Hoy = moment().toDate();
		Ctrl.mimimumAge = moment().add(-18, 'years').toDate();
		Ctrl.new = true;
		Ctrl.clienteSearched = false;
		Ctrl.comentariosLoaded = false;
		Ctrl.Comentarios = [];
		Ctrl.newComment = '';


		Ctrl.getEdad = () => {
			Ctrl.Cliente.edad = moment().diff(moment(Ctrl.Cliente.FechaNacimiento), 'years', false);
		};

		Ctrl.Val = {
			causal_id: null,
		};

		Ctrl.Cliente = {
			id: null,
			TipoDoc: 'CC',
			Doc: '',
			Nombre: '',
			FechaNacimiento: null,
			edad: 0,
		};

		Ctrl.searchCliente = () => {
			Rs.http('api/Validaciones/search-cliente', Ctrl.Cliente).then((r) => {
				if(r == 'Not Found'){
					Rs.showToast('Cliente no encontrado, favor crear', 'Error');
				}else{
					Ctrl.Cliente = r;
					Ctrl.getEdad();
				};
				Ctrl.clienteSearched = true;
			});
		};

		Ctrl.searchCausales = (searchText) => {
			return $filter('filter')(Causales, searchText);
		};

		Ctrl.CausalSelChange = (CausalSel) => {
			if(typeof CausalSel == 'undefined'){
				Ctrl.Val.causal_id = null;
			}else{
				Ctrl.Val.causal_id = CausalSel.id;
			}
		};

		Ctrl.check = () => {
			if(Ctrl.Cliente.Doc.length == 0){ Rs.showToast('Falta documento del cliente', 'Error'); return false; }
			if(Ctrl.Cliente.Nombre.length == 0){ Rs.showToast('Falta nombre del cliente', 'Error'); return false; }
			if(Ctrl.Cliente.TipoDoc == 'NIT'){
				Ctrl.Cliente.FechaNacimiento = null;
			}else{
				if(Ctrl.Cliente.FechaNacimiento == null){ Rs.showToast('Falta fecha de nacimiento del cliente', 'Error'); return false; }
			}
			if(Ctrl.Val.causal_id == null){ Rs.showToast('Falta la causal', 'Error'); return false; }

			return true;
		};

		Ctrl.create = () => {
			var checked = Ctrl.check();
			if(!checked) return false;

			Rs.http('api/Validaciones/create', { Validacion: Ctrl.Val, Cliente: Ctrl.Cliente }).then((r) => {
				Ctrl.Val = r[0];
				Ctrl.Cliente = r[1];

				Rs.showToast('Validación Creada', 'Success');
				Ctrl.new = false;
				Ctrl.comentariosLoaded = true;
			});
		};


		Ctrl.save = (mode) => {
			var checked = Ctrl.check();
			if(!checked) return false;

			Rs.http('api/Validaciones/save', { mode: mode, Validacion: Ctrl.Val, Cliente: Ctrl.Cliente }).then((r) => {
				$mdDialog.hide();
			});
		};

		Ctrl.terminate = (mode) => {
			Rs.Confirm({
				Titulo: '¿Terminar esta validación como '+mode+'?',
				Detail: 'Cerrar atención',
				Buttons: [
					{ Text: 'Terminar', Class: 'md-raised md-danger', Value: true }
				],
			}).then((confirmed) => {
				if(confirmed){
					Ctrl.save(mode);
				};
			});
		}


		//Comentarios
		Ctrl.addComment = () => {
			var newComment = Ctrl.newComment.trim();
			if(newComment.length == 0) return;

			Rs.http('api/Validaciones/add-comentario', { Validacion: Ctrl.Val, newComment: newComment }).then((c) => {
				Ctrl.Comentarios.unshift(c);
				Ctrl.newComment = '';
			});
		};


		//Si no es nuevo
		if(Validacion !== null){
			Ctrl.Val = angular.copy(Validacion);
			Ctrl.Cliente = angular.copy(Validacion.cliente);
			Ctrl.new = false;
			Ctrl.clienteSearched = true;
			Ctrl.CausalSel = $filter('filter')(Causales, { id: Ctrl.Val.causal_id })[0];

			Rs.http('api/Validaciones/comentarios', { validacion_id: Ctrl.Val.id }, Ctrl, 'Comentarios').then(() => {
				Ctrl.comentariosLoaded = true;
			});
		};

	}
]);