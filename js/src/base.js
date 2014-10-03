/**
 * Created by chandre on 14-9-27.
 */
define(function (require) {
    var $ = require('$');
    var template = require('template');
    var Comm = require('./common');

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
                                return Comm.alertTips({'msg' : '提交出错！'})
                            },
                            'success': function(json) {
                                var n = Number(json.status);
                                switch(n){
                                    case 1:
                                        Comm.alertTips({'msg' : json.message});
                                        setTimeout('location.reload();',2000);
                                        break;
                                    default:
                                        btn.removeAttr('disabled').removeClass('disabled');
                                        return Comm.alertTips({'msg' : json.message})
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
            Comm.AutoEmail("[autoemail='true']");
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
        $(document).on('click','.edit-avatar',function(){
            Comm.CropPhoto({
                title:"上传头像",
                size:[160,160],
                fileSize: "1024KB",
                success: function(url){
                    $('.useravatar').attr('src',url);
                }
            })
        })

        /*
         *   评分
         */
        new Comm.Raty('.star-scoring');


    });

})