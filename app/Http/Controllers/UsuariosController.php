<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Functions\CRUD;

use App\Models\Usuario;
use Crypt;
use Illuminate\Support\Facades\Hash;
use DB;

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

        if($Usuario && Hash::check($Pass, $Usuario['Contraseña'])){
            addlog($Usuario->Id, 'USUARIO.LOGIN', 'Login');
            return Crypt::encrypt($Usuario->Id);
        }else{
            return response()->json(['Msg' => 'Error en correo o contraseña'], 512);
        };

    }


    public function postLogout()
    {
        $Usuario = request('Usuario');
        addlog($Usuario['Id'], 'USUARIO.LOGIN', 'Logout');
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
            $Usuario = Usuario::with('perfil')->where('Id', $token)->first();
            if(!$Usuario) return response()->json(['Msg' => 'No autorizado'], 400);

            $Secciones = $this->getSecciones($Usuario);

        	$Opts = [
        		'APP_NAME'  => config('app.name'),
        		'APP_ROUTE' => config('app.route'),
        	];

        	return compact('Usuario', 'Secciones', 'Opts');
        }
    }

    public function postApps()
    {
        return collect(DB::table('apps')->orderBy('Orden')->get())->keyBy('id');
    }

    public function getSecciones($Usuario)
    {
        $Perfil = $Usuario->perfil->Config;
        $Secciones = $this->postApps()->filter(function($S) use ($Perfil){
            
            //dd($Perfil);
            //return $kS == 'InformeBI';
            return (array_key_exists($S->id, $Perfil) AND $Perfil[$S->id] > 0);
        });



        /*$Secciones = [
            'PQRS'          =>  [ 'No' => 0, 'Icono' => 'fa-commenting',    'Nombre' => 'Reporte de PQRS'  ],
            'InformeBI'     =>  [ 'No' => 1, 'Icono' => 'fa-area-chart',    'Nombre' => 'Informe Power BI'  ],
            'Configuracion' =>  [ 'No' => 2, 'Icono' => 'fa-cog',           'Nombre' => 'Configuración'  ],
        ];*/

        return $Secciones;
    }



}
