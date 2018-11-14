<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    protected $table = 'logs';
	protected $guarded = [ 'id' ];
	protected $casts = [
		'datos' => 'array'
	];
}
