angular.module('CRUDDialogCtrl', [])
.controller('CRUDDialogCtrl', ['$rootScope', '$scope', '$mdDialog', 'ops', 'config', 'columns', 'Obj', 'rows', 
	function($rootScope, $scope, $mdDialog, ops, config, columns, Obj, rows) {

		console.info('CRUDDialogCtrl');
		var Ctrl = $scope;
		var Rs = $rootScope;

		Ctrl.config = {};
		Ctrl.columns = columns;
		Ctrl.Obj = {};
		//Ctrl.Obj = angular.copy(Obj);

		//Saber si es nuevo
		Ctrl.new = !(ops.primary_key in Obj);
		Ctrl.config.confirmText = Ctrl.new ? 'Crear' : 'Guardar';
		Ctrl.config.title = Ctrl.new ? ('Nuevo '+ops.name) : ('Editando '+ops.name);
		Ctrl.config.delete_title = '¿Borrar '+ops.name+'?';

		angular.forEach(columns, function(F){
			if(F.Default !== null){
				var DefValue = angular.copy(F.Default);
				Ctrl.Obj[F.Field] = DefValue;
			};

			F.show = true;
			if(config.only.length > 0){
				F.show = Rs.inArray(F.Field, config.only);
			};
		});

		angular.extend(Ctrl.Obj, Obj);
		angular.extend(Ctrl.config, config);

		Ctrl.cancel = function(){ $mdDialog.hide(false); };

		Ctrl.sendData = function(){
			//Verificar los Uniques
			var Errors = 0;
			angular.forEach(columns, function(C){
				if(C.Unique){
					var except = Ctrl.new ? false : [ ops.primary_key, Ctrl.Obj[ops.primary_key] ];
					var Found = Rs.found(Ctrl.Obj[C.Field], rows, C.Field, undefined, except );
					if(Found) Errors++;
				};
			});

			if(Errors > 0) return false;

			$mdDialog.hide(Ctrl.Obj);
		};


		Ctrl.delete = function(ev){
			var config = {
				Title: Ctrl.config.delete_title,
			};

			Rs.confirmDelete(config).then(function(del){
				if(del){
					$mdDialog.hide('DELETE');
				};
			});
		};


		
		//Campos
		//Ctrl.fields = angular.copy

	}
]);