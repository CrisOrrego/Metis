<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

use App\Functions\Opts;

class MainController extends Controller
{
    public function getBase(){  return view('Base'); }
    public function getSite(){  return view('Site'); }
    public function getLogin(){ return view('Login'); }
    public function getHome(){  return view('Home'); }

    public function openView($vista, $data)
    {
    	if (view()->exists($vista))
		{
			return view($vista, $data);
		}else{
			$resp = "<h2 class='md-display-1 margin'>$vista en desarrollo...</h2>";
			return $resp;
		}
    }

    public function GetSection($section)
	{
		$vista = "$section.$section";
		return $this->openView($vista, compact('section'));		
	}

	public function GetSubsection($section, $subsection)
	{
		$vista = implode('.', [$section, $subsection]);
		return $this->openView($vista, compact('section', 'subsection'));	
	}

	public function GetFragment($fragment)
	{
		return $this->openView($fragment, request()->all());
	}

	public function postSaveOpts()
	{
		$Opts = request()->Opts;
		return $Opts;
	}

	public function getPass($Pass)
	{
		return Hash::make($Pass);
	}

	public function log()
	{
		extract(request()->all());
		addlog($usuario_id, $key, $val1, $val2, $val3, $datos);
	}

	public function touch()
	{
		extract(request()->all());
		touchlog($usuario_id, $key);
	}


}
