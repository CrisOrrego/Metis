<div id="Home" flex layout="column" md-theme="<% config('app.theme') %>">
	
	<md-toolbar id="MainNav" class="md-short md-whiteframe-1dp bg-black-1">
		<div class="md-toolbar-tools padding-left" layout>

			<img src="/imgs/Logo.png" class="h25 margin-right-5" />
			<h3 class="md-headline margin-right text-thin" md-truncate hide>{{ Opts.APP_NAME }}</h3>

			<md-button class="md-icon-button" ng-click="navTo('Home')" ng-show="State.route.length > 2">
				<md-tooltip>Ir a Inicio</md-tooltip>
				<md-icon md-font-icon="fa-th fa-fw"></md-icon>
			</md-button>

			<span flex></span>

			<md-menu md-position-mode="target-right target" >
				<div class="Pointer" ng-click="$mdMenu.open()">
					<span class="md-subhead" hide-xs>{{ Usuario.Nombre }}</span>
					<md-icon md-font-icon="fa-user fa-fw margin-left" hide show-xs></md-icon>
					<md-icon md-svg-icon="md-chevron-down"></md-icon>
				</div>

				<md-menu-content width="3" class="no-padding no-overflow">
					<md-menu-item class="md-headline" style="padding: 10px 0 0 15px; margin-bottom:-30px;">{{ Usuario.Nombre }}</md-menu-item>
					<md-menu-item class="text-clear" style="margin-bottom:-10px;">
						<span class="text-clear">{{ Usuario.Email }}</span>
					</md-menu-item>
					<md-menu-item hide>
						<md-button ng-click="changePassword()">
							<md-icon md-font-icon="fa-key" class='fa-lg'></md-icon>Cambiar Contraseña
						</md-button>
					</md-menu-item>
					<md-menu-item>
						<md-button ng-click="Logout()">
							<md-icon md-font-icon="fa-power-off" class='fa-lg'></md-icon>Salir
						</md-button>
					</md-menu-item>
				</md-menu-content>

			</md-menu>
		</div>
	</md-toolbar>


	<div id='Section' ui-view flex layout>
		
		<div flex layout layout-align="center center" layout-wrap>
			
			<md-card class="Section_Card" layout=column ng-repeat="(k,S) in Sections" ng-click="navTo('Home.Section', { section: k })"
				md-ink-ripple>
				<md-icon md-font-icon="{{ S.Icono }} fa-fw"></md-icon>
				<span>{{ S.Nombre }}</span>
			</md-card>

		</div>

	</div>
	
</div>
