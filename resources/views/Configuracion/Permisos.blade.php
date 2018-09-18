<div flex layout ng-controller="Configuracion__PermisosCtrl">
	
	<md-card class="w200 margin-10-0" layout=column>
		<md-subheader class=compact>Perfiles</md-subheader>
		<md-list class="no-padding overflow md-dense" flex>
			<md-list-item ng-repeat="P in PerfilesCRUD.rows | filter:PerfilSearch" ng-click="openPerfil(P)" class="mh30 h30" ng-class="{ itemsel: P.id == Perfil.id }">
				{{ P.Titulo }}
			</md-list-item>
		</md-list>
		<div layout class="bg-white">
			<md-input-container flex class="no-margin md-no-underline no-padding-bottom" md-no-float>
				<md-icon md-font-icon="fa-search text-clear" style="top: 9px;left: 11px;"></md-icon>
				<input ng-model="PerfilSearch" placeholder="Buscar" class="h40 no-padding no-margin">
			</md-input-container>
			<md-button class="md-icon-button no-margin" aria-label="Button" ng-click="addPerfil({ ev: $event, theme: '<% config('app.theme') %>' })">
				<md-tooltip md-direction="left">Agregar Perfil</md-tooltip>
				<md-icon md-svg-icon="md-plus"></md-icon>
			</md-button>
		</div>
	</md-card>

	<div flex layout=column class="padding" ng-show="Perfil !== null">
		<div layout class="margin-bottom">
			<md-icon md-font-icon="fa-id-card fa-lg fa-fw margin-right-5" style="margin-top: 6px"></md-icon>
			<md-input-container class="no-margin" flex>
				<input type="text" ng-model="Perfil.Titulo" class="md-title" aria-label="Titulo">
			</md-input-container>
			<md-button class="md-button no-margin md-raised md-primary mh30 h30 lh30" aria-label="Button" ng-click="savePerfil()">Guardar</md-button>
		</div>

		<md-card flex class="no-margin" layout>

			<div class="w250 border-right overflow darkScroll" layout="column">
				<md-subheader class="compact">Acceso Administradores</md-subheader>
				
				<md-list class="no-padding">
					<md-list-item class="padding-right-5">
						<p>Cubos</p>
						<md-select class="md-secondary no-margin md-no-underline" ng-model="Perfil.Config.level_cubos" aria-label="Select">
							<md-option ng-repeat="Op in AccessLevels" ng-value="Op.Level">{{ Op.Desc }}</md-option>
						</md-select>
					</md-list-item>
					<md-list-item class="padding-right-5">
						<p>Paneles</p>
						<md-select class="md-secondary no-margin md-no-underline" ng-model="Perfil.Config.level_paneles" aria-label="Select">
							<md-option ng-repeat="Op in AccessLevels" ng-value="Op.Level">{{ Op.Desc }}</md-option>
						</md-select>
					</md-list-item>
					<md-list-item class="padding-right-5">
						<p>Informes</p>
						<md-select class="md-secondary no-margin md-no-underline" ng-model="Perfil.Config.level_informes" aria-label="Select">
							<md-option ng-repeat="Op in AccessLevels" ng-value="Op.Level">{{ Op.Desc }}</md-option>
						</md-select>
					</md-list-item>
					<md-list-item class="padding-right-5">
						<p>Configuracion</p>
						<md-select class="md-secondary no-margin md-no-underline" ng-model="Perfil.Config.level_configuracion" aria-label="Select">
							<md-option ng-repeat="Op in AccessLevels" ng-value="Op.Level">{{ Op.Desc }}</md-option>
						</md-select>
					</md-list-item>
				</md-list>

				<md-divider></md-divider>

				<div layout=column class="padding-left-20 margin-top" ng-if="(Perfil.Config.level_cubos + Perfil.Config.level_paneles + Perfil.Config.level_informes) > 0">
					<div layout class="padding-right-5">
						<div class="lh30" flex>Qué Cubos</div>
						<md-select ng-model="Perfil.Config.access_cubos" class="no-margin md-no-underline" aria-label="Select">
							<md-option ng-repeat="(k,Op) in AccessOptions" ng-value="k">{{ Op[0] }}</md-option>
						</md-select>
					</div>
					<div layout=column class="" ng-hide="Perfil.Config.access_cubos !== 'A'">
						<div ng-repeat="S in Servidores" layout=column>
							<!-- Servidores -->
							<div layout>
								<md-icon md-font-icon="fa-server"></md-icon>
								<div class="lh30" flex>{{ S.Nombre }}</div>
							</div>
							<div layout=column class="padding-left">

								<div ng-repeat="C in S.cubos" layout=column>
									
									<!-- Cubos -->
									<div layout>
										<md-icon md-font-icon="fa-cube"></md-icon>
										<div class="lh30" flex>{{ C.Nombre }}</div>
										<md-checkbox ng-model="C.access" aria-label="Check" class="no-margin md-primary"></md-checkbox>
									</div>

								</div>

							</div>

						</div>
					</div>
				</div>
				

				<div class="h30"></div>

			</div>

			<div flex class="overflow darkScroll" layout=column>
				<md-subheader class="compact">Acceso Usuarios</md-subheader>

				<div layout=column class="padding-left-20 margin-top">
					<div layout class="padding-right-5">
						<div class="lh30" flex>Mis Informes</div>
						<md-select ng-model="Perfil.Config.access_informes" class="no-margin md-no-underline" aria-label="Select">
							<md-option ng-repeat="(k,Op) in AccessOptions" ng-value="k">{{ Op[0] }}</md-option>
						</md-select>
					</div>
					<div layout=column class="" ng-hide="Perfil.Config.access_informes !== 'A'">
						

						<div ng-repeat="I in Informes" layout=column>
							
							<!-- Cubos -->
							<div layout>
								<md-icon md-font-icon="fa-newspaper-o"></md-icon>
								<div class="lh30" flex>{{ I.Titulo }}</div>
								<md-checkbox ng-model="I.access" aria-label="Check" class="no-margin md-primary"></md-checkbox>
							</div>

						</div>

					</div>
				</div>

				
			</div>

		</md-card>

	</div>

</div>