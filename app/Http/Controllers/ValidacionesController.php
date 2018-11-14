<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Models\Usuario;
use App\Models\Validacion;
use App\Models\ValidacionesCausales;
use App\Models\ValidacionesComentario;
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


    public function prepVal($Validacion, $Usuario)
    {
        unset($Validacion['edad'], $Validacion['diascifin']);
        $Validacion['usuario_id'] = $Usuario['Id'];
        return $Validacion;
    }
        

    public function postCreate()
    {
        extract(request()->all()); //$Validacion

        $Usuario = $this->authenticate();
        $Validacion = $this->prepVal($Validacion, $Usuario);
        $Validacion['Ingreso'] = Carbon::now();
        $Validacion['Inicio'] = Carbon::now();

        $DaVal = Validacion::create($Validacion);

        addlog($Usuario['Id'], 'USUARIO.ESTADO', 'Validando', $DaVal->id, $DaVal->Estado);
        
        return Validacion::find($DaVal->id);

    }

    public function postSave()
    {
        extract(request()->all()); //$Estado, $Validacion

        //435654
        $ExistingVal = Validacion::where('Numero', $Validacion['Numero'])->where('id', '<>', $Validacion['id'])->first();
        if($ExistingVal) return response()->json([ 'Msg' => 'ERROR, Número de validación ya existe' ], 512);

        $Usuario = $this->authenticate();
        $Validacion = $this->prepVal($Validacion, $Usuario);

        $Validacion['usuario_id'] = $Usuario['Id'];
        $Validacion['Fin'] = ($Estado == 'Pendiente') ? null : Carbon::now();
        $Validacion['Estado'] = $Estado;

        $DaVal = Validacion::where('id', $Validacion['id'])->first();
        $DaVal->fillit($Validacion);
        $DaVal->save();

        addlog($Usuario['Id'], 'USUARIO.ESTADO', 'Activo', $DaVal->id, $Estado);

        return $DaVal;
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
            'Comentario' => $newComment
        ]);



        return ValidacionesComentario::find($newComment->id);
    }

}
