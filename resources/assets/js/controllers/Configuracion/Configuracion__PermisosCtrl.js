angular.module('Configuracion__PermisosCtrl', [])
.controller('Configuracion__PermisosCtrl', ['$scope', '$rootScope', '$http', '$mdDialog', '$injector',
	function($scope, $rootScope, $http, $mdDialog, $injector) {

		console.info('Configuracion__PermisosCtrl');
		var Ctrl = $scope;
		var Rs = $rootScope;
		
		Ctrl.Perfil = null;

		Ctrl.PerfilesCRUD = $injector.get('CRUD').config({   base_url: '/api/Usuarios/perfiles' });
		Ctrl.PerfilesCRUD.get().then(() => {
			//Ctrl.openPerfil(Ctrl.PerfilesCRUD.rows[0]);
		});

		Rs.http('/api/Cubos/servidores-cubos-paneles', {}, Ctrl, 'Servidores');
		Rs.http('/api/Informe/all', {}, Ctrl, 'Informes');

		var DefConfig = {
			'access_cubos': 			'N',
			'access_cubos_list': 		[],
			'level_cubos':				0,
			'level_paneles':			0,
			'level_informes':			0,
			'level_configuracion': 		0,
			'access_informes': 			'N',
			'access_informes_list':     [],
		};

		Ctrl.addPerfil = function(config){
			angular.extend(config, {
				title: 'Agregar Perfil',
			});
			Ctrl.PerfilesCRUD.dialog({}, config).then(function(newElm){
				if(!newElm) return false;
				Ctrl.PerfilesCRUD.add(newElm);
			});
		};

		Ctrl.openPerfil = function(P) {
			Ctrl.Perfil = P;
			Ctrl.Perfil.Config = angular.extend(DefConfig, Ctrl.Perfil.Config);

			//Marcar los Cubos
			if(Ctrl.Perfil.Config.access_cubos == 'A'){
				angular.forEach(Ctrl.Servidores, S => {
					angular.forEach(S.cubos, C => {
						if(Rs.inArray(C.id, Ctrl.Perfil.Config.access_cubos_list)) C.access = true;
					});
				});
			};

			//Marcar los Informes
			if(Ctrl.Perfil.Config.access_informes == 'A'){
				angular.forEach(Ctrl.Informes, I => {
					if(Rs.inArray(I.id, Ctrl.Perfil.Config.access_informes_list)) I.access = true;
				});
			};

		};

		Ctrl.savePerfil = function(){
			
			//Detalle de Cubos
			Ctrl.Perfil.Config.access_cubos_list = [];
			if(Ctrl.Perfil.Config.access_cubos == 'A'){
				angular.forEach(Ctrl.Servidores, S => {
					angular.forEach(S.cubos, C => {
						if(C.access) Ctrl.Perfil.Config.access_cubos_list.push(C.id);
					});
				});
			};

			//Detalle de Informes
			Ctrl.Perfil.Config.access_informes_list = [];
			if(Ctrl.Perfil.Config.access_informes == 'A'){
				angular.forEach(Ctrl.Informes, I => {
					if(I.access) Ctrl.Perfil.Config.access_informes_list.push(I.id);
				});
			};

			Ctrl.PerfilesCRUD.update(Ctrl.Perfil).then(() => {
				Rs.showToast('Perfil Actualizado', 'Success');
			});
		};

		Ctrl.AccessOptions = {
			'T': ['Todos','Todas'],
			'A': ['Algunos','Algunas'],
			'N': ['Ninguno','Ninguna'],
		};

		Ctrl.AccessLevels = [
			{ Level: 0, Desc: 'Sin Acceso' },
			{ Level: 1, Desc: 'Puede Ver' },
			//{ Level: 2, Desc: 'Puede Crear' },
			{ Level: 3, Desc: 'Puede Editar' }
		];
	}
]);