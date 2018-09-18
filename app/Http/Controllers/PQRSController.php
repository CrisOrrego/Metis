<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Models\PQRS;

class PQRSController extends Controller
{
    public function postIndex()
    {
    	$F = request('filters');

    	$PQRSs = PQRS::radicado($F['Fecha_Radicado'][0],$F['Fecha_Radicado'][1])
    				   ->respuestadesde($F['Fecha_Respuesta'][0])
    				   ->respuestahasta($F['Fecha_Respuesta'][1])
					   ->formato($F['Formato'])
					   ->tipificacion($F['Tipificacion'])
					   ->subtipificacion($F['Subtipificacion'])
					   ->canal($F['Canal'])
					   ->favorabilidad($F['Favorabilidad'])
					   ->tipocre($F['Tipo_Cre'])
					   ->nombre($F['Nombre'])
					   ->nrocredito($F['Nro_Credito'])
					   ->descripcion($F['Descripcion'])
    				   ->orderBy('Fecha_Radicado', 'DESC')
    				   ->orderBy('Fecha_Respuesta', 'DESC')
    			 	   ->get();

    	return $PQRSs;
    }
}
