<div id="Login" flex layout layout-align="center center" style="background: #eaeaea" class="padding-20" >

	<md-card class="md-whiteframe-2dp margin margin-bottom-20 w350 border-radius" layout="column">
		<md-card-content class="no-padding" layout="column">
		
			<div layout="column" class="padding-20">
				<div>
					<span class="md-headline">Bienvenido</span>
				</div>
				<form id="Login_Form" name="Login_Form" ng-submit="Login()" layout="column" class="padding-top">

					<md-input-container class="md-icon-float">
						<md-icon md-font-icon="fa-user" class="fa-lg"></md-icon>
						<input placeholder="Correo" ng-model="User" required md-no-asterisk>
					</md-input-container>

					<span class="w15"></span>

					<md-input-container class="md-icon-float">
						<md-icon md-font-icon="fa-lock" class="fa-lg"></md-icon>
						<input placeholder="Contraseña" type="password" ng-model="Pass" required md-no-asterisk>
					</md-input-container>

					<div class="h20"></div>

					<div layout="column" class="">
						<md-button class="md-raised md-primary h45 no-margin" type='submit'>Ingresar</md-button>
					</div>

				</form>
			</div>
		</md-card-content>
	</md-card>

</div>