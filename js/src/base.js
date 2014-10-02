/**
 * Created by chandre on 14-9-27.
 */
define(function (require) {
    var $ = require('$');
    /*
     * 提示信息
     */
    var alertTips = function(options) {
        var defaults = {
            'msg'       :  "操作成功！",
            'close'     : true
        };
        opt = $.extend(true, {}, defaults, options);
        require.async(['dialog'],function(dialog){
            var alertMsg = dialog({       //弹出消息提示
                width: 200,
                cancel: false,
                content: '<div style=\"text-align:center;font-size:14px;\">'+ opt.msg +'</div>'
            }).showModal();
            if (opt.close==true) {
                setTimeout(function () {alertMsg.remove()},2000);
            }
        });
    };


    $(function(){

        //表单验证
        if ( $("[data-validate='true']").size() > 0 ) {
            require.async(['validate_methods','ajaxform'], function(Validate) {
                new Validate.checked("[data-validate='true']",{
                    'debug': false,                 //进行调试模式（表单不提交）
                    'errorElement'  : 'label',       //用什么标签标记错误
                    'errorClass'   : "err",         //指定错误提示的css类名
                    'ignore': null,                   //对某些元素不进行验证
                    'errorPlacement' : function (error, element) {    //更改错误信息显示的位置
                        element.parent().find('.show-msg').html(error)
                    },
                    'success': function (label) {},
                    'submitHandler': function(form){       //提交事件
                        var btn = $(form).find('[type="submit"]');
                        btn.removeAttr('disabled').removeClass('disabled');
                        $(form).ajaxSubmit({
                            'dataType': 'json',
                            'timeout':   3000,
                            'error' : function(){
                                btn.attr('disabled',false).removeClass('disabled');
                                return alertTips({'msg' : '提交出错！'})
                            },
                            'success': function(json) {
                                var n = Number(json.status);
                                switch(n){
                                    case 1:
                                        alertTips({'msg' : json.message});
                                        setTimeout('location.reload();',2000);
                                        break;
                                    default:
                                        btn.removeAttr('disabled').removeClass('disabled');
                                        return alertTips({'msg' : json.message})
                                }
                            }
                        }).submit(function() {return false;});
                    }
                })
            })
        }

        /*
         *  自动补全
         */
        //邮箱
            var autoemail = $("[autoemail='true']");
            if ( autoemail.size() > 0 ) {
                require.async(['./common'], function(Comm) {
                    Comm.AutoEmail("[autoemail='true']")
                })
            }
        //行业
            var AutoIndustry = $('#tags-industry');
            if ( AutoIndustry.size() > 0 ) {
                require.async(['tagsedit'], function() {
                    AutoIndustry.tagEditor({
                        autocomplete: {
                            'data': gv.URL.GetIndustry,
                            'async': true,
                            'ajaxDataType': 'xml'
                        },
                        delimiter: ' '
                    });
                    $(document).on('click','.industry-tags a',function(){
                        var txt = $(this).text();
                        AutoIndustry.tagEditor('addTag', txt);
                    })
                })
            }

        /*
         *   上传头像
         */
        var editavatar_html = '<a href="javascript:void(0);" id="avatarUpload">选择文件</a><p id="uploading"></p>';
            editavatar_html += '<div><form><div class="EditPics"><img src="" id="target"/></div>';
            editavatar_html += '<div class="PreviewPics"><p class="preview1"><img src="" id="preview"/></p><p class="preview2"><img src="" id="preview2"/></p><p class="preview3"><img src="" id="preview3"/></p></div>';
            editavatar_html += '<input type="hidden" id="avatarimg" name="img" /><input type="hidden" id="x" name="x" /><input type="hidden" id="y" name="y" /><input type="hidden" id="w" name="w" /><input type="hidden" id="h" name="h" /><input type="submit" value="保存" /></form></div>';



        $(document).on('click','.edit-avatar',function(){
            require.async(['dialog','uploadify','jcrop'],function(dialog,uploadify,Jcrop){
                var EditAvatar = dialog({
                    title: '上传头像',
                    content: editavatar_html,
                    width: 600
                });
                EditAvatar.show();
                var jcrop_api, boundx, boundy;
                function updateCoords(c){
                    $('#x').val(c.x);
                    $('#y').val(c.y);
                    $('#w').val(c.w);
                    $('#h').val(c.h);
                };
                function checkCoords(){
                    if (parseInt($('#w').val())) return true;
                    alert('请选择图片上合适的区域');
                    return false;
                };
                function updatePreview(c){
                    if (parseInt(c.w) > 0){
                        var rx = 160 / c.w;
                        var ry = 160 / c.h;
                        $('#preview').css({
                            width: Math.round(rx * boundx) + 'px',
                            height: Math.round(ry * boundy) + 'px',
                            marginLeft: '-' + Math.round(rx * c.x) + 'px',
                            marginTop: '-' + Math.round(ry * c.y) + 'px'
                        });
                    }
                    {
                        var rx = 80 / c.w;
                        var ry = 80 / c.h;
                        $('#preview2').css({
                            width: Math.round(rx * boundx) + 'px',
                            height: Math.round(ry * boundy) + 'px',
                            marginLeft: '-' + Math.round(rx * c.x) + 'px',
                            marginTop: '-' + Math.round(ry * c.y) + 'px'
                        });
                    }
                    {
                        var rx = 30 / c.w;
                        var ry = 30 / c.h;
                        $('#preview3').css({
                            width: Math.round(rx * boundx) + 'px',
                            height: Math.round(ry * boundy) + 'px',
                            marginLeft: '-' + Math.round(rx * c.x) + 'px',
                            marginTop: '-' + Math.round(ry * c.y) + 'px'
                        });
                    }
                };


                $("#avatarUpload").uploadify({
                    'auto'				: true,
                    'multi'				: false,
                    'uploadLimit'		: 1,
                    'formData'			: {'uid':'18'},
                    'buttonText'		: '请选择图片',
                    'height'			: 30,
                    'width'				: 120,
                    'removeCompleted'	: true,
                    'queueID'           : "#uploading",
                    'swf'				: '/img/uploadify.swf',
                    'uploader'			: 'upload.php',
                    'fileTypeExts'		: '*.gif; *.jpg; *.jpeg; *.png;',
                    'fileSizeLimit'		: '1024KB',
                    'onUploadSuccess' : function(file, data, response) {
                        var msg = $.parseJSON(data);
                        if( msg.result_code == 1 ){
                            $("#avatarimg").val( msg.result_des );
                            $("#target").attr("src",msg.result_des);
                            $(".PreviewPics img").attr("src",msg.result_des);
                            $('#target').Jcrop({
                                    minSize: [50,50],
                                    setSelect: [0,0,160,160],
                                    onChange: updatePreview,
                                    onSelect: updatePreview,
                                    onSelect: updateCoords,
                                    aspectRatio: 1
                                },
                                function(){
                                    // Use the API to get the real image size
                                    var bounds = this.getBounds();
                                    boundx = bounds[0];
                                    boundy = bounds[1];
                                    // Store the API in the jcrop_api variable
                                    jcrop_api = this;
                                });
                        } else {
                            alert('上传失败');
                        }
                    },
                    'onClearQueue' : function(queueItemCount) {
                        alert( $('#img1') );
                    },
                    'onCancel' : function(file) {
                        alert('The file ' + file.name + ' was cancelled.');
                    }
                });



            })
        })


    });

})