<?php 

namespace App\Functions;
use Carbon\Carbon;

class CRUD
{
	function __construct($ModelName)
	{
		$this->Model = app($ModelName);
	}
	
	public function call($Fn, $Ops)
	{
		return $this->{$Fn}($Ops);
	}

	//Obtener data del modelo
	public function data($Ops)
	{
		$columns = collect($this->Model->columns());
		$columns->transform(function($c){
			return [
				'Field'	   => $c[0],
				'Desc'	   => ( isset($c[1]) ? $c[1]  : $c[0] ),
				'Type'	   => ( isset($c[2]) ? $c[2]  : 'string' ),
				'Required' => ( isset($c[3]) ? $c[3]  : true ),
				'Unique'   => ( isset($c[4]) ? $c[4]  : false ),
				'Default'  => ( isset($c[5]) ? $c[5]  : null ),
				'Width'    => ( isset($c[6]) ? $c[6]  : 100 ),
				'Options'  => ( isset($c[7]) ? $c[7]  : null ),
			];
		});
		$name_arr = explode('\\', $this->Model->getMorphClass());
		$name = array_pop($name_arr);
		$primary_key = $this->Model->getKeyName();
		$ready = true;

		return compact('columns','name','primary_key','ready');
	}

	public function get($Ops)
	{
		$ops = $Ops['ready'] ? false : $this->data($Ops);
		$debug = [];

		$wheres = collect($Ops['where'])->values();
		$Query = $this->Model->limit($Ops['limit']);

		if(!empty($Ops['only_columns'])){
			$Ops['only_columns'][] = $Ops['primary_key'];
			$Query = $Query->select($Ops['only_columns']);
		};

		foreach ($wheres as $w) {
			$Query = $Query->where($w[0],$w[1],$w[2]);
		};
		$Query->limit($Ops['limit']);
		
		$debug = [];
		foreach ($Ops['query_scopes'] as $qs) {
			$Query = $Query->{$qs[0]}($qs[1]);
		};

		/*
		$debug['sql'] 			= $Query->toSql();
		$debug['sql_bindings'] 	= $Query->getBindings();
		$debug['attrs'] 		= $this->Model->getAttributes();
		*/

		$rows = $Query->get();

		if(!empty($Ops['run_fn'])){
			$Functions = $Ops['run_fn'];
			$rows->each(function($row) use ($Functions){
				foreach ($Functions as $Fn) {
					$row->{$Fn[0]}($Fn[1]);	
				};
			});
		};

		return compact('ops', 'rows', 'debug');
	}

	public function find($Ops)
	{
		$Elm = $this->Model->where($Ops['primary_key'], $Ops['find_id'])->first();
		if(!empty($Ops['run_fn'])){
			foreach ($Ops['run_fn'] as $Fn) { $Elm->{$Fn[0]}($Fn[1]); };
		};
		return $Elm;
	}

	public function add($Ops)
	{
		$New = $this->Model->create($Ops['obj']);
		if(!empty($Ops['run_fn'])){
			foreach ($Ops['run_fn'] as $Fn) { $New->{$Fn[0]}($Fn[1]); };
		};
		return $New;
	}

	public function update($Ops)
	{
		$data = $this->data($Ops);
		$primary_key = $data['primary_key'];

		//Prep fill
		$attributes = array_flip(collect($data['columns'])->pluck('Field')->toArray());
		$guarded = array_flip($this->Model->getGuarded());
		$Attrs = array_diff_key($attributes, $guarded);
        $Filler = array_intersect_key($Ops['obj'], $Attrs);
        
		$DaModel = $this->Model->where($primary_key, $Ops['obj'][$primary_key])->first();
		$DaModel->fill($Filler);
		$DaModel->save();
		return $DaModel;
	}

	public function delete($Ops)
	{
		$primary_key = $this->Model->getKeyName();
		$primary_keyval = $Ops['obj'][$primary_key];
		$DaModel = $this->Model->where($primary_key, $primary_keyval)->first();
		$DaModel->delete();
	}


}