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
			if(!date || typeof date == 'undefined' || date === null || isNaN(date.getTime()) ){
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