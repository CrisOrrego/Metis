<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\Perfil;
use Hash;

class Usuario extends Model
{
    protected $table = 'usuarios';
	protected $guarded = [ 'Id' ];
	protected $primaryKey = 'Id';

	public function columns()
	{
		$Perfiles = Perfil::orderBy('Titulo')->get()->keyBy('id')->transform(function($P){
			return $P['Titulo'];
		});


		//Name, Desc, Type, Required, Unique, Default, Width, Options
		return [
			[ 'Email',		 	'Correo', 		'email',  true, true ],
			[ 'Nombre', 	 	null, 	        'string', true, false ],
			[ 'Contraseña',  	null, 	        'string', true, false ],
			[ 'Perfil_id',  	'Perfil', 	    'select', true, false,  null, 100, [ 'options' => $Perfiles ]],
		];
	}

	public function perfil()
	{
		return $this->belongsTo('\App\Models\Perfil', 'Perfil_id')->select(['id','Titulo','Config']);
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

	//Eventos
	public static function boot()
    {
		parent::boot();

		self::saving(function($model){
            
			$model->Contraseña = Hash::make($model->Contraseña);

        });


		self::created(function($model){
		});

    }

}
