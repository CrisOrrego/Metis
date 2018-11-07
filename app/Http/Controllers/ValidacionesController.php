<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Models\Usuario;
use App\Models\Validacion;
use App\Models\ValidacionesCausales;
use App\Models\ValidacionesComentario;
use App\Models\Cliente;
use Crypt;
use App\Functions\CRUD;
use Carbon\Carbon;

class ValidacionesController extends Controller
{
    public function postIndex()
    {
        $CRUD = new CRUD('App\Models\Validacion');
        return $CRUD->call(request()->fn, request()->ops);
    }

    public function postCausales()
    {
    	return ValidacionesCausales::get();
    }

    public function postSearchCliente()
    {
    	extract(request()->all());
    	$Cliente = Cliente::where('TipoDoc', $TipoDoc)->where('Doc', $Doc)->first();

    	if(!$Cliente){
    		return 'Not Found';
    	}else{
    		return $Cliente;
    	};
    }

    public function authenticate()
    {
        $token = request()->header('token');
        if(!$token){
            return response()->json(['Msg' => 'No autorizado'], 400);
        }else{
            $token = Crypt::decrypt($token);
            return Usuario::where('Id', $token)->first();
        };
    }

    public function saveCliente($Cliente)
    {
        //Crear o actualizar el cliente
        if($Cliente['id'] == null){
            unset($Cliente['edad']);
            $DaCliente = Cliente::create($Cliente);
        }else{
            $DaCliente = Cliente::where('id', $Cliente['id'])->first();
            $DaCliente->fillit($Cliente);
            $DaCliente->save();
        };

        return $DaCliente;
    }

    public function postCreate()
    {
        extract(request()->all()); //$Validacion, $Cliente

        $DaCliente = $this->saveCliente($Cliente);
        $Usuario = $this->authenticate();

        $Validacion['usuario_id'] = $Usuario['Id'];
        $Validacion['cliente_id'] = $DaCliente['id'];
        $Validacion['Estado'] = 'Pendiente';

        //Crear la atención
        $DaVal = Validacion::create($Validacion);

        return [ $DaVal, $DaCliente ];
    }

    public function postSave()
    {
        extract(request()->all()); //$mode, $Validacion, $Cliente

        $DaCliente = $this->saveCliente($Cliente);
        $Usuario = $this->authenticate();

        $Validacion['usuario_id'] = $Usuario['Id'];
        if($mode == 'Pendiente'){
            $Validacion['Fin'] = null;
        }else{
            $Validacion['Fin'] = Carbon::now();
        }

        $Validacion['Estado'] = $mode;

        $DaVal = Validacion::where('id', $Validacion['id'])->first();
        $DaVal->fillit($Validacion);

        $DaVal->save();

    }

    public function postComentarios()
    {
        extract(request()->all()); //$validacion_id
        return ValidacionesComentario::where('validacion_id', $validacion_id)->orderBy('created_at', 'DESC')->get();
    }

    public function postAddComentario()
    {
        extract(request()->all()); //$Validacion, $newComment
        $Usuario = $this->authenticate();
        $newComment = ValidacionesComentario::create([
            'usuario_id' => $Usuario['Id'],
            'validacion_id' => $Validacion['id'],
            'cliente_id' => $Validacion['cliente_id'],
            'Comentario' => $newComment
        ]);



        return ValidacionesComentario::find($newComment->id);
    }

}
