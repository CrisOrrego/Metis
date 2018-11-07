<div flex ng-controller="Configuracion__PerfilesCtrl" layout=column>

	<div layout class="margin-but-bottom lh30">
		<md-icon md-font-icon="fa-id-card fa-lg fa-fw margin-right-5" style="margin-top: 2px"></md-icon>
		<span class="md-title">Perfiles</span>
		<span flex></span>
	</div>

	<div flex layout>
		
		<div class="well w300 border-radius margin" layout=column>
			<md-list flex class="no-padding">
				<md-list-item ng-repeat="P in PerfilesCRUD.rows | filter:filterPerfiles" ng-click="openPerfil(P)"
					ng-class="{ 'itemsel': P.id == PerfilSel.id }">
					<p ng-class="{ 'text-bold': P.id == PerfilSel.id }">{{ P.Titulo }}</p>
					<md-button hide class="md-icon-button md-secondary" style="margin-right: -10px" aria-label="Button" ng-click="editPerfil(P, { ev: $event, theme: '<% config('app.theme') %>' })">
						<md-icon md-svg-icon="md-edit"></md-icon>
					</md-button>
				</md-list-item>
			</md-list>
			<div layout class="padding-5">
				<div class="md-toolbar-searchbar margin-left h30 lh30" flex layout>
					<md-icon md-font-icon="fa-search"></md-icon>
					<input flex type="search" placeholder="Buscar..." ng-model="filterPerfiles">
				</div>
				<md-button class="md-icon-button no-margin no-padding h30 mh30 w30" aria-label="Button" ng-click="addPerfil({ ev: $event, theme: '<% config('app.theme') %>' })">
					<md-icon md-svg-icon="md-plus"></md-icon>
					<md-tooltip md-direction=right>Nuevo Perfil</md-tooltip>
				</md-button>
			</div>
		</div>

		<md-card flex class="no-margin-left overflow-y" layout="column" ng-show="PerfilSel">
			<div layout class="margin-bottom padding-left">
				<md-input-container class="no-margin lh40 h40" md-no-float>
					<input ng-model="PerfilSel.Titulo" placeholder="Titulo" class="md-title lh40 h40">
				</md-input-container>
				<span flex></span>
				<md-button class="md-raised md-primary" aria-label="Button" ng-click="savePerfil()">
					<md-icon md-font-icon="fa-save" class="margin-right"></md-icon>Guardar
				</md-button>
			</div>
			<div layout ng-repeat="(kS,S) in Apps" class="padding-0-10" ng-class="{ 'text-clear': PerfilSel.Config[kS] == 0 }">
				<md-icon md-font-icon="{{ S.Icono }} fa-fw fa-lg margin"></md-icon>
				<b class="margin-top">{{ S.Nombre }}</b>
				<span flex></span>
				<md-select ng-model="PerfilSel.Config[kS]" class="no-margin md-no-underline">
					<md-option ng-repeat="(N, Nivel) in Niveles" ng-value="{{N}}">
						<md-icon md-font-icon="{{ Nivel.Icono }} fa-fw"></md-icon>
						{{ Nivel.Nombre }}
					</md-option>
				</md-select>
			</div>
		</md-card>

	</div>
	
</div>