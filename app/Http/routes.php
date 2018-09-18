<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', 			  				'MainController@getBase');
Route::get('/Login', 		  				'MainController@getLogin');
Route::get('/Site', 		  				'MainController@getSite');
Route::get('/Home', 		  				'MainController@getHome');
Route::get('/Home/{section}', 				'MainController@getSection');
Route::get('/Home/{section}/{subsection}',  'MainController@getSubsection');
Route::get('/Frag/{fragment}',  			'MainController@getFragment');
Route::get('/ping', function(){ return 'OK'; });
Route::get('/phpinfo', function(){ return phpinfo(); });

Route::get('/pass/{pass}', 		  			'MainController@getPass');

Route::controller('/api/Main',				'MainController');
Route::controller('/api/Usuarios',			'UsuariosController');
Route::controller('/api/PQRS',				'PQRSController');

// Avoid conflicts with AngularJS.
Blade::setContentTags('<%', '%>'); // For variables and all things Blade.
Blade::setEscapedContentTags('<%%', '%%>'); // For escaped data.

