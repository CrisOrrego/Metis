<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Perfil extends Model
{
    protected $table = 'perfiles';
	protected $guarded = [ 'id' ];
	protected $primaryKey = 'id';
	protected $casts = [
		'Config' => 'json'
	];

	public function columns()
	{
		//Name, Desc, Type, Required, Unique, Default, Width, Options
		return [
			[ 'Titulo', 	 null, 	        'string', true, true ],
			[ 'Config', 	 null, 	        'string', true, true ],
		];
	}
}
