<!DOCTYPE html>
<html lang="en" class="no-js">
    <head>
        <meta charset="UTF-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <link rel="stylesheet" type="text/css" href="css/uploadFile.css"/>
    <script type="text/javascript"  src="js/jquery.js"></script>     
    <script type="text/javascript" src="js/jquery.dragupload.js" ></script>
    <script type="text/javascript">
        $(function () {
            $('#upload-images').dragupload({
                title: 'Fotos do Veículo',
                actions: 'salvarArquivo.php',
                beforeEach: function (file, count) {
                    console.log(count);
                    if (count > 16) {
                        alert("Máximo de 16 fotos.");
                        return false;
                    }
                },
                maxFileSizeBytes: Math.pow(2, 20)
                
            });
        })
    </script>
    <body>
        <?php
        echo '<div id="upload-images"></div>';
        ?>
    </body>
</html>


<?php



