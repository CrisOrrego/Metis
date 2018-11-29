<?php
	//namespace App\Functions;
	
	if(!function_exists('touchlog')){
		function touchlog($usuario_id, $key)
		{
			$Last = App\Models\Log::where('usuario_id', $usuario_id)->where('llave', $key)->orderBy('id', 'DESC')->first();
			if($Last){ $Last->touch(); }
		}
	}

	if(!function_exists('addlog')){

		function addlog($usuario_id, $key, $val1 = null, $val2 = null, $val3 = null, $data = [])
		{
			touchlog($usuario_id, $key);

			return App\Models\Log::create([
				'usuario_id' => $usuario_id,
				'llave' => $key,
				'valor1' => $val1,
				'valor2' => $val2,
				'valor3' => $val3,
				'datos'  => $data
			]);
		}

	}

