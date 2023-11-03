<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('file_systems', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id')->default(1);
            $table->string('disk');
            $table->string('path');
            $table->string('type');
            $table->string('basename');
            $table->string('dirname');
            $table->string('extension');
            $table->string('filename');
            $table->string('size');
            $table->string('timestamp');
            $table->string('visibility');
            $table->boolean('status')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('file_systems');
    }
};
