<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCubosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cubos', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('servidor_id');
            $table->string('Nombre');
            $table->string('Descripcion')->nullable();
            $table->text('Consulta')->nullable();
            $table->text('Filtros')->nullable();
            $table->text('Columnas')->nullable();
            $table->nullableTimestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cubos');
    }
}
