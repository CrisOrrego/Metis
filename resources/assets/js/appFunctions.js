angular.module('appFunctions', [])
.factory('appFunctions', [ '$rootScope', '$http', '$mdDialog', '$mdSidenav', '$mdToast', '$q', '$state', '$location', '$filter', '$timeout',
	function($rootScope, $http, $mdDialog, $mdSidenav, $mdToast, $q, $state, $location, $filter, $timeout){

		var Rs = $rootScope;

		//State
		Rs.stateChanged = function(){
			Rs.State = $state.current;
			Rs.State.route = $location.path().split('/');
			Rs.State.tabSelected = 0;

			if(Rs.State.route.length > 2){
				if(Rs.Sections[Rs.State.route[2]]){
					Rs.State.tabSelected = Rs.Sections[Rs.State.route[2]]['No'];
				}else{
					$state.go('Login');
				}
			};

		};
		Rs.navTo = function(Dir, params){ 
			$timeout(()=> {
				$state.go(Dir, params);
			}, 300);
			
		};
		Rs.Refresh = function() { $state.go($state.current, $state.params, {reload: true}); };




		//Helpers
		Rs.def = function(arg, def) {
			return (typeof arg == 'undefined' ? def : arg);
		};

		Rs.range = function(min, max, step) {
			step = step || 1;
			var input = [];
			for (var i = min; i <= max; i += step) {
			    input.push(i);
			}
			return input;
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
			//console.log(needle, haysack, key);

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



		//Local Funcs
		Rs.downloadChart = (P) => {
            $Elm = $("#Panel_" + P.id + " svg");
            saveSvgAsPng($Elm[0], P.Titulo+".png");
            Rs.showToast('Descargando Gráfica');
        };

        const addCatData = (Cat, Arr, Data) => {
        	Arr.push(Cat.categoria);
        	if(Cat.children){
        		Cat.children.forEach((c) => {
        			myArr = angular.copy(Arr);
        			addCatData(c, myArr, Data);
        		});
        	}else{
        		Cat.valores.forEach((v) => { Arr.push(v); });
        		Data.push(Arr);
        	};
        };

        Rs.downloadData = (P) => {
        	
        	var Headers = [];
        	var Data = [];

        	console.log(P);
        	if(P.Tipo == 'Table'){
        		var Headers = P.Config.Columnas.map((C) => { return C.show });
        		var Data 	= P.Data;
        	}else if(P.Tipo == 'DataTable'){
        		P.Config.Agrupadores.forEach((A) => { Headers.push(A.show); });
        		P.Data.Columns.forEach((C) => { Headers.push(C.filter_val + ' ' + C.show); });
        		P.Data.Rows.forEach((R) => {
        			addCatData(R, [], Data);
        		});
        	}else if(P.Tipo == 'DataValue'){
        		Headers.push(P.Config.Valores[0].show);
        		Data.push([ P.Data.value ]);
        	}else if(P.Tipo == 'PieChart'){
        		Headers.push(P.Config.Agrupadores[0].show);
        		Headers.push(P.Config.Valores[0].show);
        		P.Data.forEach((D) => {
        			Data.push([ D.key, D.value ]);
        		});
        	}else if(P.Tipo == 'LineChart'){
        		Headers.push(P.Config.Columnas[0].show);
        		P.Data.Series.forEach((S) => { Headers.push(S.key); });
        		P.Data.ColumnaValues.forEach((C, kC) => {
        			var Row = []; Row.push(C);
        			P.Data.Series.forEach((S) => { Row.push(S.values[kC].y); });
        			Data.push(Row);
        		});
        	}else if(Rs.inArray(P.Tipo, ['BarChart', 'ColChart'])){
        		Headers.push(P.Config.Columnas[0].show);
        		var ColumnaValues = [];
        		P.Data.forEach((S, kS) => { 
        			Headers.push(S.key);
        			if(kS == 0){ S.values.forEach((v) => { ColumnaValues.push(v.x) }); };
        		});
        		ColumnaValues.forEach((C, kC) => {
        			var Row = []; Row.push(C);
        			P.Data.forEach((S) => { Row.push(S.values[kC].y); });
        			Data.push(Row);
        		});

        	};

        	//console.log(Headers, Data); return;

        	Rs.showToast('Descargando...');
        	Data.unshift(Headers);
        	Data = Data.map((Row) => { return JSON.stringify(Row); }).join("\n").replace(/(^\[)|(\]$)/mg, '');

        	//console.log(Data); return;

        	var content = new Blob([Data], { type: 'text/csv;charset=utf-8' });
        	var filename = P.Titulo+'.csv';
        	saveAs(content, filename);

        };



        Rs.log = (key, val1, val2, val3, datos) => {

			var val1 = Rs.def(val1, null);
			var val2 = Rs.def(val2, null);
			var val3 = Rs.def(val3, null);
			var datos = Rs.def(datos, []);

			var defLog = {
				usuario_id: Rs.Usuario.Id,
				key: key,
				val1: val1,
				val2: val2,
				val3: val3,
				datos: datos
			};

			return Rs.http('log', defLog);
		};

		Rs.touch = (key) => {
			return Rs.http('touch', { usuario_id: Rs.Usuario.Id, key: key });
		};




		return {};
  }
]);