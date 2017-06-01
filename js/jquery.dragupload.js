/*!
 * jQuery dragupload
 * http://www.eneilson.com/dragupload
 *
 * Simple jQuery plugin to HTML5 upload
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-03-20
 */
(function ($) {
    "use strict";
    $.fn.dragupload = function (options) {
        //if (!window.File || !window.FileList || !window.FileReader) 

        function fcnMakeThumbFile(id, filename, title, container) {

            var extension = filename.split(".");
            extension = extension[extension.length - 1];

            if (extension == "png" || extension == "jpg" || extension == "gif" || extension == "bmp") {
                var $file = $('<div class="file image loading"><span class="status fa fa-check"></span><div class="icon"><img src="' + filename + '" alt="' + title + '" title="' + title + '" /></div><span class="delete fa fa-times"></span><span class="home fa fa-home"></span><span class="filename">' + title + '</span>' +
                        '<span class="type">' + extension + '</span>' +
                        '<span class="size">-</span>' +
                        '</div>');
            } else {
                var $file = $('<div class="file loading"><div class="icon"></div><span class="filename">' + title + '</span>' +
                        '<span class="type">' + extension + '</span>' +
                        '<span class="size">-</span>' +
                        '</div>');
            }

            container.append($file);
            $file.data('index', $file.parent().find('.file:not(.error)').index($file) + 1);
            $file.find(".fa-times, .fa-home").on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var $t = $(this);
                var _resource = $t.parent().find("img").attr('src').replace(/.*\//, '');
                $.ajax({
                    type: 'POST',
                    url: defaults.actions,
                    data: {action: ($t.is('.delete') ? 'delete' : 'home'), file: _resource},
                    dataType: 'JSON',
                    success: function (data) {
                        if ($t.is('.delete')) {
                            $t.parent().fadeOut();
                        } else {
                            container.html('');
                            for (var img in data) {
                                console.log(img)
                                console.log(data[img])
                                fcnMakeThumbFile(0, data[img], '', container)
                            }
                        }
                    }
                });
            });

        }

        var defaults = {
            title: 'jQuery.dragupload',
            label: 'Selecione os arquivos:',
            inputFile: 'file_upload',
            beforeEach: function () {},
            afterEach: function () {},
            id: null,
            actions: null, // server script to receive the file
            supportedFiles: null, // use : ["doc","pdf","xpto","rar","zip"] (javascript array)
            maxFileSizeBytes: 0,
            message: 'clique aqui para carregar o arquivo',
            fileList: null
        };


        var stopEvent = function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
        }

        $.extend(defaults, options);

        defaults.maxFileSizeBytes = parseInt(defaults.maxFileSizeBytes);

        return this.each(function (i, e) {
            var $t = $(e);

            if (typeof window.FormData === 'undefined') {

                var iframeid = 'dragupload-iframe' + parseInt(Math.random() * 1000);

                $(this).append('<fieldset class="dragupload-fieldset"><legend>Fotos do Veículo</legend><form class="formEnvio" name="form" action="salvarArquivoIE.php" method="POST" enctype="multipart/form-data" target="' + iframeid + '" id="' + iframeid + '-form">' +
                        '<label class="dragupload-label">Selecione o arquivo: <input name="my_files" id="my_file" type="file" /></label>' +
                        //' <input type="submit" name="action" value="Carregar Arquivo" />' +
                        '<br><iframe  class="dragupload-container" id="' + iframeid + '" name="' + iframeid + '" src="" frameborder="1" marginheight="0" marginwidth="0" scrolling="no" ' +
                        '</iframe></form></fieldset>');
                $(this).find('[name=my_files]').on('change', function () {
                    $('#' + iframeid + '-form').submit();
                });


                return true;
            }


            // uploader function
            var bindFile = function (file, container) {


                if ('function' == typeof defaults.beforeEach)
                    if (defaults.beforeEach(file, container.data('count-files') + 1) == false)
                        return false;
                container.data('count-files', container.data('count-files') + 1);

                if ($.isArray(defaults.supportedFiles))
                    for (var ext in defaults.supportedFiles)
                        if (!(file.type.indexOf(ext) >= 0))
                            return false;

                if (defaults.maxFileSizeBytes < file.size && defaults.maxFileSizeBytes > 0)
                    return false;

                var fileSize = ((file.size / 1024) / 1024 + "").replace(/(.*?\.[\d]{2}).*/, '$1') + " MB";

                if (file.type.indexOf("image") == 0) {
                    var fileReader = new FileReader();
                    fileReader.onload = function (e) {
                        var $file = $('<div class="file image loading"><span class="status fa fa-spin fa-spinner"></span><div class="icon"><img src="' + e.target.result + '" alt="' + file.name + '" title="' + file.name + '" /></div><span class="filename">' + file.name + '</span>' +
                                '<span class="type">' + file.type + '</span>' +
                                '<span class="progress-bar"><span class="percent"></span></span>' +
                                '<span class="size">' + fileSize + '</span>' +
                                '</div>');
                        container.append($file);
                        $file.data('index', $file.parent().find('.file:not(.error)').index($file) + 1);
                        uploadFile(file, $file);
                    }
                    fileReader.readAsDataURL(file);
                } else {
                    var $file = $('<div class="file loading"><div class="icon"></div><span class="filename">' + file.name + '</span>' +
                            '<span class="type">' + file.type + '</span>' +
                            '<span class="progress"><span class="percent"></span></span>' +
                            '<span class="size">' + fileSize + '</span>' +
                            '</div>');
                    container.append($file);
                    $file.data('index', $file.parent().find('.file:not(.error)').index($file) + 1);
                    uploadFile(file, $file);
                }
                // text (file.type.indexOf("text") ? ----- e.target.result.replace(/</g, "&lt;").replace(/>/g, "&gt;") /// reader.readAsText(file);
                return true;
            }

            var uploadFile = function (file, $file) {

                var xhr = new XMLHttpRequest();
                if (xhr.upload) {

                    // get the progress bar
                    var pb = $file.find(".progress-bar .percent");

                    // bind event progress bar
                    xhr.upload.addEventListener("progress", function (e) {
                        pb.width(parseInt(100 / (e.total / e.loaded)) + "%");
                    }, false);

                    // file received/failed
                    xhr.onreadystatechange = function (e) {
                        if (xhr.readyState == 4) {

                            var text = xhr.responseText || xhr.response;

                            var jsonStatus = $.parseJSON(text);
                            var sCls, icon = '<span class="status fa fa-times"></span>';
                            if (xhr.status == 200) {
                                sCls = jsonStatus.upload ? "success" : "failure";
                                icon = '<span class="status fa fa-' + (jsonStatus.upload ? "check" : "times") + '"></span>';
                            }
                            pb.addClass(sCls).parent().delay(500).fadeOut(500);
                            $file.find('.status').replaceWith(icon);
                            $file.addClass('error');
                        }


                        if ('function' == typeof defaults.afterEach)
                            if (defaults.afterEach(file, $file.parent().find('.file').length + 1) === false)
                                return false;
                    };

                    // start upload
                    xhr.open("POST", defaults.actions, true);
                    xhr.setRequestHeader("X_FILENAME", file.name);
                    var fd = new FormData();
                    fd.append(defaults.inputFile, file);
                    fd.append('index', $file.data('index'));
                    xhr.send(fd);

                }
            }
            // end uploader function

            defaults.id = parseInt(Math.random() * 100000000);

            $t.html('<fieldset id="dragupload-' + defaults.id + '" class="dragupload-fieldset"><legend>' + defaults.title + '</legend><label for="dragupload-' + defaults.inputFile + defaults.id + '">' + defaults.label + '</label><input type="file" style="display:none !important;" name="' + defaults.inputFile + '" multiple id="dragupload-' + defaults.inputFile + defaults.id + '" /><div class="dragupload-container"><div class="dragupload-items clearfix"></div><div class="info">' + defaults.message + '</div></div><div class="dragupload messages"></div></fieldset>');
            $t.find('.dragupload-items').data('count-files', 0);

            var funcEventUpload = function (e) {
                stopEvent(e);
                var $t = $(this);
                if ($t.is(':file')) {
                    $t = $t.next('.dragupload-container');
                }

                $t.removeClass('active');

                var files = e.originalEvent.target.files || e.originalEvent.dataTransfer.files;

                var $di = $t.find('.dragupload-items');
                for (var i = 0; i < files.length; i++)
                    bindFile(files.item(i), $di);

            }

            var $container = $('#dragupload-' + defaults.id);
            $container.find('.dragupload-container')
                    .on('click', function (e) {
                        stopEvent(e);
                        $(this).prev("input:file").click();
                    }).on('dragover dragend dragleave', function (e) {
                stopEvent(e);
                $(this)[e.type == 'dragover' ? 'addClass' : 'removeClass']('active');
            }).on('drop', funcEventUpload);
            $('#dragupload-' + defaults.inputFile + defaults.id).on('change', funcEventUpload);


            if ($.isArray(defaults.fileList))
                for (var i = 0; i < defaults.fileList.length; i++)
                    fcnMakeThumbFile(0, defaults.fileList[i], '', $container.find('.dragupload-items'));
        });
    }

})($);
