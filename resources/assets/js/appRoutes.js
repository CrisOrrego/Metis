angular.module('appRoutes', [])
.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 
	function($stateProvider, $urlRouterProvider, $httpProvider){
	
			$stateProvider
				.state('Site', {
					url: '/Site',
					templateUrl: '/Site',
					controller: 'SiteCtrl',
				})
				.state('Login', {
					url: '/Login',
					templateUrl: '/Login',
					controller: 'LoginCtrl',
				})
				.state('Home', {
					url: '/Home',
					templateUrl: '/Home',
					controller: 'MainCtrl',
					resolve: {
						promiseObj:  function($http){
							return $http({method: 'POST', url: 'api/Usuarios/check-token'});
						},
						controller: function($rootScope, promiseObj){
							var Rs = $rootScope;
		
							Rs.Usuario 	= promiseObj.data.Usuario;
							Rs.Sections = promiseObj.data.Secciones;
							Rs.Opts 	= promiseObj.data.Opts;
						}
					},
				})
				.state('Home.Section', {
					url: '/:section',
					templateUrl: function (params) { return '/Home/'+params.section; },
				})
				.state('Home.Section.Subsection', {
					url: '/:subsection',
					templateUrl: function (params) { return '/Home/'+params.section+'/'+params.subsection; },
				});

			$urlRouterProvider.otherwise('/Site');
			

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
							//var r = confirm("Su sesión expiró, por favor ingrese nuevamente");
							//location.replace("/#/Login");
						  }

						  return $q.reject(rejection);
						}

					};
				}
			]);
	}
]);