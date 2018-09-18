<?php 

namespace App\Functions;

//use GuzzleHttp\Client;
use Carbon\Carbon;
use Cache;
use Crypt;
//use App\Functions\Opts;
//use App\Models\Conexion;


class DB2
{
	function __construct()
	{
		//$Ops = new Opts();
		//$Schema = $Ops->get()['Schema'];
		//$Schema = 1;
		//$Conn = Conexion::where('id', $Schema)->first();


		$this->op = [
			'remote_url' => 'http://149.56.134.112/test/',
			'host' 		=> config('app.DB2_IP'),
			'database' 	=> config('app.DB2_DB'),
			'user' 		=> config('app.DB2_USER'),
			'password' 	=> config('app.DB2_PASS'),
			'schema' 	=> config('app.DB2_DB'),
		];
		$this->user_id = false; //FIX
		$this->user = false;
		$this->time = new Carbon;
		$this->ws = request()->ip();
		$this->local_db2 = env('APP_DB2_LOCAL', true);
		/*$this->c = new Client([
			'headers' => [ 'content-type' => 'application/json' ],
		]);*/

		ini_set('max_execution_time', 180);

	}

	public function getDate(){ return $this->time->toDateString(); }
	public function getTime(){ return $this->time->format('his'); }
	public function getOp($Op){ return $this->op[$Op]; }

	public function getUser()
	{
		if($this->user) return $this->user;

		$token = request()->header('token');
        if($token){ $user_id = Crypt::decrypt($token); }else{ return response('', 400); };
        $schema = $this->getOp('schema');
        $query = "SELECT DESCRIUS FROM $schema.EVUSRGE FETCH FIRST 1 ROWS ONLY";
		$Usuario = $this->query($query);

		$this->user = $Usuario[0]['DESCRIUS'];
		return $this->user;
	}


	public function parseDateTime($Date, $Time)
	{
		$Time = str_pad($Time, 6, "0", STR_PAD_LEFT);
		$DateTime = Carbon::createFromFormat('Y-m-d His', "$Date $Time");
		return intval($DateTime->format('U'));
	}

	public function run($query, $type, $Numbers = [])
	{
		if(!$this->local_db2){
			$res = $this->c->post($this->op['remote_url'], [
				'json' => [ 'query' => $query ],
			]);
			if($res->getStatusCode() == 200){
				return json_decode($res->getBody());
			}
		}else{ //Local DB2
			$dsn_odbc = "DRIVER=iSeries Access ODBC Driver; SYSTEM=".$this->op['host']."; DBQ=".$this->op['database'];
			$conn = odbc_connect($dsn_odbc, $this->op['user'], $this->op['password']);

			$res = odbc_exec($conn, $query) or die(odbc_errormsg());
			//odbc_close($conn);
			if($type !== 'query') return 'OK';
			
			$r = [];
			while ($row = odbc_fetch_array($res)){
				
				$row = array_map('trim' , array_map('utf8_encode', $row));
				foreach ($Numbers as $Column) {
					$row[$Column] = intval($row[$Column]);
				};

				$r[] = $row;
			}
			

			return $r;
		}
	}

	public function comillas($k, $v, $FieldTypes)
	{		
		if(in_array($FieldTypes[$k]['DATA_TYPE'], ['NUMERIC'])){
			return $v;
		}else{
			return "'$v'";
		}
	}

	public function query($query, $numbers = [])
	{
		return $this->run($query, 'query', $numbers);
	}


	public function getFields($Table)
	{
		$Key = 'Types_'.$Table;
		Cache::flush();
		if(Cache::has($Key)) {
			return Cache::get($Key);
		}else{
			$schema = $this->getOp('schema');
			$query = "SELECT COLUMN_NAME, DATA_TYPE FROM QSYS2.SYSCOLUMNS WHERE TABLE_SCHEMA = '$schema' AND TABLE_NAME = '$Table' ";

			$Types = collect($this->run($query, 'query'))->keyBy('COLUMN_NAME');
			//print_r($Types);
			Cache::put($Key, $Types, (60 * 6));
			return $Types;
		}
	}


	public function insert($Vals, $Table)
	{
		$FieldTypes = $this->getFields($Table);
		//dd($FieldTypes);

		$Keys = array_keys($Vals);
		$Values = [];
		foreach ($Vals as $k => $v) {
			$Values[] = $this->comillas($k, $v, $FieldTypes);
		}
		$query = "INSERT INTO {$this->op['schema']}.$Table (".implode($Keys, ', ').") VALUES (".implode($Values, ", ").")";
		//dd($query);
		return $this->run($query, 'insert');
	}

	public function insertMulti($Vals, $Table)
	{
		/*$Keys = array_keys($Vals[0]);
		$query = "INSERT INTO {$this->op['schema']}.$Table (".implode($Keys, ', ').") VALUES ";
		$insArr = [];
		foreach ($Vals as $V) {
			$insArr[] = "('".implode($V, "', '")."')";
		}
		$query .= implode(', ',$insArr);
		return $this->run($query, 'insert');*/
		$errors = [];
		foreach ($Vals as $Val) {
			$ins = $this->insert($Val, $Table);
			if($ins !== 'OK'){
				$errors[] = $ins;
			}
		};
		return (count($errors) > 0) ? $errors : 'OK';
	}

	public function update($Vals, $Table, $Key, $KeyVal)
	{
		$Keys = [];
		$Values = [];
		$FieldTypes = $this->getFields($Table);

		$update = "UPDATE {$this->op['schema']}.$Table SET ";
		$keycond = " WHERE $Key = $KeyVal ";
		$assigs = [];
		foreach ($Vals as $k => $v) {
			if($k !== $Key){
				$Value = $this->comillas($k, $v, $FieldTypes);
				$assigs[] = "$k = $Value";
			}
		}

		$query = $update.implode(', ', $assigs).$keycond;
		//return response($query, 512);
		return $this->run($query, 'update');
	}


	public function delete($query)
	{
		return $this->run($query, 'delete');
	}


	public function log($Evento = '', $Detalle = '', $Tabla = '')
	{
		$Vals = [
			'CODUSRLG' => $this->user_id,
			'TABLALG' => $Tabla,
			'EVENTOLG' => $Evento,
			'DETALLELG' => $Detalle,
			'ESTADLG' => 'A',
			'USUARILG' => $this->user,
			'WSLG' => $this->ws,
			'FECHLG' => $this->getDate(),
			'HORALG' => $this->getTime(),
		];

		$LogTable = 'EVTRLOG';

		return $this->insert($Vals, $LogTable);
	}

}