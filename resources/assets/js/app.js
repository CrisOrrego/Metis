angular.module('App', [
	'ui.router',

	'ngStorage',
	'ngMaterial',
	'ngSanitize',

	'md.data.table',
	//'ngFileUpload',
	'angular-loading-bar',
	//'angularResizable',
	//'nvd3',
	'ui.utils.masks',
	//'as.sortable',
	'ngCsv',
	//'angular-clipboard',
	//'ui.ace',

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
	'SiteCtrl',
	'LoginCtrl',

	'PQRS__PQRSCtrl',
	
]);