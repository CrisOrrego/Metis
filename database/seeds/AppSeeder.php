<?php

use Illuminate\Database\Seeder;

class AppSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
 


        //Usuarios
        DB::table('usuarios')->truncate();
        $Regs = [
            [ 'Email' => 'admin@strata', 'Nombre' => 'Administrador', 'Contraseña' => 1234, 'perfil_id' => 2 ],
            [ 'Email' => 'user@strata',  'Nombre' => 'Usuario General', 'Contraseña' => 1234, 'perfil_id' => 1 ]
        ];
        DB::table('usuarios')->insert($Regs);


        //Perfiles
        DB::table('perfiles')->truncate();
        $Regs = [
            [ 'Titulo' => 'Usuario General', 'Config' => '{"access_cubos":"N","access_cubos_list":[],"level_cubos":0,"level_paneles":0,"level_informes":0,"level_configuracion":0,"access_informes":"T","access_informes_list":[]}' ],
            [ 'Titulo' => 'Administrador',   'Config' => '{"access_cubos":"T","access_cubos_list":[],"level_cubos":3,"level_paneles":3,"level_informes":3,"level_configuracion":3,"access_informes":"T","access_informes_list":[]}' ],
        ];
        DB::table('perfiles')->insert($Regs);



    }
}


