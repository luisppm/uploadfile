<?php


$diretorio = 'imagem/';
$ext = strtolower(substr($_FILES['file_upload']['name'],-4));

move_uploaded_file($_FILES['file_upload']['tmp_name'], $diretorio.'arquivono'.$ext);

$teste[] = array('teste01'=>$_FILES['file_upload']['tmp_name'],'teste02'=>'02');
//$teste[] = array('status'=>'200', 'size'=>'1235454','true'=>$ext);
echo json_encode($teste);