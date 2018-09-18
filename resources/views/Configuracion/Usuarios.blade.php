<div flex ng-controller="Configuracion__UsuariosCtrl" layout=column>

	<div layout class="margin-but-bottom lh30">
		<md-icon md-font-icon="fa-user fa-lg fa-fw margin-right-5" style="margin-top: 2px"></md-icon>
		<span class="md-title">Usuarios</span>
		<span class="w30"></span>
		<div class="md-toolbar-searchbar h30 lh30" flex layout>
			<md-icon md-font-icon="fa-search"></md-icon>
			<input flex type="search" placeholder="Buscar..." ng-model="filterUsuarios">
		</div>

		<md-button class="md-raised md-primary no-margin h30 mh30 " aria-label="Button" ng-click="addUsuario({ ev: $event, theme: '<% config('app.theme') %>' })">
			<md-icon md-svg-icon="md-plus" class="margin-right"></md-icon>Nuevo
		</md-button>
	</div>

	<md-card flex layout=column>
		<md-table-container flex>
			<table md-table class="md-table-short">
				<thead md-head md-order="">
					<tr md-row>
						<th md-column md-order-by="Email">Correo</th>
						<th md-column md-order-by="Nombre">Nombre</th>
						<th md-column>Perfil</th>
						<th md-column></th>
					</tr>
				</thead>
				<tbody md-body>
					<tr md-row ng-repeat="U in UsuariosCRUD.rows | filter:filterUsuarios" class="md-row-hover md-pointer" ng-click="">
						<td md-cell class="md-cell-compress">{{ U.Email }}</td>
						<td md-cell class="">{{ U.Nombre }}</td>
						<td md-cell class="md-cell-compress">{{ UsuariosCRUD.columns[3].Options.options[U.perfil_id] }}</td>
						<td md-cell class="md-cell-compress">
							<md-button class="md-icon-button no-margin" aria-label="Button" ng-click="editUsuario(U, { ev: $event, theme: '<% config('app.theme') %>' })">
								<md-tooltip md-direction=left>Editar</md-tooltip>
								<md-icon md-svg-icon="md-edit"></md-icon>
							</md-button>
						</td>
					</tr>
				</tbody>
			</table>
		</md-table-container>
	</md-card>
	
</div>