<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PQRS extends Model
{
	protected $table = 'pqrs';
	protected $guarded = [ 'Id' ];
	protected $hidden = [ 'Id' ];


	public function scopeRadicado($q, $Ini, $Fin)
	{
		if(!$Ini OR !$Fin) return $q;
		$Ini = substr($Ini, 0, 10);
		$Fin = substr($Fin, 0, 10);

		return $q->where('Fecha_Radicado', '>=', $Ini)->where('Fecha_Radicado', '<=', $Fin);
	}

	public function scopeRespuestadesde($q, $Ini)
	{
		if(!$Ini) return $q;
		$Ini = substr($Ini, 0, 10);
		return $q->where('Fecha_Respuesta', '>=', $Ini);
	}

	public function scopeRespuestahasta($q, $Fin)
	{
		if(!$Fin) return $q;
		$Fin = substr($Fin, 0, 10);
		return $q->where('Fecha_Respuesta', '<=', $Fin);
	}

	public function scopeFormato($q, $V){ 			if(!$V) return $q; return $q->where('Formato', $V); }
	public function scopeTipificacion($q, $V){ 		if(!$V) return $q; return $q->where('Tipificacion', $V); }
	public function scopeSubtipificacion($q, $V){ 	if(!$V) return $q; return $q->where('Subtipificacion', $V); }
	public function scopeCanal($q, $V){ 			if(!$V) return $q; return $q->where('Canal', $V); }
	public function scopeFavorabilidad($q, $V){ 	if(!$V) return $q; return $q->where('Favorabilidad', $V); }
	public function scopeTipocre($q, $V){ 			if(!$V) return $q; return $q->where('Tipo_Cre', 	'LIKE', "%$V%"); }
	public function scopeNombre($q, $V){ 			if(!$V) return $q; return $q->where('Nombre', 		'LIKE', "%$V%"); }
	public function scopeNrocredito($q, $V){ 		if(!$V) return $q; return $q->where('Nro_Credito', 	'LIKE', "%$V%"); }
	public function scopeDescripcion($q, $V){ 		if(!$V) return $q; return $q->where('Descripcion', 	'LIKE', "%$V%"); }


}
