<div id="PQRS" flex ng-controller="PQRS__PQRSCtrl" layout>
	

	  <md-sidenav md-component-id="PQRSNav" class="w300 margin-but-right border-radius padding-top"
	  	md-is-locked-open="true"
	  	md-whiteframe="1">

		<md-subheader class="md-primary md-subheader-compact">Filtros</md-subheader>

		<md-content flex layout="column" class="overflow-y darkScroll padding-but-bottom fixInputContainers">

			<span class="md-label margin-bottom-5">Fecha Radicado</span>
			<div class="margin-bottom" layout>
				<md-datepicker class="twinFix" ng-model="filters.Fecha_Radicado[0]" md-placeholder="Desde" md-open-on-focus md-max-date="Hoy"></md-datepicker>
				<md-datepicker class="twinFix" ng-model="filters.Fecha_Radicado[1]" md-placeholder="Hasta" md-open-on-focus md-max-date="Hoy"></md-datepicker>
			</div>

			<span class="md-label margin-bottom-5">Fecha Respuesta</span>
			<div class="margin-bottom" layout>
				<md-datepicker class="twinFix" ng-model="filters.Fecha_Respuesta[0]" md-placeholder="Desde" md-open-on-focus md-max-date="Hoy"></md-datepicker>
				<md-datepicker class="twinFix" ng-model="filters.Fecha_Respuesta[1]" md-placeholder="Hasta" md-open-on-focus md-max-date="Hoy"></md-datepicker>
			</div>

			<md-input-container>
				<label>Formato</label>
				<md-select ng-model="filters.Formato" aria-label="S">
					<md-option ng-value="false">Cualquiera</md-option>
					<md-option ng-value="378">378</md-option>
					<md-option ng-value="379">379</md-option>
					<md-option ng-value="'N/A'">N/A</md-option>
				</md-select>
			</md-input-container>

			<md-input-container>
				<label>Tipificación</label>
				<md-select ng-model="filters.Tipificacion" aria-label="S" ng-change="filters.Subtipificacion = false">
					<md-option ng-value="false">Cualquiera</md-option>
					<md-option value="PRENDAS">Prendas</md-option>
					<md-option value="ABONOS_A_CAPITAL">Abonos a Capital</md-option>
					<md-option value="SALDO">Saldo</md-option>
					<md-option value="PAGOS">Pagos</md-option>
				</md-select>
			</md-input-container>

			<md-input-container ng-show="filters.Tipificacion">
				<label>Subtipificación</label>
				<md-select ng-model="filters.Subtipificacion" aria-label="S">
					<md-option ng-value="false">Cualquiera</md-option>
					<md-option ng-repeat="O in Subtipificaciones" ng-value="O">{{ O }}</md-option>
				</md-select>
			</md-input-container>

			<md-input-container>
				<label>Canal</label>
				<md-select ng-model="filters.Canal" aria-label="S">
					<md-option ng-value="false">Cualquiera</md-option>
					<md-option ng-repeat="O in Canales" ng-value="O">{{ O }}</md-option>
				</md-select>
			</md-input-container>

			<md-input-container>
				<label>Favorabilidad</label>
				<md-select ng-model="filters.Favorabilidad" aria-label="S">
					<md-option ng-value="false">Cualquiera</md-option>
					<md-option ng-repeat="O in Favorabilidad" ng-value="O">{{ O }}</md-option>
				</md-select>
			</md-input-container>

			<md-input-container hide>
				<input ng-model="filters.Tipo_cre" placeholder="Tipo CRE">
			</md-input-container>

			<md-input-container>
				<input ng-model="filters.Nombre" placeholder="Nombre">
			</md-input-container>

			<md-input-container>
				<input ng-model="filters.Nro_Credito" placeholder="No. Credito">
			</md-input-container>

			<md-input-container>
				<input ng-model="filters.Descripcion" placeholder="Descripción">
			</md-input-container>

			


			<div class="h50"></div>
			<md-button ng-click="resetFilters()" class="no-margin md-warn">Borrar Filtros</md-button>

		</md-content>

		<md-button class="md-primary md-raised" ng-click="getRows(true)">
			<md-icon md-font-icon="fa-search fa-fw margin-right"></md-icon>Buscar
		</md-button>

	  </md-sidenav>

		<div flex layout=column class="margin" ng-show="firstLoad">

			<div layout class="margin-bottom-5">
				<span class="md-title lh30 margin-left-5" flex>PQRS</span>
				<md-button class="md-raised no-margin h30 mh30 lh30" aria-label="b" ng-click="downloadCSV()" ng-show="!downloadUrl">
					<md-icon ng-if="!creatingCSV" md-font-icon="fa-download fa-fw margin-right-5"></md-icon>
					<md-icon ng-if="creatingCSV" md-font-icon="fa-spinner fa-spin fa-fw margin-right-5"></md-icon>
					<span ng-if="!creatingCSV">Descargar ({{ Rows.total | number }})</span>
					<span ng-if="creatingCSV">Creando Archivo...</span>
				</md-button>
				<md-button class="md-primary md-raised no-margin h30 mh30 lh30" aria-label="b" ng-href="{{ downloadUrl }}" download="PQRS.csv" ng-show="downloadUrl">
					<md-icon md-font-icon="fa-download fa-fw margin-right-5"></md-icon>
					Descargar Archivo
				</md-button>
			</div>

			<md-card flex class="border-radius no-margin" layout=column>

				<div flex layout layout-align="center center" ng-show="loading">
					<md-progress-circular md-mode="indeterminate"></md-progress-circular>
					<h3 class="md-display-2 margin-left-20">Cargando...</h3>
				</div>

				<md-table-container flex class="" ng-show="!loading">
					<table md-table class="md-table-short border-bottom">
						<thead md-head md-order="orderBy">
							<tr md-row>
								<th md-column ng-repeat="(k,V) in Headers">{{ V }}</th>
							</tr>
						</thead>
						<tbody md-body>
							<tr md-row ng-repeat="Row in Rows.data" class="md-row-hover">
								<td md-cell class="md-cell-compress" ng-repeat="(k,V) in Row">{{ V }}</td>
							</tr>
						</tbody>
					</table>
				</md-table-container>

				<md-table-pagination md-limit="query.limit" md-limit-options="limitOps" md-page="query.page" md-total="{{ Rows.total }}" md-on-paginate="prepPag" md-page-select></md-table-pagination>
				
			</md-card>

		</div>

		

		<pre hide>{{ filters | json }}</pre>


</div>