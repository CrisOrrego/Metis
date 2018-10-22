<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Functions\CRUD;

use App\Models\Usuario;
use Crypt;
use Illuminate\Support\Facades\Hash;

class UsuariosController extends Controller
{
    public function postUsuarios()
    {
        $CRUD = new CRUD('App\Models\Usuario');
        return $CRUD->call(request()->fn, request()->ops);
    }

    public function postPerfiles()
    {
        $CRUD = new CRUD('App\Models\Perfil');
        return $CRUD->call(request()->fn, request()->ops);
    }

    public function postLogin()
    {
        $User = trim(strtolower(request()->User));
        $Pass = request()->Pass;

        $Usuario = Usuario::where('Email', $User)->first();

        //return [ $Usuario->exists(), Hash::check($Pass, $Usuario['Contraseña']) ];

        if($Usuario->exists() AND Hash::check($Pass, $Usuario['Contraseña'])){
            return [
                'status' => 200,
                'data' => Crypt::encrypt($Usuario->Id)
            ];
        }else{
            return [
                'status' => 512,
                'data' => [ 'Msg' => 'Error en correo o contraseña' ]
            ];
        };

    }



    public function postCheckToken()
    {
    	//Obtener token
        $token = request()->header('token');
        
        if(!$token){
            return response()->json(['Msg' => 'No autorizado'], 400);
        }else{
            $token = Crypt::decrypt($token);

            //Obtener el Usuario
            $Usuario = Usuario::where('Id', $token)->first();
            if(!$Usuario) return response()->json(['Msg' => 'No autorizado'], 400);

            $Secciones = $this->getSecciones($Usuario);

        	$Opts = [
        		'APP_NAME'  => config('app.name'),
        		'APP_ROUTE' => config('app.route'),
        	];

        	return compact('Usuario', 'Secciones', 'Opts');
        }
    }

    public function getSecciones($Usuario)
    {
        $Secciones = [
            'PQRS'          =>  [ 'No' => 0, 'Icono' => 'fa-commenting',    'Nombre' => 'Reporte de PQRS'  ],
            'InformeBI'     =>  [ 'No' => 1, 'Icono' => 'fa-area-chart',    'Nombre' => 'Informe Power BI'  ],
            'Configuracion' =>  [ 'No' => 2, 'Icono' => 'fa-cog',           'Nombre' => 'Configuración'  ],
        ];

        return $Secciones;
    }



}
