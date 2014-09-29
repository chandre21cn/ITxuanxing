/**
 * Created by chandre on 14-9-27.
 */
define("base/common/1/base-debug", [ "sea-modules/jquery/jquery-debug" ], function(require) {
    var $ = require("sea-modules/jquery/jquery-debug");
    /*
     * 提示信息
     */
    var alertTips = function(options) {
        var defaults = {
            msg: "操作成功！",
            close: true
        };
        opt = $.extend(true, {}, defaults, options);
        require.async([ "dialog-debug" ], function(dialog) {
            var alertMsg = dialog({
                //弹出消息提示
                width: 200,
                cancel: false,
                content: '<div style="text-align:center;font-size:14px;">' + opt.msg + "</div>"
            }).showModal();
            if (opt.close == true) {
                setTimeout(function() {
                    alertMsg.remove();
                }, 2e3);
            }
        });
    };
    $(function() {
        //表单验证
        if ($("[data-validate='true']").size() > 0) {
            require.async([ "validate_methods-debug", "ajaxform-debug" ], function(Validate) {
                new Validate.checked("[data-validate='true']", {
                    debug: false,
                    //进行调试模式（表单不提交）
                    errorElement: "label",
                    //用什么标签标记错误
                    errorClass: "err",
                    //指定错误提示的css类名
                    ignore: null,
                    //对某些元素不进行验证
                    errorPlacement: function(error, element) {
                        //更改错误信息显示的位置
                        element.parent().find(".show-msg").html(error);
                    },
                    success: function(label) {},
                    submitHandler: function(form) {
                        //提交事件
                        var btn = $(form).find('[type="submit"]');
                        btn.removeAttr("disabled").removeClass("disabled");
                        $(form).ajaxSubmit({
                            dataType: "json",
                            timeout: 3e3,
                            error: function() {
                                btn.attr("disabled", false).removeClass("disabled");
                                return alertTips({
                                    msg: "提交出错！"
                                });
                            },
                            success: function(json) {
                                var n = Number(json.status);
                                switch (n) {
                                  case 1:
                                    alertTips({
                                        msg: json.message
                                    });
                                    setTimeout("location.reload();", 2e3);
                                    break;

                                  default:
                                    btn.removeAttr("disabled").removeClass("disabled");
                                    return alertTips({
                                        msg: json.message
                                    });
                                }
                            }
                        }).submit(function() {
                            return false;
                        });
                    }
                });
            });
        }
        /*
         *  自动补全
         */
        //行业
        var AutoIndustry = $("#tags-industry");
        if (AutoIndustry.size() > 0) {
            require.async([ "tagsedit-debug" ], function() {
                AutoIndustry.tagEditor({
                    autocomplete: {
                        data: gv.URL.GetIndustry,
                        async: true,
                        ajaxDataType: "xml"
                    },
                    delimiter: " "
                });
                $(document).on("click", ".industry-tags a", function() {
                    var txt = $(this).text();
                    AutoIndustry.tagEditor("addTag", txt);
                });
            });
        }
    });
});
