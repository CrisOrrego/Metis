<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateServidorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('servidores', function (Blueprint $table) {
            $table->increments('id');
            $table->string('Nombre');
            $table->string('Tipo');
            $table->string('DSN')->nullable();
            $table->string('Host');
            $table->string('Database')->nullable();
            $table->string('Username')->nullable();
            $table->string('Password')->nullable();
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
        Schema::dropIfExists('servidores');
    }
}
