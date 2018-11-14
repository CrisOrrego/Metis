<md-dialog md-theme="Valak" class="vh95 bg-black-1" flex=100 flex-gt-sm=60 >
	
	<md-toolbar class="md-short" md-theme="Transparent">
		<div class="md-toolbar-tools" layout>
			<h3 class="md-headline">{{ new ? 'Nueva Validación' : ('Validación No. '+Val.Numero) }}</h3>
			<span flex></span>
			<div class="text-16px border-rounded padding-5-10" ng-class="estadosVal[Val.Estado].color">{{ Val.Estado }}</div>
			<md-button class="md-icon-button" aria-label="b" ng-click="Cancel()" ng-show="!new && Val.Estado !== 'Pendiente'">
				<md-icon md-svg-icon="md-close"></md-icon>
			</md-button>
		</div>
	</md-toolbar>

	<div layout=column layout-gt-xs=row flex class="overflow-y" ng-show="!new">
		
		<div layout=column class="mw400 overflow-y hasScroll padding-0-10">

			<div layout>
				<md-input-container flex class="no-margin no-padding">
					<input ng-model="Val.Numero" placeholder="Número" class="h40 lh40">
				</md-input-container>
			</div>

			<div layout class="margin-top">
				<md-input-container class="margin-top-20 no-margin-bottom no-padding" flex>
					<label>Fecha Ingreso</label>
					<md-datepicker class="" ng-model="Val.Ingreso" md-max-date="Hoy"></md-datepicker>
				</md-input-container>
				<md-input-container>
					<label>Hora</label>
					<md-select ng-model="IngresoHora" ng-change="implodeIngresoDate()">
						<md-option ng-repeat="H in range(0,23)" ng-value="H">{{ H }}</md-option>
					</md-select>
				</md-input-container>
				<md-input-container>
					<label>Minuto</label>
					<md-select ng-model="IngresoMin" ng-change="implodeIngresoDate()">
						<md-option ng-repeat="M in range(0,59)" ng-value="M">{{ M }}</md-option>
					</md-select>
				</md-input-container>
			</div>

			<div class="margin-top" layout>
				<md-icon md-font-icon="margin-right-5 margin-left-5 fa-building" 	ng-if="Val.TipoDoc == 'NIT'"></md-icon>
				<md-icon md-font-icon="margin-right-5 margin-left-5 fa-user" 		ng-if="Val.TipoDoc !== 'NIT'"></md-icon>
				<md-select ng-model="Val.TipoDoc" class="no-margin no-padding" aria-label="s">
					<md-option ng-repeat="Op in TiposDoc" ng-value="Op">{{ Op }}</md-option>
				</md-select>
				<md-input-container class="no-margin no-padding" flex md-no-float>
					<input ng-model="Val.Doc" placeholder="Documento" class="h40 lh40">
				</md-input-container>
			</div>

			<div layout=column class="margin-top-20">

				<div layout ng-show="Val.TipoDoc !== 'NIT'">

					<md-input-container class="margin-top no-margin-bottom no-padding">
						<label>Fecha Nacimiento</label>
						<md-datepicker class="" ng-model="Val.FechaNacimiento" md-max-date="mimimumAge" md-current-view="year"
							ng-change="getEdad()"></md-datepicker>
					</md-input-container>

					<div class="md-input-container margin-left">
						<div>{{ Val.edad }} Años</div>
					</div>

				</div>

				<div layout=column ng-show="(Val.edad > 69)">
					<div class="md-title bg-red text-center padding-10-0 margin-bottom-20 border-radius">Alerta, cliente mayor a 69 años.</div>
					<md-input-container>
						<label>Seguro de Cuota</label>
						<md-select ng-model="Val.SeguroCuota">
							<md-option ng-repeat="(k,Op) in seguroCuotaOps" ng-value="k">{{ Op }}</md-option>
						</md-select>
					</md-input-container>
				</div>

				<div layout class="margin-top-20">
					<md-input-container class="no-margin-bottom" flex>
						<label>Tipo de Servicio</label>
						<md-select ng-model="Val.TipoVehiculo">
							<md-option ng-repeat="(k,Op) in tiposVehiculos" ng-value="k">{{ Op.Nombre }}</md-option>
						</md-select>
					</md-input-container>
					
					<md-input-container class="margin-top-20 no-margin-bottom no-padding">
						<label>Fecha Cifin</label>
						<md-datepicker class="" ng-model="Val.FechaCifin" md-max-date="Hoy" ng-change="getDiasCifin()"></md-datepicker>
					</md-input-container>
				</div>

				<div ng-show="blockCifin" 
					class="md-title bg-red text-center padding-10-0 margin-bottom-20 border-radius">Consulta CIFIN ({{ Val.diascifin }} días) no válida.</div>

				<div class="h30"></div>
				<md-subheader class="md-subheader-compact">Causal de Devolución</md-subheader>
				<md-autocomplete
					md-selected-item="CausalSel"
					md-search-text="searchText"
					md-selected-item-change="CausalSelChange(item)"
					md-item-text="item.Causal"
					md-items="item in searchCausales(searchText)"
					md-min-length="0"
					md-autoselect="true"
					md-select-on-match="true"
					placeholder="Ninguna">
					<md-item-template>
						<span md-highlight-text="searchText" md-highlight-flags="^i">{{item.Causal}}</span>
					</md-item-template>
					<md-not-found>"{{ctrl.searchText}}" no encontrada</md-not-found>
				</md-autocomplete>
				<div class="h40"></div>
				<pre hide>{{ Val | json }}</pre>

			</div>

		</div>

		<div class="bg-black-2 padding-5 border-radius margin-right" flex-gt-xs layout=column>
			<md-subheader class="md-subheader-compact">Comentarios</md-subheader>
			<div layout>
				<md-input-container class="no-margin" md-no-float flex>
					<textarea ng-model="newComment" placeholder="Agregar Comentario" rows="2"></textarea>
				</md-input-container>
				<md-button class="md-icon-button no-margin" aria-label="Button" ng-click="addComment()">
					<md-tooltip>Agregar Comentario</md-tooltip>
					<md-icon md-svg-icon="md-plus" class=""></md-icon>
				</md-button>
			</div>
			<div flex layout=column class="overflow-y hasScroll">
				<div ng-repeat="M in Comentarios" layout=column class="bg-black-1 padding-5 border-radius margin-5">
					<div class="text-clear text-12px" layout>
						<span flex>{{ M.usuario.Nombre }}</span>
						<span>{{ M.created_at | dateformat:'YYYY-MM-DD hh:mma' }}</span>
					</div>
					<div class="margin-top-5 padding-5">{{ M.Comentario }}</div>
				</div>
			</div>
			
		</div>

		

	</div>

	<div flex layout layout-align="center center" ng-show="new" class="margin-bottom-20">
		<md-progress-circular md-mode="indeterminate" class="margin-right-20"></md-progress-circular>
		<h3 class="md-title">Creando...</h3>
	</div>

	<div layout class="seam-top" ng-show="!new && Val.Estado !== 'Desembolsada'">
		<md-button class="" aria-label="b" ng-click="mark('Pendiente')" ng-show="canMarkPendiente">
			<md-icon md-font-icon="fa-pause" class="margin-right"></md-icon>Pausar
		</md-button>
		<span flex></span>
		<md-button class="w180 no-margin-left md-raised bg-red" aria-label="b" ng-click="terminate('Devuelta')" ng-show="canMarkDevuelta">
			<md-icon md-font-icon="fa-ban fa-lg" class="margin-right"></md-icon>Devolver
		</md-button>
		<md-button class="w180 no-margin-left md-raised bg-green" aria-label="b" ng-click="terminate('Avanzada')" ng-show="canMarkAvanzada">
			<md-icon md-font-icon="fa-check fa-lg" class="margin-right"></md-icon>Avanzar
		</md-button>
		<md-button class="w180 no-margin-left md-raised bg-gold" aria-label="b" ng-click="terminate('Desembolsada')" ng-show="canMarkDesembolsada">
			<md-icon md-font-icon="fa-money fa-lg" class="margin-right"></md-icon>Desembolsar
		</md-button>
	</div>

</md-dialog>