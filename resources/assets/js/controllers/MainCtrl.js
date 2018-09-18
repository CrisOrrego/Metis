angular.module('MainCtrl', [])
.controller('MainCtrl', ['$rootScope', 'appFunctions', '$localStorage', 
	function($rootScope, appFunctions, $localStorage) {

		console.info('MainCtrl');
		var Rs = $rootScope;
		Rs.Storage = $localStorage;

		Rs.$on("$stateChangeSuccess", Rs.stateChanged);
		Rs.stateChanged();
		//const PermLevels = { no: 0, see: 1, add: 2, edit: 3 };

		Rs.checkPerm = (opt, level) => {
			//console.log(Rs.Usuario, opt, level);
			if(!Rs.Usuario) return false;
			return Rs.Usuario.perfil.Config[opt] >= PermLevels[level];
		};

		//User Session
		Rs.changePassword = function(){
			Rs.BasicDialog({
				Title: 'Cambiar contraseña',
				Fields: [
					{ Nombre: 'Anterior',  Value: '', Required: true },
					{ Nombre: 'Nueva',  Value: '', Required: true },
					{ Nombre: 'Confirmar Nueva',  Value: '', Required: true }
				],
				Confirm: { Text: 'Cambiar' }
			}).then(function(r){
				var Ant  = r.Fields[0].Value;
				var New  = r.Fields[1].Value;
				var NewC = r.Fields[2].Value;

				if(New !== NewC) return Rs.showToast('La nueva contraseña no coincide, intente nuevamente', 'Error');

				Rs.http('api/Usuarios/cambiar-pass', { Anterior: Ant, Nueva: New }).then(function(r){
					Rs.showToast('Contraseña cambiada', 'Success');
				});
			});
		};

		Rs.Logout = function(){
			Rs.navTo('Login', {});
		};
		
		


		/*if(Rs.State.route.length == 2){
			Rs.navTo('Home.Section', { section: 'Cubos' });
		};*/

		
		//Configuración puntual
		

	}
]);