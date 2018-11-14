<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ValidacionesCausales extends Model
{
    protected $table = 'validaciones_causales';
    protected $guarded = [ 'id' ];
    public $timestamps = false;
}
