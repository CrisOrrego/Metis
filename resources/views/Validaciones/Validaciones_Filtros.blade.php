<md-input-container class="margin-bottom-5 margin-right margin-left">
	<label>Estado</label>
	<md-select ng-model="Estado">
		<md-option ng-repeat="Op in ['Pendientes', 'Avanzadas', 'Desembolsadas', 'Devueltas']" ng-value="Op">{{ Op }}</md-option>
	</md-select>
</md-input-container>

<md-input-container class="margin-bottom-5 margin-right margin-left">
	<label>Tipo de Cliente</label>
	<md-select ng-model="TipoCliente">
		<md-option ng-repeat="Op in ['Todos','Personas','Empresas']" ng-value="Op">{{ Op }}</md-option>
	</md-select>
</md-input-container>

<md-input-container class="no-margin-bottom">
	<label>Desde</label>
	<md-datepicker class="" ng-model="Desde" md-max-date="Hoy"></md-datepicker>
</md-input-container>

<md-input-container class="no-margin-bottom">
	<label>Hasta</label>
	<md-datepicker class="" ng-model="Hasta" md-max-date="Hoy"></md-datepicker>
</md-input-container>

<md-input-container class="margin-bottom-5 margin-right margin-left">
	<label>Causal</label>
	<md-select ng-model="CausalFilter">
		<md-option ng-value=false>Todas</md-option>
		<md-option ng-repeat="Op in Causales" ng-value="Op.id">{{ Op.Causal }}</md-option>
	</md-select>
</md-input-container>

<md-input-container class="margin-bottom-5 margin-right margin-left">
	<label>Número</label>
	<input ng-model="NumeroFilter"></input>
</md-input-container>


