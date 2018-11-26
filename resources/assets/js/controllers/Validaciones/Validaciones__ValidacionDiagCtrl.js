angular.module('Validaciones__ValidacionDiagCtrl', [])
.controller('Validaciones__ValidacionDiagCtrl', ['$scope', '$rootScope', '$http', '$mdDialog', '$filter', 'Validacion', 'Causales',
	function($scope, $rootScope, $http, $mdDialog, $filter, Validacion, Causales) {

		console.info('Validaciones__ValidacionDiagCtrl');
		var Ctrl = $scope;
		var Rs = $rootScope;
	
		Ctrl.Title = 'Nueva Validación';
		Ctrl.Cancel = function(){ $mdDialog.cancel(); }

		//Parámetros
		Ctrl.range = Rs.range;
		Ctrl.Val = {
			Numero: '',
			Estado: 'Pendiente',
			causal_id: null,
			TipoDoc: 'CC',
			Doc: '',
			FechaNacimiento: null,
			SeguroCuota: null,
			edad: 0,
			TipoVehiculo: 'Particular',
			FechaCifin: moment().toDate(),
			diascifin: 0,
		};
		Ctrl.IngresoHora = 0;
		Ctrl.IngresoMin = 0;
		Ctrl.TiposDoc = ['CC','NIT'];
		Ctrl.Hoy = moment().toDate();
		Ctrl.mimimumAge = moment().add(-18, 'years').toDate();
		Ctrl.new = true;
		Ctrl.Comentarios = [];
		Ctrl.newComment = '';
		Ctrl.seguroCuotaOps = {
			Si: 'SI TIENE, seguro de cuota',
			No: 'NO TIENE, seguro de cuota',
		};
		Ctrl.tiposVehiculos = {
			Particular: { Nombre: 'Particular',  DiasMaxCifin: 45 },
			Publico: {    Nombre: 'Público',     DiasMaxCifin: 60 },
		};
		Ctrl.estadosVal = {
			Pendiente: { color: 'bg-black-2' },
			Devuelta: { color: 'bg-red' },
			Avanzada: { color: 'bg-green' },
			Desembolsada: { color: 'bg-gold text-black' },
		}; 
		Ctrl.canMarkPendiente = true;
		Ctrl.canMarkDevuelta = true;
		Ctrl.canMarkAvanzada = true;
		Ctrl.canMarkDesembolsada = true;

		Ctrl.explodeIngresoDate = () => {
			var IngresoDate = moment(Ctrl.Val.Ingreso);
			Ctrl.IngresoHora = IngresoDate.hours();
			Ctrl.IngresoMin  = IngresoDate.minutes();
		};

		Ctrl.implodeIngresoDate = () => {
			var IngresoDate = moment(Ctrl.Val.Ingreso);
			IngresoDate.utc().hours(Ctrl.IngresoHora);
			IngresoDate.utc().minutes(Ctrl.IngresoMin);

			Ctrl.Val.Ingreso = IngresoDate.toDate();
		};

		Ctrl.calcEdad = () => {
			Ctrl.Val.edad = Ctrl.Val.FechaNacimiento ? moment().diff(moment(Ctrl.Val.FechaNacimiento), 'years', false) : 0;
			Ctrl.Val.SeguroCuota = (Ctrl.Val.edad > 69) ? 'Si' : null;

			Ctrl.verifier();
		};

		Ctrl.calcCifin = () => {
			Ctrl.Val.diascifin = moment().diff(moment(Ctrl.Val.FechaCifin), 'days', false) + 1;
			Ctrl.blockCifin = (Ctrl.Val.diascifin > Ctrl.tiposVehiculos[Ctrl.Val.TipoVehiculo]['DiasMaxCifin']);

			Ctrl.verifier();
		};

		Ctrl.verifier = () => {
			
			//Botones disponibles
			var canAdvance = (Ctrl.Val.SeguroCuota == null || Ctrl.Val.SeguroCuota == 'No') 
						  && (Ctrl.blockCifin == false)
						  && (Ctrl.Val.causal_id == null);
			Ctrl.canMarkAvanzada = canAdvance;
			Ctrl.canMarkDevuelta = (Ctrl.Val.causal_id !== null);
			Ctrl.canMarkDesembolsada = canAdvance && (Ctrl.Val.Estado == 'Avanzada');
		};


		
		Ctrl.searchCausales = (searchText) => {
			return $filter('filter')(Causales, searchText);
		};

		Ctrl.CausalSelChange = (CausalSel) => {
			Ctrl.Val.causal_id = (typeof CausalSel == 'undefined') ? null : CausalSel.id;
		};

		Ctrl.check = () => {
			if(Ctrl.Val.Numero.trim().length == 0){ Rs.showToast('Falta el número de solicitud', 'Error'); return false; }
			if(Ctrl.Val.Doc.trim().length == 0){ Rs.showToast('Falta documento del cliente', 'Error'); return false; }
			if(Ctrl.Val.TipoDoc == 'NIT'){
				Ctrl.Val.FechaNacimiento = null;
			}else{
				if(Ctrl.Val.FechaNacimiento == null){ Rs.showToast('Falta fecha de nacimiento del cliente', 'Error'); return false; }
			};

			return true;
		};



		Ctrl.mark = (Estado) => {
			var checked = Ctrl.check();
			if(!checked) return false;

			Rs.http('api/Validaciones/save', { Estado: Estado, Validacion: Ctrl.Val }).then(() => {
				$mdDialog.hide();
			});
		};

		Ctrl.terminate = (mode) => {
			Rs.Confirm({
				Titulo: '¿Marcar esta validación como '+mode+'?',
				Detail: 'Cerrar atención',
				Buttons: [
					{ Text: 'Terminar', Class: 'md-raised md-danger', Value: true }
				],
			}).then((confirmed) => {
				if(confirmed){
					Ctrl.mark(mode);
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

		Ctrl.$watchGroup([
			'Val.FechaNacimiento',
		], Ctrl.calcEdad);

		Ctrl.$watchGroup([
			'Val.FechaCifin',
			'Val.TipoVehiculo',
		], Ctrl.calcCifin);

		Ctrl.$watchGroup([
			'Val.SeguroCuota',
			'Val.causal_id',
		], Ctrl.verifier);

		//Si no es nuevo
		if(Validacion !== null){
			Ctrl.Val = angular.copy(Validacion);
			Ctrl.new = false;
			Ctrl.CausalSel = $filter('filter')(Causales, { id: Ctrl.Val.causal_id })[0];

			Rs.log('USUARIO.ESTADO', 'Validando', Ctrl.Val.id, Ctrl.Val.Estado).then(() => {
				Ctrl.explodeIngresoDate();
				Rs.http('api/Validaciones/comentarios', { validacion_id: Ctrl.Val.id }, Ctrl, 'Comentarios');
			});
			
		}else{
			Rs.http('api/Validaciones/create', { Validacion: Ctrl.Val }).then((r) => {
				Ctrl.Val = r;
				Ctrl.new = false;
				Ctrl.explodeIngresoDate();
			});
		};

	}
]);