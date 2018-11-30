<div id="PanelControl" flex layout=column md-theme="Valak" class="bg-black-1"
	ng-controller="PanelControl_PanelControlCtrl">
	
	<div layout>
		
		<span flex></span>
		<md-datepicker class="" ng-model="Filters.Fecha" md-max-date="Hoy"></md-datepicker>
		<md-button class="md-icon-button" aria-label="Button" ng-click="getControl()">
			<md-tooltip>Recargar</md-tooltip>
			<md-icon md-font-icon="fa-refresh fa-lg"></md-icon>
		</md-button>

	</div>

	<div flex layout class="overflow-y darkScroll">
		<div layout=column class="seam-right" flex=50>
			<div class="h20"></div>
			<div ng-repeat="U in ValidacionesControl" layout class="h30 padding-left">
				<span class="" md-truncate>{{ U.Usuario_Nombre }}</span>
				<span flex></span>
			</div>
		</div>

		<div flex layout=column class="padding-bottom-5">
			<div layout=column class="overflow-x darkScroll" style="min-height: 100%">
				<div layout>
					<div class="h20 w120 text-10pt text-clear hour_block" ng-repeat="H in Hours">{{ H.hour_12 + H.ampm }}</div>
				</div>

				<div ng-repeat="U in ValidacionesControl" class="h30" layout>

					<div layout class="relative padding-top-5">

						<!-- {{ U.Estados }} -->
						<div ng-repeat="E in U.Estados" class="h20 abs"
							ng-style="{ width: (E.dur_min * 2) + 'px', background: EstadosUsuario[E.Estado]['Color'], left: (E.pos_min - minStart) * 2 }">
								<md-tooltip>{{ E.Hora + ' - ' + E.Hora_Fin + ' ' + E.Estado }}</md-tooltip>
							</div>


					</div>
				</div>
			</div>
		</div>

	</div>

</div>

<style type="text/css">
.hour_block {
    box-shadow: inset 2px 0 0 #585858;
    padding-left: 7px;
    box-sizing: border-box;
}
</style>