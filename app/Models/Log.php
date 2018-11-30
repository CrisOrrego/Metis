<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    protected $table = 'logs';
	protected $guarded = ['id'];
	protected $appends = ['dur'];
	protected $casts = [
		'datos' => 'array'
	];

	//scopes
	public function scopeUsuario($q, $usuario_id)
	{
		return $q->where('usuario_id', $usuario_id);
	}

	public function scopeEntre($q, $Fechas)
	{
		$FIni = substr($Fechas[0], 0, 10);
		$FFin = substr($Fechas[1], 0, 10)." 23:59:59";

		return $q->where('created_at', '>=', $FIni)->where('created_at', '<=', $FFin);
	}

	public function scopeLlaves($q, $llaves)
	{
		return $q->whereIn('llave', $llaves);
	}

	public function scopeValor1($q, $valores)
	{
		return $q->whereIn('valor1', $valores);
	}

	public function scopeValor2($q, $valores)
	{
		return $q->whereIn('valor2', $valores);
	}

	public function scopeValor3($q, $valores)
	{
		return $q->whereIn('valor3', $valores);
	}

	public function getDurAttribute()
	{
		return $this->updated_at->diffInSeconds($this->created_at);
	}
}
