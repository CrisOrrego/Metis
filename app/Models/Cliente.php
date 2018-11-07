<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Core\MyModel;
use Carbon\Carbon;

class Cliente extends MyModel
{
	protected $table = 'clientes';
	protected $guarded = [ 'id' ];
	protected $appends = [ 'edad' ];

	public function getEdadAttribute()
	{
		return Carbon::parse($this->FechaNacimiento)->age;
	}
}
