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