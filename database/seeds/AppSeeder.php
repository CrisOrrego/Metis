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
        //Servidores
        /*DB::table('servidores')->truncate();
        $Regs = [ 
            [ 'Nombre' => 'local', 'Tipo' => 'mysql', 'DSN' => null, 'Host' => 'localhost', 'Database' => 'sakila', 'Username' => 'root', 'Password' => '1234' ],
        ];
        DB::table('servidores')->insert($Regs);




        //Cubos
        DB::table('cubos')->truncate();
        $Regs = [ 
            [
                'servidor_id' => 1, 'Nombre' => 'Clientes', 
                'Consulta' => "SELECT l.*, SUBSTR(l.country,1,1) AS Inicial FROM `customer_list` l", 
                'Filtros' => '[]', 
                'Columnas' => '[]' 
            ]
        ];
        DB::table('cubos')->insert($Regs);


        //Paneles
        DB::table('paneles')->truncate();
        $Regs = [ 
            [ 'cubo_id' => 1, 'Titulo' => 'Panel 1', 'Descripcion' => 'Este panel incluye...', 'Tipo' => 'Table',     'Config' => '{}' ],
            [ 'cubo_id' => 1, 'Titulo' => 'Panel 2', 'Descripcion' => 'Este panel incluye...', 'Tipo' => 'DataTable', 'Config' => '{}' ],
            [ 'cubo_id' => 2, 'Titulo' => 'Panel 3', 'Descripcion' => 'Este panel incluye...', 'Tipo' => 'LineChart', 'Config' => '{}' ],
        ];
        DB::table('paneles')->insert($Regs);


        //Informes
        DB::table('informes')->truncate();
        $Regs = [ 
            [ 'Titulo' => 'Informe 1', 'Config' => '[[ panel_id: 1, flex: 80 ], [ panel_id: 2, flex: 20 ]]' ],
        ];
        DB::table('informes')->insert($Regs);
        */


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


