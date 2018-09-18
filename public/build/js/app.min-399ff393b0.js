angular.module('LoginCtrl', [])
.controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$localStorage', '$mdToast', '$state', 
	function($scope, $rootScope, $http, $localStorage, $mdToast, $state) {

		console.info('LoginCtrl');
		var Ctrl = $scope;
		var Rs = $rootScope;
	
		delete $localStorage.token;

		Ctrl.User = '';
		Ctrl.Pass = '';

		Ctrl.ShowErr = function(Msg, Delay){
			var errTxt = '<md-toast class="md-toast-error"><span flex>' + Msg + '<span></md-toast>';
			$mdToast.show({
				template: errTxt,
				hideDelay: Delay
			});
		}

		Ctrl.Login = function(){
			$http.post('api/Usuarios/login', { User: Ctrl.User, Pass: Ctrl.Pass }).then(function(r){
				var token = r.data;
				$localStorage.token = token;
				$state.go('Home.Section', { section: 'Encuestas' });
				
			}, function(r){
				Ctrl.ShowErr(r.data.Msg); 
				Ctrl.Pass = '';
			});
		};
	}
]);
angular.module('MainCtrl', [])
.controller('MainCtrl', ['$rootScope', 'appFunctions', '$localStorage', 
	function($rootScope, appFunctions, $localStorage) {

		//console.info('MainCtrl');
		var Rs = $rootScope;
		Rs.Storage = $localStorage;

		//Navigation
		Rs.Sections = {
			Cubos:			{ No: 0, Icono: 'fa-cube',		 	Nombre: 'Cubos' 	},
			Paneles:		{ No: 1, Icono: 'fa-bar-chart', 	Nombre: 'Paneles' },
			Informes:		{ No: 2, Icono: 'fa-newspaper-o', 	Nombre: 'Informes' },
			//Alertas:		{ No: 3, Icono: 'fa-bell',		 	Nombre: 'Alertas'  },
			Configuracion:	{ No: 4, Icono: 'fa-cog',		 	Nombre: 'Configuración'  },
		};

		Rs.$on("$stateChangeSuccess", Rs.stateChanged);
		Rs.stateChanged();



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
		
		


		if(Rs.State.route.length == 2){
			Rs.navTo('Home.Section', { section: 'Cubos' });
		};

		
		//Configuración puntual
		Rs.TiposPanel = {
			Table:     { Nombre: 'Tabla Simple', 			Icon: 'fa-table'					},
			DataTable: { Nombre: 'Tabla de Análisis', 		Icon: 'fa-columns'					},
			DataValue: { Nombre: 'Valor Resumen', 			Icon: 'fa-hashtag'					},
			
			PieChart:  { Nombre: 'Gráfico de Torta', 		Icon: 'fa-pie-chart'				},
			ColChart:  { Nombre: 'Gráfico de Columnas', 	Icon: 'fa-bar-chart'				},
			BarChart:  { Nombre: 'Gráfico de Barras', 		Icon: 'fa-bar-chart fa-rotate-90' },
			//LineChart: { Nombre: 'Gráfico de Líneas', 	Icon: 'fa-line-chart'				},
		};
		

	}
]);
angular.module('BasicDialogCtrl', [])
.controller(   'BasicDialogCtrl', ['$scope', 'Config', '$mdDialog', 
	function ($scope, Config, $mdDialog) {

		var Ctrl = $scope;

		Ctrl.Config = Config;

		Ctrl.Cancel = function(){
			$mdDialog.hide();
		}

		Ctrl.SendData = function(){
			$mdDialog.hide(Ctrl.Config);
		}

		Ctrl.Delete = function(ev) {
			if(Config.HasDelete){
				Config.HasDeleteConf = true;

				Ctrl.SendData();
			}
		}
	}

]);
angular.module('BottomSheetCtrl', [])
.controller('BottomSheetCtrl', ['$scope', '$rootScope', '$mdBottomSheet', 'Config', 
	function($scope, $rootScope, $mdBottomSheet, Config) {

		var Ctrl = $scope;
		var Rs = $rootScope;
	
		Ctrl.Cancel = function(){ $mdBottomSheet.cancel(); }

		Ctrl.Config = angular.copy(Config);

		Ctrl.Send = function(Item){
			$mdBottomSheet.hide(Item);
		}
	}
]);
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
angular.module('ConfirmCtrl', [])
.controller(   'ConfirmCtrl', ['$scope', 'Config', '$mdDialog', 
	function ($scope, Config, $mdDialog) {

		var Ctrl = $scope;

		Ctrl.Config = Config;

		Ctrl.Cancel = function(){
			$mdDialog.cancel();
		}

		Ctrl.Send = function(val){
			$mdDialog.hide(val);
		}
		
	}

]);
angular.module('ConfirmDeleteCtrl', [])
.controller(   'ConfirmDeleteCtrl', ['$scope', 'Config', '$mdDialog', 
	function ($scope, Config, $mdDialog) {

		var Ctrl = $scope;

		Ctrl.Config = Config;

		Ctrl.Cancel = function(){
			$mdDialog.hide(false);
		}

		Ctrl.Delete = function(){
			$mdDialog.hide(true);
		}
		
	}

]);
angular.module('Core__ImageEditor_DialogCtrl', [])
.controller(   'Core__ImageEditor_DialogCtrl', ['$scope', '$rootScope', '$mdDialog', '$mdToast', '$timeout', '$http', 'Upload', 'Config', 
	function ($scope, $rootScope, $mdDialog, $mdToast, $timeout, $http, Upload, Config) {

		var Ctrl = $scope;
		var Rs = $rootScope;

		//console.info('-> Image Editor');

		Ctrl.Config = {
			Theme : 'Snow_White',		//El tema
			Title: 'Cambiar Imágen',	//El Titulo
			CanvasWidth:  350,			//Ancho del canvas
			CanvasHeight: 350,			//Alto del canvas
			CropWidth:  100,			//Ancho del recorte que se subirá
			CropHeight: 100,			//Alto del recorte que se subirá
			MinWidth:  50,				//Ancho mínimo del selector
			MinHeight: 50,				//Ancho mínimo del selector
			KeepAspect: true,			//Mantener aspecto
			Preview: false,				//Mostrar vista previa
			PreviewClass: '',			//md-img-round
			RemoveOpt: false,			//Si es texto muestra la opcion de borrar
			Daten: null					//La data a enviar al servidor
		};

		Ctrl.RotationCanvas = document.createElement("canvas");

		Ctrl.cropper = {};
		Ctrl.cropper.sourceImage = null;
		Ctrl.cropper.croppedImage = null;
		Ctrl.bounds = {};

		Ctrl.Progress = null;

		angular.extend(Ctrl.Config, Config);

		Ctrl.CancelText = Ctrl.Config.RemoveOpt ? Ctrl.Config.RemoveOpt : 'Cancelar';
		
		Ctrl.CancelBtn = function(){
			if(!Ctrl.Config.RemoveOpt){
				Ctrl.Cancel();
			}else{
				$http.post('/api/Upload/remove', { Path: Ctrl.Config.Daten.Path }).then(function(){
					$mdDialog.hide({Removed: true});
				});
			}
		}

		Ctrl.Cancel = function(){
			$mdDialog.hide();
		}

		Ctrl.Rotar = function(dir){
			var canvas = Ctrl.RotationCanvas;
			var ctx = canvas.getContext("2d");

			var image = new Image();
			image.src = Ctrl.cropper.sourceImage;
			image.onload = function() {
				canvas.width = image.height;
				canvas.height = image.width;
				ctx.rotate(dir * Math.PI / 180);
				ctx.translate(0, -canvas.width);
				ctx.drawImage(image, 0, 0); 
				Ctrl.cropper.sourceImage = canvas.toDataURL();
			};
		}

		Ctrl.$watch('Ctrl.cropper.sourceImage', function(nv, ov){
			if(nv){
				console.log('Imagen Cargada');
			}
		});

		Ctrl.SendImage = function(){

			var Daten = {
				file: Upload.dataUrltoBlob(Ctrl.cropper.croppedImage),
				Quality: 90
			};

			angular.extend(Daten, Config.Daten);

			Upload.upload({

				url: '/api/Upload/img',
				data: Daten,

			}).then(function (res) {
				
				$timeout(function () {
					$mdDialog.hide(res.data);
				});

			}, function (response) {
				if (response.status > 0){
					
					var Msg = response.status + ': ' + response.data;
					var errTxt = '<md-toast class="md-toast-error"><span flex>' + Msg + '<span></md-toast>';

					$mdToast.show({
						template: errTxt,
						hideDelay: 5000
					});

				}
			}, function (evt) {
				Ctrl.Progress = parseInt(100.0 * evt.loaded / evt.total);
			});

		}

		//console.log(angular.element(document.querySelector('#Canvas')));
	}

]);
angular.module('ImportCtrl', [])
.controller('ImportCtrl', ['$scope', '$rootScope', '$http', '$mdDialog', 'Upload', 'Config',
	function($scope, $rootScope, $http, $mdDialog, Upload, Config) {

		console.info('ImportCtrl');
		var Ctrl = $scope;
		var Rs = $rootScope;
		var DefConfig = {
			Paso: 1,
		};
		Ctrl.Config = Config;

		Ctrl.Cancel = function(){ $mdDialog.cancel(); }

		Ctrl.Pasos = [ '',
			'Paso 1: Diligenciar la plantilla',
			'Paso 2: Verificar datos a importar',
			'Paso 3: Importando',
			'Finalizado',
			'Errores encontrados',
			'Error al cargar el archivo'
		];

		Ctrl.Config.Paso = 1;

		Ctrl.DownloadPlantilla = function(){
			$http.get(Ctrl.Config.PlantillaUrl, { responseType: 'arraybuffer' }).then(function(r) {
        		var blob = new Blob([r.data], { type: "application/vnd.ms-excel; charset=UTF-8" });
		        var filename = Ctrl.Config.PlantillaUrl.split('/').pop();
		        saveAs(blob, filename);
        	});
		};


		Ctrl.UploadTemplate = function(file, invalidfile){
			if(file) {
	            Upload.upload({
					url: '/api/Upload/file',
					data: {
						file: file,
						Path: Ctrl.Config.Upload.Path,
						Name: Ctrl.Config.Upload.Name,
					}
				}).then(function(r){
					if(r.status == 200){
						Ctrl.VerifyData();
					}else{
						Ctrl.Config.Paso = 6;
					};
				});
			};
		};

		Ctrl.VerifyData = function(){
			Ctrl.Config.Paso = 2;
			$http.post(Ctrl.Config.VerifyUrl, { Config: Ctrl.Config }).then(function(r){
				var Msgs = r.data;
				console.log(Msgs);
				if(Msgs.length == 0){
					Ctrl.Config.Paso = 3;
				}else{ //Hubo errores en la verificacion
					Ctrl.Config.Paso = 5;
					Ctrl.Errores = Msgs;
				}
			});
		}

		//Ctrl.VerifyData();

		Ctrl.DownloadErrors = function(){
			var Headers = [ 'Fila', 'Error' ];
			var e = {
        		filename: 'Errores_Importacion',
        		ext: 'xls',
        		sheets: [
        			{
						name: 'Errores',
						headers: Headers,
						rows: Ctrl.Errores,
					}
        		]
			};
			Rs.DownloadExcel(e);
		};

		//console.log(Ctrl.Config.PlantillaUrl);

	}
]);
angular.module('ListSelectorCtrl', [])
.controller('ListSelectorCtrl', ['$scope', '$rootScope', '$http', '$mdDialog', 'List', 'Config',
	function($scope, $rootScope, $http, $mdDialog, List, Config) {

		//console.info('ListSelectorCtrl');
		var Ctrl = $scope;
		var Rs = $rootScope;
		Ctrl.Config = Config;
		Ctrl.Searching = false;

		Ctrl.Cancel = function(){ $mdDialog.cancel(); }

		Ctrl.getData = function(){
			Ctrl.Searching = true;
			//Traer los datos del servidor
			$http({
				method: Ctrl.Config.remoteMethod,
				url: Ctrl.Config.remoteUrl,
				data: Ctrl.Config.remoteData,
			}).then(function(r){
				Ctrl.Searching = false;
				Ctrl.List = r.data;
			}, function(){
				Ctrl.Searching = false;
			});
		};

		//Si pasan la lista usarla
		if(List !== null){
			Ctrl.List = List;
		}else if(Ctrl.Config.remoteUrl){
			Ctrl.getData();
		};

		Ctrl.changeSearch = function(){

			if(Ctrl.Config.remoteQuery){
				if(Ctrl.Searching) return false;
				Ctrl.Config.remoteData.filter = Ctrl.Search;
				Ctrl.getData();
			}else{
				Ctrl.SearchFilter = Ctrl.Search;
			}
		}

		Ctrl.Resp = function(Row){
			$mdDialog.hide(Row);
		}


	}
]);
angular.module('Cubo_TestDialogCtrl', [])
.controller('Cubo_TestDialogCtrl', ['$scope', '$rootScope', '$http', '$mdDialog', 'Cubo', 
	function($scope, $rootScope, $http, $mdDialog, Cubo) {

		var Ctrl = $scope;
		var Rs = $rootScope;

		Ctrl.Cubo = angular.copy(Cubo);
		Ctrl.limit = 10;
		Ctrl.limitOps = {
			10: 	'Mostrar 10',
			100: 	'Mostrar 100',
			500: 	'Mostrar 500',
			1000: 	'Mostrar 1000',
			2000: 	'Mostrar 2000',
		};

		Ctrl.Cancel = function(){ $mdDialog.cancel(); }

		Ctrl.getValues = function() {
			return Rs.http('api/Cubos/filtros-values', { Cubo: Cubo }).then(function(f){
				Ctrl.Cubo.Filtros = f;
				Ctrl.getData();
			});	
		};

		Ctrl.getData = function(){
			Ctrl.Data = null;
			return Rs.http('api/Cubos/test-data', { Cubo: Ctrl.Cubo, limit: Ctrl.limit }, Ctrl, 'Data');
		};

		Ctrl.getValues();

		Ctrl.getColumns = function(){
			Cubo.Columnas = Ctrl.Data.Columns;
			$mdDialog.hide();
		};

	}
]);
angular.module('CubosCtrl', [])
.controller('CubosCtrl', ['$scope', '$rootScope', '$injector', '$mdDialog', 
	function($scope, $rootScope, $injector, $mdDialog) {

		//console.info('CubosCtrl');
		var Ctrl = $scope;
		var Rs = $rootScope;

		Ctrl.ServidoresCRUD = $injector.get('CRUD').config({ base_url: '/api/Cubos/servidores' });
		Ctrl.CubosCRUD		= $injector.get('CRUD').config({ base_url: '/api/Cubos/cubos' });

		Ctrl.openServidor = function(S){
			Ctrl.ServidorSel = S;
			Ctrl.CuboSel = null;
			Ctrl.CubosCRUD.where(['servidor_id', '=', S.id]).get(['Nombre']).then(function(){
				//Ctrl.openCubo(Ctrl.CubosCRUD.rows[0]);
			});
		};

		Ctrl.addServidor = function(config){
			angular.extend(config, {
				title: 'Agregar Conexión',
			});
			Ctrl.ServidoresCRUD.dialog({}, config).then(function(newElm){
				if(!newElm) return false;
				Ctrl.ServidoresCRUD.add(newElm);
			});
		};

		Ctrl.testServidor = function(Servidor){
			Rs.http('/api/Cubos/test-servidor', { Servidor: Servidor }).then(function(r){
				Rs.showToast('Conexión exitosa', 'Success');
			});
		};

		Ctrl.editServidor = function(S, config) {
			angular.extend(config, {
				title: 'Editar Conexión',
				delete_title: '¿Eliminar Conexión: '+S.Nombre+'?',
				buttons: [
					{ text: 'Probar', fn: Ctrl.testServidor }
				]
			});

			Ctrl.ServidoresCRUD.dialog(S, config).then(function(updatedElm){
				if(!updatedElm) return false;
				if(updatedElm == 'DELETE'){ 
					Ctrl.ServidoresCRUD.delete(S); 
					Ctrl.ServidorSel = null; 
					Ctrl.CuboSel = null; 
					return false;
				}
				Ctrl.ServidoresCRUD.update(updatedElm);
			});
		};

		Ctrl.openCubo = function(C){
			Ctrl.CubosCRUD.find(C.id, Ctrl, 'CuboSel').then(function(){
				//Ctrl.testCube();
			});
		};

		Ctrl.addCubo = function(){
			Ctrl.CubosCRUD.dialog({
				servidor_id: Ctrl.ServidorSel.id,
				Filtros: [],
				Columnas: [],
			}, {
				only: [ 'Nombre' ]
			}).then(function(newElm){
				if(!newElm) return false;
				Ctrl.CubosCRUD.add(newElm);
			});
		};

		Ctrl.saveCubo = function(){
			Ctrl.CubosCRUD.update(Ctrl.CuboSel).then(function(){
				Rs.showToast('Cubo Actualizado', 'Success');
				console.log(Ctrl.CuboForm);
			});
		};

		Ctrl.deleteCubo = function(ev){
			Rs.confirmDelete({
				Title: '¿Borrar Cubo?',
			}).then(function(del){
				if(del){
					Ctrl.CubosCRUD.delete(Ctrl.CuboSel).then(function(){
						Ctrl.CuboSel = null;
						Rs.showToast('Cubo Eliminado', 'Error');
					});
				}
			});
		};


		Ctrl.ServidoresCRUD.get().then(function(){
			Ctrl.openServidor(Ctrl.ServidoresCRUD.rows[0]);
		});



		//Cubo Details
		Ctrl.getFilter = function(type){
			if(type == 'Fecha')  return { Defecto: 'today', Op1: 'Y-m-d', Op2: null,  Op3: null };
			if(type == 'Lista')  return { Defecto: '', 	    Op1: [],       Op2: null,  Op3: null };
			if(type == 'Texto')  return { Defecto: '', 	    Op1: null,     Op2: null,  Op3: null };
			if(type == 'Numero') return { Defecto: null,    Op1: null,     Op2: null,   Op3: null };
		};


		Ctrl.addFiltro = function(type){
			var Cant = Ctrl.CuboSel.Filtros.length;
			var DefObj = Ctrl.getFilter(type);

			angular.extend(DefObj, {
				Nombre: 'Filtro '+(Cant+1),
				Tipo: type,
			});

			Ctrl.CuboSel.Filtros.push(DefObj);
		};

		Ctrl.changeFiltro = function(k, type){
			var DefObj = Ctrl.getFilter(type);
			angular.extend(Ctrl.CuboSel.Filtros[k], DefObj);
		};

		Ctrl.deleteFiltro = function(k){
			Ctrl.CuboSel.Filtros.splice(k,1);
		};

		Ctrl.FiltrosTipos = [ 'Fecha', 'Lista', 'Texto', 'Numero' ];

		Ctrl.FechaDefaults = [
			{ Nombre: 'Primer dia del año pasado', 		Valor: 'first day of january last year' },
			{ Nombre: 'Primer dia de este año', 		Valor: 'first day of january this year' },
			{ Nombre: 'Hace 3 meses', 					Valor: '-3 month' },
			{ Nombre: 'Primer día del mes antepasado', 	Valor: 'first day of this month - 2 month' },
			{ Nombre: 'El mes antepasado', 				Valor: '-2 month' },
			{ Nombre: 'Primer día del mes pasado', 		Valor: 'first day of last month' },
			{ Nombre: 'El mes pasado', 					Valor: '-1 month' },
			{ Nombre: 'Primer día de este mes', 		Valor: 'first day of this month' },
			{ Nombre: 'Primer día de esta semana', 		Valor: 'this week' },
			{ Nombre: 'Antier', 						Valor: '-2 days' },
			{ Nombre: 'Ayer', 							Valor: 'yesterday' },
			{ Nombre: 'Hoy', 							Valor: 'today' },
			{ Nombre: 'Mañana', 						Valor: 'tomorrow' },
			{ Nombre: 'Pasadomañana', 					Valor: '+2 days' },
			{ Nombre: 'Último día de esta semana', 		Valor: 'this week +6 days' },
			{ Nombre: 'Último día de este mes', 		Valor: 'last day of this month' },
			{ Nombre: 'El próximo mes', 				Valor: '+1 month' },
			{ Nombre: 'Último día del proximo mes', 	Valor: 'last day of next month' },
			{ Nombre: 'En 2 meses', 					Valor: '+2 months' },
			{ Nombre: 'En 3 meses', 					Valor: '+3 months' },
			{ Nombre: 'Último día de este año', 		Valor: 'last day of december this year' },
		];




		Ctrl.deleteColumna = function(k){
			Ctrl.CuboSel.Columnas.splice(k,1);
		};

		Ctrl.Columnas = [
			{ Columna: 'id', 		Tipo: 'Numero', 	Formato: null 		},
			{ Columna: 'Titulo', 	Tipo: 'Texto',  	Formato: null 		},
			{ Columna: 'Fecha',  	Tipo: 'Fecha',  	Formato: 'Y-m-d' 	},
		];



		Ctrl.testCube = function() {
			$mdDialog.show({
				controller: 'Cubo_TestDialogCtrl',
				templateUrl: 'Frag/Cubos.Cubo_TestDialog',
				locals: { Cubo : Ctrl.CuboSel },
				clickOutsideToClose: false,
				fullscreen: true,
				multiple: true,
			});
		};

		


	}
]);
angular.module('InformeViewerCtrl', [])
.controller('InformeViewerCtrl', ['$scope', '$rootScope', '$http', '$mdToast', '$state', '$timeout', '$window',
	function($scope, $rootScope, $http, $mdToast, $state, $timeout, $window) {

		//console.info('InformeViewerCtrl');
		var Ctrl = $scope;
		var Rs = $rootScope;

		var UID = $state.params.Informe;
		var PanelesIndex = {};

		//Paginas
		Ctrl.PaginaSel = 0;
		Ctrl.changePag = function(k){
			Ctrl.PaginaSel = k;
			$timeout(function() {
				$window.dispatchEvent(new Event("resize"));
			}, 100);
		};
		Ctrl.showFilters = false;

		$http.post('api/Informe/load', { uid: UID }).then(function(r){
			Ctrl.Informe = r.data.Informe;
			Ctrl.Paneles = r.data.Paneles;
			Ctrl.Cubos   = r.data.Cubos;

			document.title = Ctrl.Informe.Titulo;

			//Obtener los indices
			angular.forEach(Ctrl.Paneles, function(P,k){
				PanelesIndex[P.id] = k;
			});

			Ctrl.getDatas();
		});

		Ctrl.getDatas = function(){
			Ctrl.LoadCuboIndex = 0;
			Ctrl.getCuboData();
		};

		Ctrl.getCuboData = function(){
			var Cubo = Ctrl.Cubos[Ctrl.LoadCuboIndex];

			$http.post('api/Informe/get-panels', Cubo).then(function(r){
				//console.log(r.data, PanelesIndex);

				angular.forEach(r.data, function(PanelData, id){
					Ctrl.Paneles[ PanelesIndex[id] ].Data = PanelData;
					Ctrl.$broadcast('PANEL_DATA_LOADED', { panel_id: id });
				});

				Ctrl.LoadCuboIndex++;
				if(Ctrl.LoadCuboIndex < Ctrl.Cubos.length) Ctrl.getCuboData();
			});
		};
	}
]);
angular.module('InformesCtrl', [])
.controller('InformesCtrl', ['$scope', '$rootScope', '$http', '$injector', '$timeout', '$location', 'clipboard', '$mdDialog',
	function($scope, $rootScope, $http, $injector, $timeout, $location, clipboard, $mdDialog) {

		//console.info('InformesCtrl');
		var Ctrl = $scope;
		var Rs = $rootScope;
		var InformesDefConfig = null;

		Ctrl.showInformesNav = false;
		Ctrl.PaginaSel = 0;
		Ctrl.Informe = null;

		Ctrl.Cancel = function(){
			$mdDialog.cancel();
		};

		Ctrl.InformesCRUD = $injector.get('CRUD').config({ 
			base_url: '/api/Informe/informes',
		});

		Ctrl.getInformes = function(){
			Ctrl.InformesCRUD.get(['Titulo']).then(function(){
				//Ctrl.openInforme(Ctrl.InformesCRUD.rows[0]);
			});
		};
		

		Ctrl.openInforme = function(I){
			Ctrl.InformesCRUD.find(I.id, Ctrl, 'Informe').then(function(){
				if(!Ctrl.Informe.Config){ Ctrl.Informe.Config = angular.copy(InformesDefConfig); };
				//Ctrl.seeInforme();
			});
		};

		Ctrl.generateUID = function(len) {

			// Create variables with characters, numbers and special
			var upperCharacters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
				numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
			var finalCharacters = upperCharacters.concat(numbers);
			var finalPassword = [];
			for (var i = 0; i < len; i++) {
				finalPassword.push(finalCharacters[Math.floor(Math.random() * finalCharacters.length)]);
			};

			return finalPassword.join('');
		};

		Ctrl.addInforme = function(config){
			angular.extend(config, {
				title: 'Agregar Informe',
				only: ['Titulo']
			});
			Ctrl.InformesCRUD.dialog({
				Estado: 'A',
				Config: angular.copy(InformesDefConfig),
				Url: Ctrl.generateUID(5)
			}, config).then(function(newElm){
				if(!newElm) return false;
				Ctrl.InformesCRUD.add(newElm);
			});
		};

		Ctrl.changeURL = function(){
			Rs.Confirm({
				Titulo: '¿Cambiar la dirección del informe?',
				Detail: 'las aplicaciones con la dirección anterior perderán acceso al informe'
			}).then(function(Change){
				if(Change){
					Ctrl.Informe.Url = Ctrl.generateUID(5);
				};
			});
		}

		Ctrl.seeInforme = function(){
			$mdDialog.show({
				templateUrl: '/Frag/Informes.Informe_PreviewDialog',
				clickOutsideToClose: true,
				fullscreen: true,
				multiple: true,
				scope: Ctrl,
				preserveScope: true
			});
		};

		Ctrl.saveInforme = function(){
			Ctrl.InformesCRUD.update(Ctrl.Informe).then(function(){
				Rs.showToast('Informe Actualizado', 'Success');
			});
		};

		Ctrl.addPage = function(){
			var Page = angular.copy(InformesDefConfig.Paginas[0]);
			Page.Pagina = 'Página ' + (Ctrl.Informe.Config.Paginas.length + 1);
			Ctrl.Informe.Config.Paginas.push(Page);
		};

		Ctrl.changePag = function(k){
			Ctrl.PaginaSel = k;
		};

		Ctrl.removePag = function(){
			if(Ctrl.Informe.Config.Paginas.length == 1) return false;

			Rs.confirmDelete({
				Title: '¿Eliminar la página "'+Ctrl.Informe.Config.Paginas[Ctrl.PaginaSel].Pagina+'"?',
			}).then(function(del){
				if(!del) return false;
				Ctrl.Informe.Config.Paginas.splice(Ctrl.PaginaSel,1);
				Ctrl.PaginaSel = 0;
			});
		};



		Ctrl.addPanel = function(Panel, Cubo) {
			Ctrl.Informe.Config.Paginas[Ctrl.PaginaSel].Paneles.push({
				panel_id: 		Panel.id,
				panel_titulo: 	Panel.Titulo,
				panel_tipo: 	Panel.Tipo,
				cubo_id: 		Cubo.id,
				cubo_nombre: 	Cubo.Nombre,
				ancho: 			100
			});
		};

		Ctrl.Anchos = [ 20, 30, 40, 50, 60, 70, 80, 100 ];

		Ctrl.removePanel = function(k){
			Ctrl.Informe.Config.Paginas[Ctrl.PaginaSel].Paneles.splice(k,1);
		};

		Ctrl.dragListener = {
			accept: function (sourceItemHandleScope, destSortableScope) { return true; },
		};

		Rs.http('/api/Panel/all', {}, Ctrl, 'Paneles');

		$http.get('/files/InformesDefConfig.json?date=' + moment().unix()).then(function(r){
			InformesDefConfig = r.data;
			Ctrl.getInformes();
		});

		Ctrl.HostUrl = $location.protocol() + '://' + $location.host() + '/#/I/';
		Ctrl.copyUrl = function(){
			var Url = Ctrl.HostUrl + Ctrl.Informe.Url;
			clipboard.copyText(Url);
			Rs.showToast('Dirección copiada al portapapeles', 'Success', 5000, 'bottom right');
		};
	}
]);
angular.module('Panel_PanelBarChartCtrl', [])
.controller('Panel_PanelBarChartCtrl', ['$scope', '$rootScope', '$timeout', '$window',
	function($scope, $rootScope, $timeout, $window) {
		
		var Ctrl = $scope;
		var Rs = $rootScope;

		var yAxisLabel = Ctrl.Panel.Config.Valores[0]  ? Ctrl.Panel.Config.Valores[0].show  : '';
		var xAxisLabel = Ctrl.Panel.Config.Columnas[0] ? Ctrl.Panel.Config.Columnas[0].show : '';

		Ctrl.ChartOps = {
			chart: {
                type: 'multiBarHorizontalChart',
                height: Ctrl.Panel.Config.Op_Altura,
                duration: 500,
                stacked: Ctrl.Panel.Config.Op_Apilado,
                showControls: Ctrl.Panel.Config.Op_Ver_Controles,
                reduceXTicks: Ctrl.Panel.Config.Op_Reducir_Etiquetas,
                noData: 'Sin Datos',
                showLegend: Ctrl.Panel.Config.Op_ShowLegend,
                useInteractiveGuideline: Ctrl.Panel.Config.Op_Linea_Guia,
                controlLabels: {
                    stacked: 'Apilado',
                    grouped: 'Agrupado'
                },
                yAxis: {
                    axisLabel: yAxisLabel,
                    tickFormat: d3.format(',.0f')
                },
                xAxis: {
                    axisLabel: xAxisLabel,
                }
            },
		};

		Ctrl.$on('PANEL_DATA_LOADED', function(ev, args){
			if(args.panel_id == Ctrl.Panel.id){
				Ctrl.ChartData = Ctrl.Panel.Data;
				$timeout(function() {
					Ctrl.ChartApi.refresh();
				}, 100);
			};
		});

		//


	}
]);
angular.module('Panel_PanelColChartCtrl', [])
.controller('Panel_PanelColChartCtrl', ['$scope', '$rootScope', '$timeout', '$window',
	function($scope, $rootScope, $timeout, $window) {
		
		var Ctrl = $scope;
		var Rs = $rootScope;

		var yAxisLabel = Ctrl.Panel.Config.Valores[0]  ? Ctrl.Panel.Config.Valores[0].show  : '';
		var xAxisLabel = Ctrl.Panel.Config.Columnas[0] ? Ctrl.Panel.Config.Columnas[0].show : '';

		Ctrl.ChartOps = {
			chart: {
                type: 'multiBarChart',
                height: Ctrl.Panel.Config.Op_Altura,
                duration: 500,
                stacked: Ctrl.Panel.Config.Op_Apilado,
                showControls: Ctrl.Panel.Config.Op_Ver_Controles,
                reduceXTicks: Ctrl.Panel.Config.Op_Reducir_Etiquetas,
                noData: 'Sin Datos',
                showLegend: Ctrl.Panel.Config.Op_ShowLegend,
                useInteractiveGuideline: Ctrl.Panel.Config.Op_Linea_Guia,
                controlLabels: {
                	stacked: 'Apilado',
                	grouped: 'Agrupado'
                },
                yAxis: {
                    axisLabel: yAxisLabel,
                    tickFormat: d3.format(',.0f')
                },
                xAxis: {
                    axisLabel: xAxisLabel,
                }
            },
		};

		Ctrl.$on('PANEL_DATA_LOADED', function(ev, args){
			if(args.panel_id == Ctrl.Panel.id){
				Ctrl.ChartData = Ctrl.Panel.Data;
				$timeout(function() {
					Ctrl.ChartApi.refresh();
				}, 100);
			};
		});

		//


	}
]);
angular.module('Panel_PanelDataTableCtrl', [])
.controller('Panel_PanelDataTableCtrl', ['$scope', '$rootScope', 
	function($scope, $rootScope) {

		console.info('Panel_PanelDataTableCtrl');
		var Ctrl = $scope;
		var Rs = $rootScope;
	
		Ctrl.$on('PANEL_DATA_LOADED', function(ev, args){
			if(args.panel_id == Ctrl.Panel.id){
				Ctrl.C = {
					'children': Ctrl.Panel.Data.Rows
				};
				Ctrl.Columns = Ctrl.Panel.Data.Columns;
				Ctrl.Totals = Ctrl.Panel.Data.Totals;
			};
		});

		Ctrl.showChild = function(C){
			C.show = C.children ? (C.show = !C.show) : false;
		};
	}
]);
angular.module('Panel_PanelPieChartCtrl', [])
.controller('Panel_PanelPieChartCtrl', ['$scope', '$rootScope', '$timeout', '$window',
	function($scope, $rootScope, $timeout, $window) {
		
		var Ctrl = $scope;
		var Rs = $rootScope;

		Ctrl.ChartOps = {
			chart: {
                type: 'pieChart',
                x: function(d){ return d.key;   },
                y: function(d){ return d.value; },
                height: Ctrl.Panel.Config.Op_Altura,
                showLabels: Ctrl.Panel.Config.Op_ShowLabels,
                duration: 500,
                labelThreshold: 0.025,
                labelSunbeamLayout: Ctrl.Panel.Config.Op_SunbeamLabels,
                noData: 'Sin Datos',
                showLegend: Ctrl.Panel.Config.Op_ShowLegend,
                labelsOutside: Ctrl.Panel.Config.Op_OutsideLabels,
                labelType: function(a,b,c){
                	var label = c.key;
                	var percent = d3.format('.0%')((a.endAngle - a.startAngle) / (2 * Math.PI));
                	switch(Ctrl.Panel.Config.Op_LabelType){
                		case 'keypercent': 	label = c.key + ' (' + percent + ')'; break;
                		case 'keyvalue': 	label = c.key + ': ' + d3.format(',.0f')(c.value); break;
                		case 'value': 		label = d3.format(',.0f')(c.value); break;
                		case 'percent': 	label = percent; break;
                		case 'all': 		label = c.key + ': ' + d3.format(',.0f')(c.value) + ' (' + percent + ')'; break;
                	};
                	return label;
                },
                valueFormat: d3.format(',.0f'),
                pie:{
                	margin: {   
						top: 	Ctrl.Panel.Config.Op_Margenes[0], 
						right: 	Ctrl.Panel.Config.Op_Margenes[1], 
						bottom: Ctrl.Panel.Config.Op_Margenes[2], 
						left: 	Ctrl.Panel.Config.Op_Margenes[3]
					}
                }
            },
		};

		Ctrl.$on('PANEL_DATA_LOADED', function(ev, args){
			if(args.panel_id == Ctrl.Panel.id){
				Ctrl.ChartData = Ctrl.Panel.Data;
				$timeout(function() {
					Ctrl.ChartApi.refresh();
				}, 100);
			};
		});


	}
]);
angular.module('Panel_PanelTableCtrl', [])
.controller('Panel_PanelTableCtrl', ['$scope', '$rootScope',
	function($scope, $rootScope) {

		console.info('Panel_PanelTableCtrl');
		var Ctrl = $scope;
		var Rs = $rootScope;

		//Opcion de filas por página
		if(!('Op_Filas' in Ctrl.Panel.Config) || Ctrl.Panel.Config.Op_Filas == null || Ctrl.Panel.Config.Op_Filas < 1 ){
			Ctrl.FilasxPag = 10;
		}else{
			Ctrl.FilasxPag = Ctrl.Panel.Config.Op_Filas;
		};

		Ctrl.Pagina = 1;

		Ctrl.prep = function(){
			Ctrl.Paginas = Math.ceil(Ctrl.Panel.Data.length / Ctrl.FilasxPag);
			Ctrl.makeFilas();
		};

		Ctrl.prev = function(){ Ctrl.Pagina--; Ctrl.makeFilas(); };
		Ctrl.next = function(){ Ctrl.Pagina++; Ctrl.makeFilas(); };
		Ctrl.makeFilas = function() { Ctrl.fromFilas = (Ctrl.Pagina-1) * Ctrl.FilasxPag; Ctrl.toFilas = Math.min(Ctrl.Pagina * Ctrl.FilasxPag, Ctrl.Panel.Data.length); };

		Ctrl.$on('PANEL_DATA_LOADED', function(ev, args){
			if(args.panel_id == Ctrl.Panel.id){
				Ctrl.prep();
			};
		});

	}
]);
angular.module('Panel_TestDialogCtrl', [])
.controller('Panel_TestDialogCtrl', ['$scope', '$rootScope', '$http', '$mdDialog', 'Cubo', 'Panel',
	function($scope, $rootScope, $http, $mdDialog, Cubo, Panel) {

		var Ctrl = $scope;
		var Rs = $rootScope;

		Ctrl.Cubo  = angular.copy(Cubo);
		Ctrl.Panel = angular.copy(Panel);

		Ctrl.Cancel = function(){ $mdDialog.cancel(); }

		Ctrl.getFiltros = function() {
			return Rs.http('api/Cubos/filtros-values', { Cubo: Cubo }).then(function(f){
				Ctrl.Cubo.Filtros = f;
				Ctrl.getPanel();
			});	
		};

		Ctrl.getPanel = function(){
			Ctrl.Panel.Data = null;
			Rs.http('api/Panel/get-'+Ctrl.Panel.Tipo.toLowerCase(), { Panel: Ctrl.Panel, Filtros: Ctrl.Cubo.Filtros }, Ctrl.Panel, 'Data').then(function(){
				Ctrl.$broadcast('PANEL_DATA_LOADED', { panel_id: Ctrl.Panel.id });
			});
		};

		Ctrl.getFiltros();

	}
]);
angular.module('PanelesCtrl', [])
.controller('PanelesCtrl', ['$scope', '$rootScope', '$http', '$mdDialog', '$injector', '$timeout',
	function($scope, $rootScope, $http, $mdDialog, $injector, $timeout) {

		//console.info('PanelesCtrl');
		var Ctrl = $scope;
		var Rs = $rootScope;

		Ctrl.showPanelesNav = true;

		Ctrl.CubosCRUD = $injector.get('CRUD').config({   base_url: '/api/Cubos/cubos' 	 });
		Ctrl.PanelesCRUD = $injector.get('CRUD').config({ base_url: '/api/Panel/paneles' });

		Ctrl.CubosCRUD.get().then(function(){
			Ctrl.getPanels(Ctrl.CubosCRUD.rows[0]);
		});

		Ctrl.getPanels = function(Cubo){
			Ctrl.Cubo = Cubo;
			Ctrl.PanelesCRUD.where(['cubo_id', '=', Cubo.id]).get(['Tipo','Titulo']).then(function(){
				//Ctrl.openPanel(Ctrl.PanelesCRUD.rows[0]);
				Ctrl.getFiltros(Ctrl.Cubo);
			});
		};

		Ctrl.Panel = null;
		Ctrl.openPanel = function(Panel){
			Ctrl.PanelesCRUD.find(Panel.id, Ctrl, 'Panel').then(function(){
				//Ctrl.testCube();
				if(Array.isArray(Ctrl.Panel.Config)) Ctrl.Panel.Config = {
					Filtros: [], Columnas: [], Agrupadores: [], Valores: []
				};
				
				/*$timeout(function() {
					Ctrl.getPanelData();
				}, 500);*/
				
			});
		};

		Ctrl.addPanel = function(config){
			angular.extend(config, {
				title: 'Agregar Panel',
				only: ['Titulo']
			});
			Ctrl.PanelesCRUD.dialog({
				cubo_id: Ctrl.Cubo.id,
				Tipo: 'Table',
				Config: angular.copy(Ctrl.PanelesConfig['Table']._default)
			}, config).then(function(newElm){
				if(!newElm) return false;
				Ctrl.PanelesCRUD.add(newElm);
			});
		};

		Ctrl.deletePanel = function(){
			Ctrl.PanelesCRUD.delete(Ctrl.Panel).then(function(){
				Ctrl.Panel = null;
			});
		};

		Ctrl.savePanel = function(){
			Ctrl.PanelesCRUD.update(Ctrl.Panel).then(function(){
				Rs.showToast('Panel Actualizado', 'Success');
			});
		};

		

		Ctrl.openTipoDiag = function(){
			$mdDialog.show({
				scope: Ctrl,
				templateUrl: '/Frag/Paneles.Panel_Details_ChangeTipo',
				clickOutsideToClose: true,
				fullscreen: true,
				multiple: true,
				preserveScope: true
			});
		};

		Ctrl.Cancel = function(){ $mdDialog.cancel(); }
		Ctrl.changeTipoPanel = function(Tipo){
			if(Tipo !== Ctrl.Panel.Tipo){
				Ctrl.Panel.Tipo = Tipo;
				Ctrl.Panel.Config = angular.copy(Ctrl.PanelesConfig[Tipo]._default);
				Ctrl.Panel.Data = [];

				$timeout(function() {
					Ctrl.getPanelData();
				}, 250);
			};

			$mdDialog.hide();
		};

		Ctrl.addConfig = function(DestId, Item){

			console.log(DestId, Item);
			var Config = Ctrl.PanelesConfig[Ctrl.Panel.Tipo];

			var DefPush = {
				Columna: Item.Columna,
				ColumnaTipo: Item.Tipo,
			};

			//Revisar que no se sobrepasen los límites
			if( Ctrl.Panel.Config[DestId].length >= Config[DestId].cant ){
				Rs.showToast('No se puede agregar el campo', 'Error'); return false;
			};

			//Revisar si se pueden tener duplicados
			if(!Config[DestId].dupes){
				if(Rs.found(Item.Columna, Ctrl.Panel.Config[DestId], 'Columna')) return false;
			};

			if(DestId == 'Filtros'){  Ctrl.Panel.Config.Filtros.push(angular.extend(DefPush, { operador: 'Es', valor: 1 })); };
			if(DestId == 'Columnas'){ Ctrl.Panel.Config.Columnas.push(angular.extend(DefPush, { show: Item.Columna })); };
			if(DestId == 'Agrupadores'){ Ctrl.Panel.Config.Agrupadores.push(angular.extend(DefPush, { show: Item.Columna })); };
			if(DestId == 'Valores'){ Ctrl.Panel.Config.Valores.push(angular.extend(DefPush, { operador: 'Contar', show: 'Contar '+Item.Columna, row_total: 'Total' })); };
			
			Ctrl.getPanelData();

			return false;
			
		};

		Ctrl.removeOp = function(DestId, k){
			console.log(DestId,k);
			Ctrl.Panel.Config[DestId].splice(k,1);
			Ctrl.getPanelData();
		};

		Ctrl.dragControlListeners = {
			accept: function (sourceItemHandleScope, destSortableScope) { return true; },
			itemMoved: function (evObj) {
				var DestId = evObj.dest.sortableScope.element[0].id;
				var Item = evObj.source.itemScope.modelValue;
				evObj.dest.sortableScope.removeItem(evObj.dest.index);
				Ctrl.addConfig(DestId, Item);
			},
			clone: true,
		};

		Ctrl.recieversCtrl = {
			accept: function(){ return true; }
		}

		$http.get('/files/PanelesDefConfig.json?date=' + moment().unix()).then(function(r){
			Ctrl.PanelesConfig = r.data;
		});

		//Testing
		Ctrl.testPanel = function(){
			$mdDialog.show({
				controller: 'Panel_TestDialogCtrl',
				templateUrl: '/Frag/Paneles.Panel_TestDialog',
				locals: { Cubo: Ctrl.Cubo, Panel : Ctrl.Panel },
				clickOutsideToClose: true,
				fullscreen: true,
				multiple: true,
			});
		};

		Ctrl.getFiltros = function(Cubo) {
			return Rs.http('api/Cubos/filtros-values', { Cubo: Cubo }).then(function(f){
				Ctrl.Cubo.Filtros = f;
			});	
		};

		Ctrl.PanelTipo = 'Blank';
		Ctrl.getPanelData = function(){
			Ctrl.Panel.Data = null;
			Ctrl.PanelTipo = 'Blank';

			$timeout(function(){
				Ctrl.PanelTipo = Rs.def(Ctrl.Panel.Tipo, 'Blank');

				Rs.http('api/Panel/get-'+Ctrl.PanelTipo.toLowerCase(), { Panel: Ctrl.Panel, Filtros: Ctrl.Cubo.Filtros }, Ctrl.Panel, 'Data').then(function(){
					Ctrl.$broadcast('PANEL_DATA_LOADED', { panel_id: Ctrl.Panel.id });
				});

			}, 250);

			
		};



	}
]);
angular.module('CRUD', [])
.factory('CRUD', [ '$rootScope', '$q', '$mdDialog', 
	function($rootScope, $q, $mdDialog){

		var Rs = $rootScope;

		var CRUD = function(ops) {
			var t = this;

			t.ops = {
				base_url: '',
				name: '',
				primary_key: 'id',
				ready: false,
				where: {},
				limit: 1000,
				loading: false,
				obj: null,
				only_columns: [],
				add_append: 'end'
			};
			t.columns = [];
			t.rows = [];

			angular.extend(t.ops, ops);
			//console.info('Crud initiated', t.ops.base_url);

			t.get = function(columns){
				
				if(t.ops.loading) return false;
				t.ops.loading = true;

				t.ops.only_columns = Rs.def(columns, []);
				t.rows = [];

				return Rs.http(t.ops.base_url, { fn: 'get', ops: t.ops }).then(function(r) {
					if(r.ops){
						t.columns = r.ops.columns;
						delete r.ops.columns;
						angular.extend(t.ops, r.ops);
					};
					t.rows = r.rows;
					t.ops.loading = false;
				});
			};


			t.where = function(where){
				t.ops.where[where[0]] = where;
				return t;
			};

			t.find = function(id, main, prop){
				t.ops.find_id = id;
				return Rs.http(t.ops.base_url, { fn: 'find', ops: t.ops }, main, prop);
			};

			t.add = function(Obj){
				t.ops.obj = Obj;
				return Rs.http(t.ops.base_url, { fn: 'add', ops: t.ops }).then(function(r) {
					t.ops.obj = null;
					if(t.ops.add_append == 'end'){ t.rows.push(r); }
					else if(t.ops.add_append == 'start'){ t.rows.unshift(r); }
					else if(t.ops.add_append == 'refresh'){ t.get(); };
				});
			};

			t.update = function(Obj){
				t.ops.obj = Obj;
				return Rs.http(t.ops.base_url, { fn: 'update', ops: t.ops }).then(function(r) {
					t.ops.obj = null;
					Rs.updateArray(t.rows, r, t.ops.primary_key);
				});
			};

			t.delete = function(Obj){
				t.ops.obj = Obj;
				var Index = Rs.getIndex(t.rows, Obj[t.ops.primary_key], t.ops.primary_key);
				return Rs.http(t.ops.base_url, { fn: 'delete', ops: t.ops }).then(function(r) {
					t.ops.obj = null;
					t.rows.splice(Index, 1);
				});
			};

			t.dialog = function(Obj, diagConfig){
				var config = {
					theme: 'default',
					title: '',
					class: 'wu400',
					controller: 'CRUDDialogCtrl',
					templateUrl: '/templates/dialogs/crud-dialog.html',
					fullscreen: false,
					clickOutsideToClose: false,
					multiple: true,
					ev: null,
					confirmText: 'Guardar',
					with_delete: true,
					delete_title: '',
					only: [],
					buttons: [],
				};

				angular.extend(config, diagConfig);

				return $mdDialog.show({
					controller:  config.controller,
					templateUrl: config.templateUrl,
					locals: 	{ ops : t.ops, config: config, columns: t.columns, Obj: Obj, rows: t.rows },
					clickOutsideToClose: config.clickOutsideToClose,
					fullscreen:  config.fullscreen,
					multiple: 	 config.multiple,
					targetEvent: config.ev
				});
			};




		};

		return {
			config: function (ops) {
				var DaCRUD = new CRUD(ops);
				return DaCRUD;
			}
		};
	}
]);
angular.module('Filters', [])
	.filter('to_trusted', ['$sce', function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter('findId', function() {
		return function(input, id) {
			var i=0, len=input.length;
			for (; i<len; i++) {
			  if (+input[i].id == +id) {
				return input[i];
			  }
			}
			return null;
		 };
	}).filter('getIndex', function() {
		return function(input, id, attr) {
			var len=input.length;
			attr = (typeof attr !== 'undefined') ? attr : 'id';
			for (i=0; i<len; i++) {
			  if(input[i][attr] === id) {
				return i;
			  }
			}
			return null;
		 };
	}).filter('exclude', function() {
		return function(input, exclude, prop) {
			if (!angular.isArray(input))
				return input;

			if (!angular.isArray(exclude))
				exclude = [];

			if (prop) {
				exclude = exclude.map(function byProp(item) {
					return item[prop];
				});
			}

			return input.filter(function byExclude(item) {
				return exclude.indexOf(prop ? item[prop] : item) === -1;
			});
		};
	}).filter('category', function() {
		return function(input, category, prop) {
			//console.log(input, category, prop);
			if (!angular.isArray(input)) return input;
			if(!category) return input;
			return input.filter(function(item){
				return item[prop] == category;
			});
			//return input[prop] == category;
		};
	}).filter('toArray', function () {
		return function (obj, addKey) {
			if (!angular.isObject(obj)) return obj;
			if ( addKey === false ) {
			return Object.keys(obj).map(function(key) {
				return obj[key];
			});
			} else {
			return Object.keys(obj).map(function (key) {
				var value = obj[key];
				return angular.isObject(value) ?
				Object.defineProperty(value, '$key', { enumerable: false, value: key}) :
				{ $key: key, $value: value };
			});
			}
		};
	}).filter('pluck', function() {
		return function(array, key, unique) {
			var res = new Array();
			angular.forEach(array, function(v) {
				if(unique && res.indexOf(v[key]) !== -1) return false;
				res.push(v[key]);
			});
			return res;
		};
	}).filter('search', function() {
		return function(input, search) {
			if (!input) return input;
			if (!search) return input;
			var expected = ('' + search).toLowerCase();
			var result = {};
			angular.forEach(input, function(value, key) {
				var actual = ('' + value).toLowerCase();
				if (actual.indexOf(expected) !== -1) {
					result[key] = value;
				}
			});
			return result;
		}
	}).filter('numbersep', function() {
		return function(n) {
			if(typeof n !== 'number') return n;
			return n.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,');
		}
	});



// Reacts upon enter key press.
angular.module('enterStroke', []).directive('enterStroke',
  function () {
    return function (scope, element, attrs) {
      element.bind('keydown keypress', function (event) {
        if (event.which === 13) {
          scope.$apply(function () {
            scope.$eval(attrs.enterStroke);
          });
          event.preventDefault();
        }
      });
    };
  }
);
angular.module('fileread', [])
.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = JSON.parse(loadEvent.target.result);
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);
angular.module('horizontalScroll', []).
directive('horizontalScroll', function () {

    return {
        link:function (scope, element, attrs) {
            var base = 0

            element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {

                // cross-browser wheel delta
                var event = window.event || event; // old IE support
                var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));


                scope.$apply(function(){
                    base += (30*delta);
                    //console.log(element, base);
                    element.children().css({'transform':'translateX('+base+'px)'});
                    //element.scrollLeft(base);
                });

                // for IE
                event.returnValue = false;
                // for Chrome and Firefox
                if(event.preventDefault) { event.preventDefault(); }


            });
        }
    };
});
angular.module('hoverClass', [])
.directive('hoverClass', [function () {
    return {
        restrict: 'A',
        scope: {
            hoverClass: '@'
        },
        link: function (scope, element) {
            element.on('mouseenter', function() {
                element.addClass(scope.hoverClass);
            });
            element.on('mouseleave', function() {
                element.removeClass(scope.hoverClass);
            });
        }
    };
}]);
(function () {
    'use strict';

    angular.module('ngJsonExportExcel', [])
        .directive('ngJsonExportExcel', function () {
            return {
                restrict: 'AE',
                scope: {
                    data : '=',
                    filename: '=?',
                    reportFields: '=',
                    separator: '@'
                },
                link: function (scope, element) {
                    scope.filename = !!scope.filename ? scope.filename : 'export-excel';
                    scope.extension = !!scope.extension ? scope.extension : '.csv';

                    var fields = [];
                    var header = [];
                    var separator = scope.separator || ';';

                    angular.forEach(scope.reportFields, function(field, key) {
                        if(!field || !key) {
                            throw new Error('error json report fields');
                        }

                        fields.push(key);
                        header.push(field);
                    });

                    element.bind('click', function() {
                        var bodyData = _bodyData();
                        var strData = _convertToExcel(bodyData);

                        var blob = new Blob([strData], { 
                            type: "text/plain;charset=utf-8"
                            //type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                        });

                        return saveAs(blob, [scope.filename + scope.extension ]);
                    });

                    function _bodyData() {
                        var data = scope.data;
                        var body = "";
                        angular.forEach(data, function(dataItem) {
                            var rowItems = [];

                            angular.forEach(fields, function(field) {
                                if(field.indexOf('.')) {
                                    field = field.split(".");
                                    var curItem = dataItem;

                                    // deep access to obect property
                                    angular.forEach(field, function(prop){
                                        if (curItem !== null && curItem !== undefined) {
                                            curItem = curItem[prop];
                                        }
                                    });

                                    data = curItem;
                                }
                                else {
                                    data = dataItem[field];
                                }

                                var fieldValue = data !== null ? data : ' ';

                                if (fieldValue !== undefined && angular.isObject(fieldValue)) {
                                    fieldValue = _objectToString(fieldValue);
                                }

                                rowItems.push(fieldValue);
                            });

                            body += rowItems.join(separator) + '\n';
                        });

                        return body;
                    }

                    function _convertToExcel(body) {
                        return header.join(separator) + '\n' + body;
                    }

                    function _objectToString(object) {
                        var output = '';
                        angular.forEach(object, function(value, key) {
                            output += key + ':' + value + ' ';
                        });

                        return '"' + output + '"';
                    }
                }
            };
        });
})();
/*! ng-csv 10-10-2015 */
!function(a){angular.module("ngCsv.config",[]).value("ngCsv.config",{debug:!0}).config(["$compileProvider",function(a){angular.isDefined(a.urlSanitizationWhitelist)?a.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data):/):a.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data):/)}]),angular.module("ngCsv.directives",["ngCsv.services"]),angular.module("ngCsv.services",[]),angular.module("ngCsv",["ngCsv.config","ngCsv.services","ngCsv.directives","ngSanitize"]),"undefined"!=typeof module&&"undefined"!=typeof exports&&module.exports===exports&&(module.exports="ngCsv"),angular.module("ngCsv.services").service("CSV",["$q",function(a){var b="\r\n",c="﻿",d={"\\t":"	","\\b":"\b","\\v":"","\\f":"\f","\\r":"\r"};this.stringifyField=function(a,b){return"locale"===b.decimalSep&&this.isFloat(a)?a.toLocaleString():"."!==b.decimalSep&&this.isFloat(a)?a.toString().replace(".",b.decimalSep):"string"==typeof a?(a=a.replace(/"/g,'""'),(b.quoteStrings||a.indexOf(",")>-1||a.indexOf("\n")>-1||a.indexOf("\r")>-1)&&(a=b.txtDelim+a+b.txtDelim),a):"boolean"==typeof a?a?"TRUE":"FALSE":a},this.isFloat=function(a){return+a===a&&(!isFinite(a)||Boolean(a%1))},this.stringify=function(d,e){var f=a.defer(),g=this,h="",i="",j=a.when(d).then(function(a){if(angular.isDefined(e.header)&&e.header){var d,j;d=[],angular.forEach(e.header,function(a){this.push(g.stringifyField(a,e))},d),j=d.join(e.fieldSep?e.fieldSep:","),i+=j+b}var k=[];if(angular.isArray(a)?k=a:angular.isFunction(a)&&(k=a()),angular.isDefined(e.label)&&e.label&&"boolean"==typeof e.label){var l,m;l=[],angular.forEach(k[0],function(a,b){this.push(g.stringifyField(b,e))},l),m=l.join(e.fieldSep?e.fieldSep:","),i+=m+b}angular.forEach(k,function(a,c){var d,f,h=angular.copy(k[c]);f=[];var j=e.columnOrder?e.columnOrder:h;angular.forEach(j,function(a){var b=e.columnOrder?h[a]:a;this.push(g.stringifyField(b,e))},f),d=f.join(e.fieldSep?e.fieldSep:","),i+=c<k.length?d+b:d}),e.addByteOrderMarker&&(h+=c),h+=i,f.resolve(h)});return"function"==typeof j["catch"]&&j["catch"](function(a){f.reject(a)}),f.promise},this.isSpecialChar=function(a){return void 0!==d[a]},this.getSpecialChar=function(a){return d[a]}}]),angular.module("ngCsv.directives").directive("ngCsv",["$parse","$q","CSV","$document","$timeout",function(b,c,d,e,f){return{restrict:"AC",scope:{data:"&ngCsv",filename:"@filename",header:"&csvHeader",columnOrder:"&csvColumnOrder",txtDelim:"@textDelimiter",decimalSep:"@decimalSeparator",quoteStrings:"@quoteStrings",fieldSep:"@fieldSeparator",lazyLoad:"@lazyLoad",addByteOrderMarker:"@addBom",ngClick:"&",charset:"@charset",label:"&csvLabel"},controller:["$scope","$element","$attrs","$transclude",function(a,b,e){function f(){var b={txtDelim:a.txtDelim?a.txtDelim:'"',decimalSep:a.decimalSep?a.decimalSep:".",quoteStrings:a.quoteStrings,addByteOrderMarker:a.addByteOrderMarker};return angular.isDefined(e.csvHeader)&&(b.header=a.$eval(a.header)),angular.isDefined(e.csvColumnOrder)&&(b.columnOrder=a.$eval(a.columnOrder)),angular.isDefined(e.csvLabel)&&(b.label=a.$eval(a.label)),b.fieldSep=a.fieldSep?a.fieldSep:",",b.fieldSep=d.isSpecialChar(b.fieldSep)?d.getSpecialChar(b.fieldSep):b.fieldSep,b}a.csv="",angular.isDefined(a.lazyLoad)&&"true"==a.lazyLoad||angular.isArray(a.data)&&a.$watch("data",function(){a.buildCSV()},!0),a.getFilename=function(){return a.filename||"download.csv"},a.buildCSV=function(){var g=c.defer();return b.addClass(e.ngCsvLoadingClass||"ng-csv-loading"),d.stringify(a.data(),f()).then(function(c){a.csv=c,b.removeClass(e.ngCsvLoadingClass||"ng-csv-loading"),g.resolve(c)}),a.$apply(),g.promise}}],link:function(b,c){function d(){var c=b.charset||"utf-8",d=new Blob([b.csv],{type:"text/csv;charset="+c+";"});if(a.navigator.msSaveOrOpenBlob)navigator.msSaveBlob(d,b.getFilename());else{var g=angular.element('<div data-tap-disabled="true"><a></a></div>'),h=angular.element(g.children()[0]);h.attr("href",a.URL.createObjectURL(d)),h.attr("download",b.getFilename()),h.attr("target","_blank"),e.find("body").append(g),f(function(){h[0].click(),h.remove()},null)}}c.bind("click",function(){b.buildCSV().then(function(){d()}),b.$apply()})}}}])}(window,document);
angular.module('ngRightClick', [])
.directive('ngRightClick', ['$parse', function($parse){
	return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
}]);
// Reacts upon enter key press.
angular.module('printThis', []).directive('printThis',
  function () {
    return function (scope, element, attrs) {
      element.bind('click', function (event) {
          event.preventDefault();
          //console.log(_config);

          //return false;

          $(attrs.printThis).printThis({
          		debug: false,
              importStyle: true,
          });
      });
    };
  }
);
angular.module('App', [
	'ui.router',

	'ngStorage',
	'ngMaterial',
	'ngSanitize',

	'md.data.table',
	'ngFileUpload',
	'angular-loading-bar',
	'angularResizable',
	'nvd3',
	'ui.utils.masks',
	'as.sortable',
	'ngCsv',
	'angular-clipboard',

	'appRoutes',
	'appConfig',
	'appFunctions',
	'CRUD',
	'CRUDDialogCtrl',
	
	'Filters',
	'enterStroke',
	'printThis',
	'ngRightClick',
	'fileread',
	'hoverClass',
	'horizontalScroll',

	'BasicDialogCtrl',
	'ConfirmCtrl',
	'ConfirmDeleteCtrl',
	'ListSelectorCtrl',

	'MainCtrl',
	'LoginCtrl',

	'CubosCtrl',
		'Cubo_TestDialogCtrl',
	'PanelesCtrl',
		'Panel_TestDialogCtrl',
		'Panel_PanelTableCtrl',
		'Panel_PanelDataTableCtrl',
		'Panel_PanelPieChartCtrl',
		'Panel_PanelColChartCtrl',
		'Panel_PanelBarChartCtrl',
	'InformesCtrl',
		'InformeViewerCtrl',
	
]);
angular.module('appConfig', [])
.config(['$mdThemingProvider', '$mdIconProvider', '$mdDateLocaleProvider', 'cfpLoadingBarProvider', '$compileProvider', 
	function($mdThemingProvider, $mdIconProvider, $mdDateLocaleProvider, cfpLoadingBarProvider, $compileProvider){

		//Definicion de paletas
		$mdThemingProvider.definePalette('Sea', {
			'50': '#cce0ef',
			'100': '#92bedc',
			'200': '#67a4ce',
			'300': '#3a83b4',
			'400': '#32729d',
			'500': '#2b6186',
			'600': '#24506f',
			'700': '#1c3f58',
			'800': '#152f40',
			'900': '#0d1e29',
			'A100': '#cce0ef',
			'A200': '#92bedc',
			'A400': '#32729d',
			'A700': '#1c3f58',
			'contrastDefaultColor': 'light',
			'contrastDarkColors': '50 100 200 A100 A200'
		});

		$compileProvider.aHrefSanitizationWhitelist(/^\s*(blob|http|https?):/);

		//$mdAriaProvider.disableWarnings();

		$mdThemingProvider.definePalette('Gold', {
			'50': '#ffffff',
			'100': '#fcf3df',
			'200': '#f6e0ad',
			'300': '#efc86c',
			'400': '#ecbe51',
			'500': '#e9b435',
			'600': '#e6aa19',
			'700': '#cb9616',
			'800': '#af8113',
			'900': '#936d10',
			'A100': '#ffffff',
			'A200': '#fcf3df',
			'A400': '#ecbe51',
			'A700': '#cb9616',
			'contrastDefaultColor': 'light',
			'contrastDarkColors': '50 100 200 300 400 500 600 700 800 A100 A200 A400 A700'
		});


		$mdThemingProvider.theme('default')
			.primaryPalette('blue', { 'default' : '900' })
			.accentPalette('yellow', { 'default' : '800' });

		$mdThemingProvider.theme('Money', 'default')
			.primaryPalette('teal', { 'default' : '800' })
			.accentPalette('orange');

		$mdThemingProvider.theme('Ocean', 'default')
			.primaryPalette('Sea')
			.accentPalette('Gold');

		$mdThemingProvider.theme('Danger', 'default')
			.primaryPalette('red')
			.accentPalette('yellow');

		$mdThemingProvider.theme('Snow_White', 'default')
			.primaryPalette('grey', { 'default' : '100' })
			.accentPalette('orange');

		$mdThemingProvider.theme('Greyshade', 'default')
			.primaryPalette('grey', { 'default' : '800' })
			.accentPalette('Gold').dark();

		$mdThemingProvider.theme('Black', 'default')
			.primaryPalette('grey', { 'default' : '900' })
			.accentPalette('Gold').dark();

		$mdThemingProvider.theme('Transparent', 'default')
			.primaryPalette('grey', { 'default' : '900' })
			.accentPalette('grey').dark();

		$mdThemingProvider.theme('Valak', 'default')
			.primaryPalette('blue-grey', { 'default' : '700' })
			.accentPalette('Gold');

		//Calendar
		$mdDateLocaleProvider.months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre' ];
		$mdDateLocaleProvider.shortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
		$mdDateLocaleProvider.days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado' ];
		$mdDateLocaleProvider.shortDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

		$mdDateLocaleProvider.parseDate = function(dateString) {
			var m = moment(dateString, 'L', true);
			return m.isValid() ? m.toDate() : new Date(NaN);
		};
		$mdDateLocaleProvider.formatDate = function(date) {
			if(typeof date == 'undefined' || date === null || isNaN(date.getTime()) ){
				return null;
			}else{
				return moment(date).format('L');
			}
		};

		$mdDateLocaleProvider.firstDayOfWeek = 1;

		// In addition to date display, date components also need localized messages
		// for aria-labels for screen-reader users.
		$mdDateLocaleProvider.weekNumberFormatter = function(weekNumber) {
			return 'Semana ' + weekNumber;
		};
		$mdDateLocaleProvider.msgCalendar = 'Calendario';
		$mdDateLocaleProvider.msgOpenCalendar = 'Abrir el Calendario';


		//Loading Bar
		cfpLoadingBarProvider.includeSpinner = false;
		cfpLoadingBarProvider.latencyThreshold = 300;

		var icons = {
			'md-plus' 			: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
			'md-close' 			: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
			'md-arrow-back' 	: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>',
			'md-apps' 			: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><g transform="translate(3, 3)"><circle cx="2" cy="2" r="2"></circle><circle cx="2" cy="9" r="2"></circle><circle cx="2" cy="16" r="2"></circle><circle cx="9" cy="2" r="2"></circle><circle cx="9" cy="9" r="2"></circle><circle cx="16" cy="2" r="2"></circle><circle cx="16" cy="9" r="2"></circle><circle cx="16" cy="16" r="2"></circle><circle cx="9" cy="16" r="2"></circle></g></svg>',
			'md-enter' 			: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M11 5v5.59H7.5l4.5 4.5 4.5-4.5H13V5h-2zm-5 9c0 3.31 2.69 6 6 6s6-2.69 6-6h-2c0 2.21-1.79 4-4 4s-4-1.79-4-4H6z"/></svg>',
			'md-save' 			: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
			'md-delete' 		: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
			'md-bars' 			: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>',
			'md-more-v' 		: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>',
			'md-search'			: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
			'md-chevron-down' 	: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
			'md-check'			: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
			'md-edit'			: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
			'md-settings'		: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>',
		};

		iconp = $mdIconProvider.defaultFontSet( 'fa' );

		angular.forEach(icons, function(icon, k) {
			iconp.icon(k, 'data:image/svg+xml, '+icon, 24);
		});
  }
]);


/**
 * Available palettes: red, pink, purple, deep-purple, indigo, blue, light-blue, cyan, teal, 
 * green, light-green, lime, yellow, amber, orange, deep-orange, brown, grey, blue-grey
 */
angular.module('appFunctions', [])
.factory('appFunctions', [ '$rootScope', '$http', '$mdDialog', '$mdSidenav', '$mdToast', '$q', '$state', '$location', '$filter', 
	function($rootScope, $http, $mdDialog, $mdSidenav, $mdToast, $q, $state, $location, $filter){

		var Rs = $rootScope;

		//State
		Rs.stateChanged = function(){
			Rs.State = $state.current;
			Rs.State.route = $location.path().split('/');
			Rs.State.tabSelected = 0;

			if(Rs.State.route.length > 2){
				Rs.State.tabSelected = Rs.Sections[Rs.State.route[2]]['No'];
			};

		};
		Rs.navTo = function(Dir, params){ $state.go(Dir, params); };
		Rs.Refresh = function() { $state.go($state.current, $state.params, {reload: true}); };




		//Helpers
		Rs.def = function(arg, def) {
			return (typeof arg == 'undefined' ? def : arg);
		};

		Rs.getSize = function(obj) {
			if(typeof obj !== "undefined" && typeof obj !== "null"){
				return Object.keys(obj).length;
			}
		};

		Rs.inArray = function (item, array) {
			return (-1 !== array.indexOf(item));
		};

		Rs.getIndex = function(array, keyval, key){
			var key = Rs.def(key, 'id');
			return $filter('getIndex')(array, keyval, key);
		};

		Rs.updateArray = function(array, newelm, key){
			var key = Rs.def(key, 'id');
			var keyval = newelm[key];
			var I = Rs.getIndex(array, keyval, key);
			array[I] = newelm;
		};

		Rs.http = function(url, data, scp, prop, method){
			var method = Rs.def(method, 'POST');
			var data = Rs.def(data, {});
			var prop = Rs.def(prop, false);

			return $q(function(res, rej) {
				$http({
					method: method,
					url: url,
					data: data
				}).then(function(r){
					if(prop) scp[prop] = r.data;
					res(r.data);
				}, function(r){
					Rs.showToast(r.data.Msg, 'Error');
					rej(r.data);
				});
			});
		};

		Rs.found = function(needle, haysack, key, msg, except){
			var except = Rs.def(except, false);
			var Found = false;

			if(typeof needle == 'undefined') return false;
			console.log(needle, haysack, key);

			angular.forEach(haysack, function(elm){
				if(elm[key].toUpperCase().trim() == needle.toUpperCase().trim()){
					if(except){
						if(elm[except[0]] != except[1]) Found = true;
					}else{
						Found = true;
					}
				};
			});
			if(Found){
				var msg = Rs.def(msg, needle+' ya existe.');
				if(msg !== '') Rs.showToast(msg, 'Error');
			}
			return Found;
		};

		Rs.prepFields = function(Fields, Model){
			var Model = Rs.def(Model, {});
			angular.forEach(Fields, function(F, i){
				Model[F['Nombre']] = F['Value'];
			});
			return Model;
		};


		Rs.download = function(strData, strFileName, strMimeType) {
			var D = document,
			    a = D.createElement("a");
			    strMimeType= strMimeType || "application/octet-stream";

			if (navigator.msSaveBlob) { // IE10
			    return navigator.msSaveBlob(new Blob([strData], {type: strMimeType}), strFileName);
			};

			if ('download' in a) { //html5 A[download]
			    a.href = "data:" + strMimeType + "," + encodeURIComponent(strData);
			    a.setAttribute("download", strFileName);
			    a.innerHTML = "downloading...";
			    D.body.appendChild(a);
			    setTimeout(function() {
			        a.click();
			        D.body.removeChild(a);
			    }, 66);
			    return true;
			};

			//do iframe dataURL download (old ch+FF):
			var f = D.createElement("iframe");
			D.body.appendChild(f);
			f.src = "data:" +  strMimeType   + "," + encodeURIComponent(strData);

			setTimeout(function() {
			    D.body.removeChild(f);
			}, 333);

			return true;
		};



		//Sidenav
		Rs.toogleSidenav = function(navID){
			$mdSidenav(navID).toggle();
		};



		//Quick Lauch
		Rs.showToast = function(Msg, Type, Delay, Position){
			var Type = Rs.def(Type, 'Normal');
			var Delay = Rs.def(Delay, 5000);
			var Position = Rs.def(Position, 'bottom left')

			var Templates = {
				Normal: '<md-toast class="md-toast-normal"><span flex>' + Msg + '<span></md-toast>',
				Error:  '<md-toast class="md-toast-error"><span flex>' + Msg + '<span></md-toast>',
				Success:  '<md-toast class="md-toast-success"><span flex>' + Msg + '<span></md-toast>',
			};
			return $mdToast.show({
				template: Templates[Type],
				hideDelay: Delay,
				position: Position
			});
		};





		//Dialogs
		Rs.BasicDialog = function(params) {
			var DefConfig = {
				Theme: 'default',
				Title: 'Crear',
				Fields: [
					{ Nombre: 'Nombre',  Value: '', Required: true }
				],
				Confirm: { Text: 'Crear' },
				HasDelete: false,
				controller: 'BasicDialogCtrl',
				templateUrl: '/templates/dialogs/basic-string.html',
				fullscreen: false,
				clickOutsideToClose: true,
				multiple: true,
			};

			var Config = angular.extend(DefConfig, params);

			return $mdDialog.show({
				controller: Config.controller,
				templateUrl: Config.templateUrl,
				locals: { Config : Config },
				clickOutsideToClose: Config.clickOutsideToClose,
				fullscreen: Config.fullscreen,
				multiple: Config.multiple,
			});
		};

		Rs.ListSelector = function(List, Config, ev){
			var List = Rs.def(List, null);
			var DefConfig = {
				controller: 'ListSelectorCtrl',
				templateUrl: '/templates/dialogs/ListSelector.html',
				clickOutsideToClose: true,
				hasBackdrop: true,
				fullscreen: false,
				parent: null,
				remoteUrl: false,
				remoteMethod: 'POST',
				remoteData: {},
				remoteQuery: false,
				remoteListName: 'Nombre',
				remoteListLogo: 'Logo',
				searchPlaceholder: 'Buscar',
			};
			var Config = angular.extend(DefConfig, Config);

			return $mdDialog.show({
				controller: Config.controller,
				templateUrl: Config.templateUrl,
				locals: { Config : Config, List: List },
				clickOutsideToClose: Config.clickOutsideToClose,
				fullscreen: Config.fullscreen,
				multiple: Config.multiple,
				parent: Config.parent,
			});
		};
		
		Rs.Confirm = function(params){
			var DefConfig = {
				Theme: 'default',
				Titulo: '¿Seguro que desea realizar esta acción?',
				Detail: '',
				Buttons: [
					{ Text: 'Ok', Class: 'md-raised md-primary', Value: true }
				],
				Icon: false,
				hasCancel: true,
				CancelText: 'Cancelar',
				controller: 'ConfirmCtrl',
				templateUrl: '/templates/dialogs/confirm.html',
				fullscreen: false,
				clickOutsideToClose: true,
				multiple: true
			};

			var Config = angular.extend(DefConfig, params);

			return $mdDialog.show({
				controller: Config.controller,
				templateUrl: Config.templateUrl,
				locals: { Config : Config },
				clickOutsideToClose: Config.clickOutsideToClose,
				fullscreen: Config.fullscreen,
				multiple: Config.multiple,
			});
		};

		Rs.confirmDelete = function(params){
			var DefConfig = {
				Theme: 'Danger',
				Title: '¿Eliminar?',
				Detail: 'Esta acción no se puede deshacer',
				ConfirmText: 'Eliminar',
				controller: 'ConfirmDeleteCtrl',
				templateUrl: '/templates/dialogs/confirm-delete.html',
				fullscreen: false,
				clickOutsideToClose: true,
				multiple: true,
			};

			var Config = angular.extend(DefConfig, params);

			return $mdDialog.show({
				controller: Config.controller,
				templateUrl: Config.templateUrl,
				locals: { Config : Config },
				clickOutsideToClose: Config.clickOutsideToClose,
				fullscreen: Config.fullscreen,
				multiple: Config.multiple,
			});
		};






		return {};
  }
]);
angular.module('appRoutes', [])
.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 
	function($stateProvider, $urlRouterProvider, $httpProvider){
	
			$stateProvider
					.state('Login', {
						url: '/Login',
						templateUrl: '/Login',
						controller: 'LoginCtrl',
					})
					.state('Home', {
						url: '/Home',
						templateUrl: '/Home',
						controller: 'MainCtrl',
					})
					.state('Home.Section', {
						url: '/:section',
						templateUrl: function (params) { return '/Home/'+params.section; },
					})
					.state('Home.Section.Subsection', {
						url: '/:subsection',
						templateUrl: function (params) { return '/Home/'+params.section+'/'+params.subsection; },
					}).state('I', {
						url: '/I/:Informe',
						templateUrl: '/I'
					});

			$urlRouterProvider.otherwise('/Home');
			

			$httpProvider.interceptors.push(['$q', '$localStorage', 
				function ($q, $localStorage) {
					return {
						request: function (config) {
							config.headers = config.headers || {};
							if ($localStorage.token) {
								config.headers.token = $localStorage.token;
							}
							return config;
						},
						response: function (res) {
							return res || $q.when(res);
						},
						responseError: function(rejection) {
						  // do something on error

						  if ([400, 401].indexOf(rejection.status) !== -1) {
							var r = confirm("Su sesión expiró, por favor ingrese nuevamente");
							location.replace("/#/Login");
						  }

						  return $q.reject(rejection);
						}

					};
				}
			]);
	}
]);