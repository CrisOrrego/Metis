<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\Perfil;

class Usuario extends Model
{
    protected $table = 'usuarios';
	protected $guarded = [ 'Id' ];

	public function columns()
	{
		//Name, Desc, Type, Required, Unique, Default, Width, Options
		return [
			[ 'Email',		 'Correo', 		'email',  true, true ],
			[ 'Nombre', 	 null, 	        'string', true, false ],
			[ 'Contraseña',  null, 	        'string', true, false ],
		];
	}

	public function scopeLogeado($query)
	{
		$token = request()->header('token');
        if(!$token){
            return response()->json(['Msg' => 'No autorizado'], 400);
        }else{
            $token = \Crypt::decrypt($token);
			return $query->where('id', $token);
		}
	}
}
