angular.module('Configuracion__PerfilesCtrl', [])
.controller('Configuracion__PerfilesCtrl', ['$scope', '$rootScope', '$http', '$mdDialog', '$injector',
	function($scope, $rootScope, $http, $mdDialog, $injector) {

		console.info('Configuracion__PerfilesCtrl');
		var Ctrl = $scope;
		var Rs = $rootScope;
	
		Ctrl.PerfilesCRUD = $injector.get('CRUD').config({   base_url: '/api/Usuarios/perfiles' });
		Ctrl.PerfilesCRUD.get();

		Rs.http('/api/Usuarios/apps', {}, Ctrl, 'Apps');

		Ctrl.Niveles = {
			0: { Icono: 'fa-ban', Nombre: 'Sin Acceso' },
			10: { Icono: 'fa-eye', Nombre: 'Solo Lectura' },
			20: { Icono: 'fa-plus', Nombre: 'Puede Agregar' },
			30: { Icono: 'fa-pencil', Nombre: 'Puede Editar' },
			50: { Icono: 'fa-globe', Nombre: 'Control Total' },
		};

		Ctrl.addPerfil = function(config){
			angular.extend(config, {
				title: 'Agregar Perfil',
				only: ['Titulo']
			});
			Ctrl.PerfilesCRUD.dialog({}, config).then(function(newElm){
				if(!newElm) return false;
				Ctrl.PerfilesCRUD.add(newElm);
			});
		};

		Ctrl.editPerfil = function(U, config) {
			angular.extend(config, {
				title: 'Editar Perfil',
				delete_title: '¿Eliminar Perfil: '+U.Titulo+'?',
				with_delete: false
			});

			Ctrl.PerfilesCRUD.dialog(U, config).then(function(updatedElm){
				if(!updatedElm) return false;
				if(updatedElm == 'DELETE'){ 
					Ctrl.PerfilesCRUD.delete(U); 
					return false;
				}
				Ctrl.PerfilesCRUD.update(updatedElm);
			});
		};

		Ctrl.PerfilSel = null;
		Ctrl.openPerfil = (P) => {

			Ctrl.PerfilSel = P;
			if(!Ctrl.PerfilSel.Config){ 
				Ctrl.PerfilSel.Config = {};
				angular.forEach(Ctrl.Apps, (S,kS) => {
					Ctrl.PerfilSel.Config[kS] = 0;
				});
				Ctrl.savePerfil();
			};
		};


		Ctrl.savePerfil = () => {
			Ctrl.PerfilesCRUD.update(Ctrl.PerfilSel).then(() => {
				Rs.showToast('Perfil Actualizado', 'Success');
			});
		};

	}
]);