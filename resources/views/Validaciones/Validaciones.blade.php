<div id="Validaciones" flex layout=column ng-controller="Validaciones__ValidacionesCtrl" md-theme="Valak" class="bg-black-1">
	
	<md-toolbar class="md-short bg-black-1" >
		<div class="md-toolbar-tools" layout>

			<md-button class="" aria-label="Button" ng-click="filterNavOpen = !filterNavOpen" ng-disabled="EstadoUsuario !== 'Activo'">
				<md-icon md-font-icon="fa-filter" class="margin-right"></md-icon>{{ filterNavOpen ? 'Cerrar Filtros' : 'Abrir Filtros' }}
			</md-button>

			<span flex></span>
			<div style="margin-top: 0px" class="">
				<md-select ng-model="EstadoUsuario" aria-label="s" class="no-margin h40 md-no-underline" ng-change="estadoUsuarioChange()">
					<md-option ng-repeat="Op in EstadosUsuario" ng-value="Op.Nombre">
						<md-icon md-font-icon="fa-circle fa-fw margin-right-5" ng-style="{ color: Op.Color }"></md-icon>
						{{ Op.Nombre }}
					</md-option>
				</md-select>
			</div>
			<span flex></span>

			<md-button class="md-raised md-danger margin-0-10" aria-label="Button" ng-click="validacionDiag(null)" ng-disabled="EstadoUsuario !== 'Activo'">
				<md-icon md-svg-icon="md-plus" class="margin-right"></md-icon>Nueva
			</md-button>

		</div>
	</md-toolbar>

	<div flex layout class="relative" ng-show="EstadoUsuario == 'Activo'">
		
		<md-sidenav 
			md-is-locked-open="$mdMedia('gt-xs') && filterNavOpen" 
			md-is-open="filterNavOpen"
			class="bg-black-2 padding-5 overflow-y w250 border-radius margin-left margin-bottom">
			
			<div flex layout=column class="overflow-y darkScroll">
				@include('Validaciones.Validaciones_Filtros')
			</div>

			<div layout=column class="bg-black-2 seam-top padding-5">
				<md-button class="no-margin" aria-label="Button" ng-click="getValidaciones()">
					<md-icon md-font-icon="fa-filter" class="margin-right"></md-icon>Filtrar
				</md-button>
			</div>

		</md-sidenav>

		<div flex class="margin-right" layout=column>
			<md-table-container flex class="darkScroll" ng-show="!ValidacionesCRUD.ops.loading">
				<table md-table class="md-table-short md-table-dark">
					<thead md-head md-order="">
						<tr md-row>
							<th md-column></th>
							<th md-column>Estado</th>
							<th md-column>No</th>
							<th md-column>Ingreso</th>
							<th md-column>Inicio</th>
							<th md-column>Fin</th>
							<th md-column>Documento</th>
							<th md-column>Edad</th>
							<th md-column>Causal Devolución</th>
							<th md-column>Servicio</th>
							<th md-column>Fecha CIFIN</th>
							<th md-column>Días CIFIN</th>
						</tr>
					</thead>
					<tbody md-body>
						<tr md-row ng-repeat="Row in ValidacionesCRUD.rows" class="md-row-hover md-pointer">
							<td md-cell class="md-cell-compress">
								<md-button class="md-icon-button no-margin" aria-label="b" ng-click="validacionDiag(Row)">
									<md-tooltip>Editar</md-tooltip>
									<md-icon md-svg-icon="md-edit" class=""></md-icon>
								</md-button>
							</td>
							<td md-cell class="md-cell-compress">{{ Row.Estado }}</td>
							<td md-cell class="md-cell-compress">{{ Row.Numero }}</td>
							<td md-cell class="md-cell-compress">{{ Row.Ingreso | dateformat:'YYYY-MM-DD hh:mma' }}</td>
							<td md-cell class="md-cell-compress">{{ Row.Inicio | dateformat:'YYYY-MM-DD hh:mma' }}</td>
							<td md-cell class="md-cell-compress">{{ Row.Fin    | dateformat:'YYYY-MM-DD hh:mma' }}</td>
							<td md-cell class="md-cell-compress">
								<div class="w100p" layout>
									<md-icon md-font-icon="fa-lg fa-building" ng-if="Row.TipoDoc == 'NIT'"></md-icon>
									<md-icon md-font-icon="fa-lg fa-user" ng-if="Row.TipoDoc !== 'NIT'"></md-icon>
									<span flex>{{ Row.TipoDoc + ':' + Row.Doc }}</span>
								</div>
							</td>
							<td md-cell class="md-cell-compress"><span ng-if="Row.TipoDoc !== 'NIT'">{{ Row.edad }}</span></td>
							<td md-cell class="md-cell-compress">{{ Row.causal.Causal }}</td>
							<td md-cell class="md-cell-compress">{{ Row.TipoVehiculo }}</td>
							<td md-cell class="md-cell-compress">{{ Row.FechaCifin }}</td>
							<td md-cell class="md-cell-compress">{{ Row.diascifin }}</td>
						</tr>
					</tbody>
				</table>
				<div ng-show="!ValidacionesCRUD.ops.loading && ValidacionesCRUD.rows.length == 0" class="text-center padding">
					Sin registros
				</div>
				<div class="h50"></div>
			</md-table-container>

			<div layout layout-align="center" class="padding-5 text-10pt">
				<div class="info-bit">{{ UsuarioStatus.Validaciones }} Validaciones</div>
				<div class="info-bit">{{ UsuarioStatus.Segs_Activo | segstodate:'HH:mm' }} Tiempo Activo</div>
				<div class="info-bit">{{ UsuarioStatus.Validaciones / (UsuarioStatus.Horas_Activo) | number:1 }} Validaciones/Hora</div>
			</div>

			<div layout layout-align="center center" flex ng-if="ValidacionesCRUD.ops.loading" class="margin-top-20">
				<md-progress-circular md-mode="indeterminate" class="margin-right"></md-progress-circular>
				<h3 class="md-title">Cargando...</h3>
			</div>

		</div>


	</div>

	<div flex ng-show="EstadoUsuario !== 'Activo'" layout layout-align="center center">
		<div class="relative w200 h200">
			<md-progress-circular hide md-diameter="200" class="md-danger"></md-progress-circular>
			<md-icon md-font-icon="fa-circle-o-notch fa-spin" style="font-size: 200px;
			    position: absolute;
			    top: 80px;"></md-icon>
			<md-icon md-font-icon="fa-coffee" style="font-size: 100px;
			    position: absolute;
			    top: 80px;
			    left: 50px;"></md-icon>
		</div>
		
	</div>

</div>