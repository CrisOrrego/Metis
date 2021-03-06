<?php

namespace App\Models;

use App\Models\Core\MyModel;
use Carbon\Carbon;

class Validacion extends MyModel
{
    protected $table = 'validaciones';
    protected $guarded = [ 'id' ];
    public $timestamps = false;
    protected $with = ['causal'];
    protected $appends = ['edad', 'diascifin'];

    public function columns()
	{
		//Name, Desc, Type, Required, Unique, Default, Width, Options
		return [
			[ 'id',				'No',		null, true, true, null, 100 ],
			[ 'Inicio',			'Inicio',	null, true, false, null, 100 ],
			[ 'Fin',			'Fin',		null, true, false, null, 100 ],
		];
	}


	//scopes
	public function scopeUsuario($q, $usuario_id)
	{
		return $q->where('usuario_id', $usuario_id);
	}

	public function scopeEntre($q, $Fechas)
	{
		$FIni = substr($Fechas[0], 0, 10);
		$FFin = substr($Fechas[1], 0, 10)." 23:59:59";

		return $q->where('Inicio', '>=', $FIni)->where('Inicio', '<=', $FFin);
	}

	public function scopeEstado($q, $EstadoF)
	{
		if($EstadoF == 'Pendientes'){ 		$Estado = 'Pendiente'; }
		if($EstadoF == 'Avanzadas'){ 		$Estado = 'Avanzada'; }
		if($EstadoF == 'Devueltas'){ 		$Estado = 'Devuelta'; }
		if($EstadoF == 'Desembolsadas'){ 	$Estado = 'Desembolsada'; }
		if($EstadoF == 'Inactivas'){ 		$Estado = 'Inactiva'; }

		return $q->where('Estado', $Estado);
	}

	public function scopeTipocliente($q, $TipoClienteF)
	{
		if($TipoClienteF == 'Todos'){
			return $q;
		}else if($TipoClienteF == 'Empresas'){
			return $q->where('TipoDoc', 'NIT');
			//return $q->whereHas('cliente', function($c){});
		}else if($TipoClienteF == 'Personas'){
			return $q->where('TipoDoc', 'NOT LIKE', 'NIT');
			/*return $q->whereHas('cliente', function($c){
			    $c->where('TipoDoc', 'NOT LIKE', 'NIT');
			});*/
		};
	}

	public function scopeCausal($q, $causal_id)
	{
		if(!$causal_id) return $q;
		return $q->where('causal_id', $causal_id);
	}

	public function scopeTipo($q, $tipo)
	{
		if(!$tipo) return $q;
		return $q->where('Tipo', $tipo);
	}

	public function scopeNumero($q, $numero)
	{
		if(!$numero OR $numero == '') return $q;
		return $q->where('Numero', $numero);
	}



	//relations
	public function causal()
	{
		return $this->hasOne('App\Models\ValidacionesCausales', 'id', 'causal_id');
	}



	//Attributes
	public function getEdadAttribute()
	{
		return Carbon::parse($this->FechaNacimiento)->age;
	}

	public function getDiascifinAttribute()
	{
		return Carbon::parse($this->FechaCifin)->diffInDays();
	}

}
