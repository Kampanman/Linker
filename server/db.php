<?php

$dsn = 'localhost';
$dbname = 'crud';
$username = 'root';
$password = '';

$connection = new PDO('mysql:host=' . $dsn . ';dbname=' . $dbname, $username, $password);
