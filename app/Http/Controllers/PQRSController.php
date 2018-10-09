<?php

namespace App\Http\Controllers;

error_reporting( E_ALL );
ini_set('display_errors', 1);
ini_set("memory_limit","4G");

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Models\PQRS;

class PQRSController extends Controller
{
    public function getPQRS($F)
    {
        $PQRS = PQRS::radicado($F['Fecha_Radicado'][0],$F['Fecha_Radicado'][1])
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
                   ->orderBy('Fecha_Respuesta', 'DESC');
        return $PQRS;
    }

    public function postIndex()
    {
        $F = request('filters');
    	$Q = request('query');

        $PQRSs = $this->getPQRS($F)->paginate($Q['limit'], ['*'], 'page', $Q['page']);
                       
    	return $PQRSs;
    }


    public function postCreateCsv()
    {
        $F = request('filters');
        $PQRSs = $this->getPQRS($F)->get();

        $uid = md5(serialize($F));

        $route = 'files/PQRS_'.$uid.'.csv';
        $file = fopen($route, 'w');
        $Headers = array_keys($PQRSs->first()->toArray());

        fputcsv($file, $Headers);

        foreach ($PQRSs as $row) {
            fputcsv($file, $row->toArray());
        };

        fclose($file);

        return $route;

        //return $PQRSs;
    }


}
