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