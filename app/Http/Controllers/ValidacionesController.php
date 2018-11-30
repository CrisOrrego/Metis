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
use App\Models\Log;

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


    public function prepVal($Validacion, $Usuario, $update_user = true)
    {
        unset($Validacion['edad'], $Validacion['diascifin']);
        if($update_user){ $Validacion['usuario_id'] = $Usuario['Id']; };
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
        $Validacion = $this->prepVal($Validacion, $Usuario, false);

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

    public function postUsuarioStatus()
    {
        $Usuario = $this->authenticate();
        $Hoy = Carbon::today()->toDateString();
        $s = [
            'ValidacionesAvanzadas' => 0,
            'ValidacionesDevueltas' => 0,
            'Validaciones' => 0
        ];

        $s['Validaciones'] = Validacion::usuario($Usuario['Id'])->entre([$Hoy, $Hoy])->count();

        $EstadosActivos = Log::usuario($Usuario['Id'])->entre([$Hoy, $Hoy])->llaves(['USUARIO.ESTADO'])->valor1(['Activo','Validando'])->get();  

        foreach ($EstadosActivos as $EA) {
            if($EA['valor1'] == 'Activo'){
                if($EA['valor3'] == 'Avanzada') $s['ValidacionesAvanzadas'] ++;
                if($EA['valor3'] == 'Devuelta') $s['ValidacionesDevueltas'] ++;
            };
        };


        $s['Validaciones'] = $s['ValidacionesAvanzadas'] + $s['ValidacionesDevueltas'];
        $s['Segs_Activo'] = $EstadosActivos->sum('dur');

        //Añadir el último Activo
        $LastActivo = $EstadosActivos->last();
        if($LastActivo->dur == 0){
            $s['Segs_Activo'] += Carbon::now()->diffInSeconds($LastActivo->created_at);
        };


        $s['Horas_Activo'] = $s['Segs_Activo'] / (60 * 60);

        $s['LastActivo']     = $LastActivo;
        $s['EstadosActivos'] = $EstadosActivos;

        return $s;
    }




    public function postControl()
    {
        $F = request('Filters');
        $F['Fecha'] = Carbon::parse($F['Fecha'])->format('Y-m-d');

        $Usuarios = Usuario::all()->keyBy('Id');
        $Tonight = Carbon::parse($F['Fecha']);
        $HStart  =  7 * 60 * 60;
        $HEnd    = 21 * 60 * 60;

        $Control = Log::entre([$F['Fecha'], $F['Fecha']])->llaves(['USUARIO.ESTADO'])->whereNotIn('valor1', ['_OFFLINE'])->get()
                    ->groupBy('usuario_id')->transform(function($ES) use ($Usuarios, $Tonight, &$HStart, &$HEnd){
                        $usuario_id = $ES[0]['usuario_id'];
                        $U = [
                            'usuario_id' => $usuario_id,
                            'Usuario_Nombre' => $Usuarios[$usuario_id]['Nombre'],
                            'Usuario_Email' => $Usuarios[$usuario_id]['Email'],
                            'EstadoAct' => null,
                            'Estados' => $ES->transform(function($E) use ($Tonight, &$HStart, &$HEnd){

                                $r = [
                                    'id'         => $E['id'],
                                    'created_at' => $E['created_at']->format('Y-m-d h:ma'),
                                    'Hora'       => $E['created_at']->format('h:ma'),
                                    'Hora_Fin'   => $E['updated_at']->format('h:ma'),
                                    'Estado'     => $E['valor1'],
                                    'pos'        => $E->created_at->diffInSeconds($Tonight),
                                    'dur'        => $E['dur'],
                                ];

                                $r['dur_min'] = max(floor($r['dur'] / 60),1);
                                $r['pos_min'] = floor($r['pos'] / 60);

                                $HStart = min($HStart, $r['pos']);
                                $HEnd   = max($HEnd,   ($r['pos'] + $r['dur']));

                                return $r;
                            }),
                        ];

                        return $U;

                    })->values();

        $HStart = floor($HStart / (60 * 60));
        $HEnd   = ceil( $HEnd   / (60 * 60));
        $Hours = [];
        for ($i=$HStart; $i < $HEnd; $i++) { 
            $Hours[] = [
                'hour' => $i,
                'hour_12' => ($i > 12) ? ($i-12) : $i,
                'ampm' => ($i > 11) ? 'pm' : 'am',
            ];
        };

        return [ $Control, $Hours ];

    }




}
