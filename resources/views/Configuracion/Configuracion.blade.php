<div flex layout ngs-controller="ConfiguracionCtrl">

	<div class="rounded-well w230 margin">
		
		<md-list class="no-padding">
			<md-list-item ng-repeat="Sub in Subsecciones" layout ng-click="navTo('Home.Section.Subsection', { subsection: Sub.url })"
				ng-class="{ 'bg-darkgrey': Sub.url == State.route[3] }">
				<md-icon md-font-icon="{{ Sub.Icon }}" class="fa-fw fa-lg margin-right-20"></md-icon>
				<span flex class="text-bold">{{ Sub.Titulo }}</span>
			</md-list-item>
		</md-list>

	</div>

	<div flex ui-view layout></div>

</div>