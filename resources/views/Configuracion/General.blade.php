<div flex layout>
	<span flex></span>
	<md-card flex=100 flex-gt-xs=80 flex-gt-sm=60 flex-gt-md=40 class="padding" layout=column>
		<div layout class="margin-bottom-20">
			<md-icon md-font-icon="fa-home fa-lg fa-fw margin-right-5" style="margin-top: 2px"></md-icon>
			<span flex class="md-title">Configuracion General</span>
		</div>
		

		<div flex layout=column class="overflow">
			
			<md-input-container class="md-no-underline">
				<input ng-model="Opts.APP_NAME" placeholder="Nombre Aplicacion" readonly>
			</md-input-container>

			<md-input-container class="md-no-underline">
				<input ng-model="Opts.APP_ROUTE" placeholder="Ruta de Acceso" readonly>
			</md-input-container>

			<div class="h50"></div>

		</div>

		<div layout hide>
			<span flex></span>
			<md-button class="md-raised md-primary no-margin" aria-label="Button" ng-click="saveOpts()">
				<md-icon md-font-icon="fa-save" class="margin-right"></md-icon>Guardar
			</md-button>
		</div>

	</md-card>
	<span flex></span>
</div>