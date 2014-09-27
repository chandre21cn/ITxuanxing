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

    //表单验证
    $(function(){
        if ( $("[data-validate='true']").length > 0 ) {
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
                                return alertTips({'msg' : '提交出错！'})
                                btn.attr('disabled',false).removeClass('disabled');
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
                });
            });
        }
    });

    //自动补全



})