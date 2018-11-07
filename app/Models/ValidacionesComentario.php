<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ValidacionesComentario extends Model
{
    protected $table = 'validaciones_comentarios';
    protected $guarded = [ 'id' ];
    protected $with = ['usuario'];



    //Relations
    public function usuario()
	{
		return $this->belongsTo('App\Models\Usuario')->select(['Id', 'Nombre', 'Email']);
	}
}
