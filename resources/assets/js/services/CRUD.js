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
				add_append: 'end',
				add_research: false,
				add_with: false,
				query_scopes: [],
				query_with: [],
				order_by: [],
			};
			t.columns = [];
			t.rows = [];

			angular.extend(t.ops, ops);

			//console.info('Crud initiated', t.ops);

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
					return r;
				});
			};

			t.update = function(Obj){
				t.ops.obj = Obj;
				return Rs.http(t.ops.base_url, { fn: 'update', ops: t.ops }).then(function(r) {
					t.ops.obj = null;
					Rs.updateArray(t.rows, r, t.ops.primary_key);
					return r;
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

			//Poner un scope
			t.setScope = (Scope, Params) => {
				var Index = -1;
				angular.forEach(t.ops.query_scopes, ($S, $k) => {
					if($S[0] == Scope){ Index = $k; return; }
				});
				if(Index == -1){
					t.ops.query_scopes.push([ Scope, Params ]);
				}else{
					t.ops.query_scopes[Index] = [ Scope, Params ];
				};
			};


		};

		return {
			config: function (ops) {
				//console.log('Creating', ops);
				var DaCRUD = new CRUD(ops);
				return DaCRUD;
			}
		};
	}
]);