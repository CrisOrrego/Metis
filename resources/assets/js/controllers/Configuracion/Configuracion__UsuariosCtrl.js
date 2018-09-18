angular.module('Configuracion__UsuariosCtrl', [])
.controller('Configuracion__UsuariosCtrl', ['$scope', '$rootScope', '$http', '$mdDialog', '$injector',
	function($scope, $rootScope, $http, $mdDialog, $injector) {

		console.info('Configuracion__UsuariosCtrl');
		var Ctrl = $scope;
		var Rs = $rootScope;
	
		Ctrl.UsuariosCRUD = $injector.get('CRUD').config({   base_url: '/api/Usuarios/usuarios' });
		Ctrl.UsuariosCRUD.get();


		Ctrl.addUsuario = function(config){
			angular.extend(config, {
				title: 'Agregar Usuario',
			});
			Ctrl.UsuariosCRUD.dialog({}, config).then(function(newElm){
				if(!newElm) return false;
				Ctrl.UsuariosCRUD.add(newElm);
			});
		};

		Ctrl.editUsuario = function(U, config) {
			angular.extend(config, {
				title: 'Editar Usuario',
				delete_title: '¿Eliminar Usuario: '+U.Nombre+'?',
			});

			Ctrl.UsuariosCRUD.dialog(U, config).then(function(updatedElm){
				if(!updatedElm) return false;
				if(updatedElm == 'DELETE'){ 
					Ctrl.UsuariosCRUD.delete(U); 
					return false;
				}
				Ctrl.UsuariosCRUD.update(updatedElm);
			});
		};

	}
]);