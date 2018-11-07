<md-dialog md-theme="Valak" class="vh95 bg-black-1">
	
	<md-toolbar class="md-short" md-theme="Transparent">
		<div class="md-toolbar-tools" layout>
			<h3 class="md-headline">{{ new ? 'Nueva Validación' : ('Validación No. '+Val.id) }}</h3>
			<span flex></span>
			<md-button class="md-icon-button" aria-label="b" ng-click="Cancel()" ng-show="!new && Val.Estado !== 'Pendiente'">
				<md-icon md-svg-icon="md-close"></md-icon>
			</md-button>
		</div>
	</md-toolbar>

	<div layout flex class="padding-bottom">
		
		<div layout=column class="mw400 overflow-y padding-0-10">
			
			<md-subheader class="md-subheader-compact">Cliente</md-subheader>

			<div class="" layout>
				<md-icon md-font-icon="margin-right-5 margin-left-5 fa-building" 	ng-if="Cliente.TipoDoc == 'NIT'"></md-icon>
				<md-icon md-font-icon="margin-right-5 margin-left-5 fa-user" 		ng-if="Cliente.TipoDoc !== 'NIT'"></md-icon>
				<md-select ng-model="Cliente.TipoDoc" class="no-margin no-padding" aria-label="s" ng-readonly="!new">
					<md-option ng-repeat="Op in TiposDoc" ng-value="Op">{{ Op }}</md-option>
				</md-select>
				<md-input-container class="no-margin no-padding" flex md-no-float>
					<input ng-model="Cliente.Doc" placeholder="Documento" class="h40 lh40" ng-readonly="!new">
				</md-input-container>
				<md-button class="md-icon-button no-margin" aria-label="b" ng-click="searchCliente()" ng-show="new">
					<md-icon md-svg-icon="md-search"></md-icon>
				</md-button>

			</div>

			<div layout=column ng-show="clienteSearched">
				
				<md-input-container class="no-margins no-padding">
					<input ng-model="Cliente.Nombre" placeholder="Nombre" class="h40 lh40">
				</md-input-container>

				<div layout ng-show="Cliente.TipoDoc !== 'NIT'">

					<md-input-container class="margin-top no-margin-bottom no-padding">
						<label>Fecha Nacimiento</label>
						<md-datepicker class="" ng-model="Cliente.FechaNacimiento" md-max-date="mimimumAge" md-current-view="year"
							ng-change="getEdad()"></md-datepicker>
					</md-input-container>

					<div class="md-input-container margin-left">
						<div>{{ Cliente.edad }} Años</div>
					</div>

				</div>

				<div class="md-title bg-red text-center padding-10-0 margin-bottom-20 border-radius"
					ng-show="(Cliente.edad > 69)">Alerta, cliente mayor a 69 años</div>

				<md-subheader class="md-subheader-compact">Caso</md-subheader>
				<md-autocomplete
					md-selected-item="CausalSel"
					md-search-text="searchText"
					md-selected-item-change="CausalSelChange(item)"
					md-item-text="item.Causal"
					md-items="item in searchCausales(searchText)"
					md-min-length="0"
					md-autoselect="true"
					md-select-on-match="true"
					placeholder="Causal">
					
					<md-item-template>
						<span md-highlight-text="searchText" md-highlight-flags="^i">{{item.Causal}}</span>
					</md-item-template>
					
					<md-not-found>"{{ctrl.searchText}}" no encontrada</md-not-found>
					
				</md-autocomplete>

			</div>

		</div>

		<div class="bg-black-2 padding-5 border-radius margin-right mw350" layout=column ng-show="!new && comentariosLoaded">
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
				<div ng-repeat="M in Comentarios" layout=column class="bg-black-1 padding-5 border-radius margin-5 w350">
					<div class="text-clear text-12px" layout>
						<span flex>{{ M.usuario.Nombre }}</span>
						<span>{{ M.created_at | dateformat:'YYYY-MM-DD hh:mma' }}</span>
					</div>
					<div class="margin-top-5 padding-5">{{ M.Comentario }}</div>
				</div>
			</div>
			


		</div>

	</div>

	<div layout class="" ng-show="new">
		<md-button class="" aria-label="b" ng-click="Cancel()">
			Cancelar
		</md-button>
		<span flex></span>
		<md-button class="md-raised md-danger" aria-label="b" ng-click="create()" ng-show="clienteSearched">
			<md-icon md-svg-icon="md-plus" class="margin-right"></md-icon>Crear
		</md-button>
	</div>

	<div layout class="" ng-show="!new && Val.Estado == 'Pendiente'">
		<md-button class="" aria-label="b" ng-click="save('Pendiente')">
			<md-icon md-font-icon="fa-pause" class="margin-right"></md-icon>Pausar
		</md-button>
		<span flex></span>
		<md-button class="md-raised w165 bg-red" aria-label="Button" ng-click="terminate('Devuelta')">
			<md-icon md-font-icon="fa-ban fa-lg" class="margin-right"></md-icon>Devuelta
		</md-button>
		<md-button class="md-raised w165 bg-green" aria-label="Button" ng-click="terminate('Avanzada')">
			<md-icon md-font-icon="fa-check fa-lg" class="margin-right"></md-icon>Avanzada
		</md-button>
	</div>

</md-dialog>