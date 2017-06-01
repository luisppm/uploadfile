<?php

if (isset($_FILES['my_files']['name'])) {
    $uploaddir = 'imagem/';
    $uploadfile = $uploaddir . $_FILES['my_files']['name'];

    if (move_uploaded_file($_FILES['my_files']['tmp_name'], $uploadfile)) {
        
        //echo "success: <div class='height: 65px; overflow: hidden;'>".$_FILES['my_files']['name']."</div>";
        
        echo '<img src="'.$uploadfile.'" alt="teste" title="teste" style="height:95px;"/>';
    } else {
        echo "error";
    }
} else {
    echo 'vazio';
}


