<!doctype html>
<html lang="es" ng-app="App" ng-strict-di>

	<head>
		<meta charset="UTF-8">
		<title><% config('app.name') %></title>
		<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimal-ui">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="mobile-web-app-capable" content="yes">
		<link rel="icon" type="image/png" href="/imgs/Icon.png" />

		<link   rel="stylesheet"    href="/css/libs.min.css?20180612" />
		<link   rel="stylesheet"    href="<%  elixir('css/all.min.css') %>" />

		<script defer type="application/javascript" src="/js/libs.min.js?20180612"></script>
		<script defer type="application/javascript" src="<%  elixir('js/app.min.js') %>"></script>
	</head>
	

	<body layout>
		<div id='Main' ui-view flex layout>
			
			<div class="margin-20">
				<div  layout>
					<i class="fa-lg fa-fw fa fa-spinner fa-spin h30 w30 lh30 margin-right-5"></i>
					<span class="md-headline">Cargando...</span>
				</div>
			</div>

		</div>
	</body>

</html>