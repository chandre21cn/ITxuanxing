/**
 * Created by chandre on 14-9-27.
 */
define("base/common/1/base-debug", [ "sea-modules/jquery/jquery-debug", "sea-modules/lib/template-debug", "./common-debug" ], function(require) {
    var $ = require("sea-modules/jquery/jquery-debug");
    var template = require("sea-modules/lib/template-debug");
    var Comm = require("./common-debug");
    $(function() {
        //表单验证
        if ($("[data-validate='true']").size() > 0) {
            require.async([ "./validate_methods-debug", "ajaxform-debug" ], function(Validate) {
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
                                return Comm.alertTips({
                                    msg: "提交出错！"
                                });
                            },
                            success: function(json) {
                                var n = Number(json.status);
                                var url = json.url;
                                switch (n) {
                                  case 1:
                                    Comm.alertTips({
                                        msg: json.message
                                    });
                                    if (url != "") {
                                        window.location.href = url;
                                    } else {
                                        setTimeout("location.reload();", 2e3);
                                    }
                                    break;

                                  default:
                                    btn.removeAttr("disabled").removeClass("disabled");
                                    return Comm.alertTips({
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
        //邮箱
        Comm.AutoEmail("[autoemail='true']");
        //行业 带默认选项
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
        //通用自动补全方法
        var Auto_Complete = $('[autocomplete="true"]');
        if (Auto_Complete.size() > 0) {
            var url = Auto_Complete.data("complete-url");
            require.async([ "AutoComplete-debug" ], function() {
                Auto_Complete.AutoComplete({
                    data: url,
                    async: true,
                    ajaxDataType: "xml",
                    maxHeight: 300
                });
            });
        }
        /*
         *   上传头像
         */
        $(document).on("click", ".edit-avatar", function() {
            var $this = $(this);
            Comm.CropPhoto({
                title: "上传头像",
                size: [ 160, 160 ],
                fileSize: "1024KB",
                success: function(url) {
                    $this.find("img").attr("src", url);
                    $this.find("input").val(url);
                }
            });
        });
        /*
        *   重新绑定手机号
        * */
        //注册
        $("#SetPhone").one("click", function() {
            $("#Phone").removeAttr("disabled").removeClass("disabled");
        });
        /*
        *   发送验证码
        * */
        // 倒计时
        var wait = 60;
        var __time = function(o) {
            if (wait == 0) {
                o.removeAttr("disabled").addClass("btn-orange");
                o.html("重新发送");
                wait = 60;
            } else {
                o.removeClass("btn-orange").attr("disabled", true);
                o.html("重新发送(" + wait + ")");
                wait--;
                setTimeout(function() {
                    __time(o);
                }, 1e3);
            }
        };
        $(document).on("click", "#SendCode", function() {
            var that = $(this);
            var phone = $("#Phone").val();
            if (!/^0?(13|15|18|17|14)[0-9]{9}$/.test(phone)) {
                return Comm.alertTips({
                    msg: "请输入正确的手机号！"
                });
            }
            $.ajax({
                cache: true,
                type: "POST",
                url: gv.URL.SendCode,
                data: {
                    phone: phone
                },
                dataType: "JSON",
                async: false,
                error: function() {
                    return Comm.alertTips({
                        msg: "发送失败，请稍后再试！！"
                    });
                },
                success: function(data) {
                    var status = Number(json.status);
                    if (status == 1) {
                        Comm.alertTips({
                            msg: "验证已发送至 " + phone
                        });
                        that.removeClass("btn-orange").attr("disabled", true);
                        __time(that);
                    } else {
                        return Comm.alertTips({
                            msg: json.message
                        });
                    }
                }
            });
        });
        /*
         *   评分
         */
        new Comm.Raty(".star-scoring");
        /*
        * 表单自动保存
        * */
        if ($('[autosave="true"]').size() > 0) {
            require.async([ "cookie-debug" ], function() {
                var SaveForm = function() {
                    var cookiename = $('[autosave="true"]').data("cookiename");
                    var val = JSON.stringify(Comm.serializeJson('[autosave="true"]'));
                    $.cookie(cookiename, val, {
                        path: "/"
                    });
                };
                setInterval(SaveForm, 1e4);
            });
        }
        /*
        *  发私信
        * */
        $(document).on("click", ".btn-send-letter", function() {
            var that = $(this), data = {
                uid: that.data("uid"),
                name: that.data("name")
            };
            require.async([ "template-debug", "dialog-debug", "./validate_methods-debug", "ajaxform-debug" ], function(template, dialog, Validate, ajaxform) {
                var html = template("SendLetter", data);
                var _SendLetter = dialog({
                    title: "发私信给：" + data.name,
                    content: html,
                    width: "400"
                }).showModal();
                new Validate.checked("#SendLetterForm", {
                    errorElement: "label",
                    //用什么标签标记错误
                    errorClass: "err",
                    //指定错误提示的css类名
                    ignore: null,
                    //对某些元素不进行验证
                    errorPlacement: function(error, element) {
                        //更改错误信息显示的位置
                        element.parent().parent().find(".show-msg").html(error);
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
                                return Comm.alertTips({
                                    msg: "提交出错！"
                                });
                            },
                            success: function(json) {
                                var n = Number(json.status);
                                var url = json.url;
                                switch (n) {
                                  case 1:
                                    _SendLetter.remove();
                                    //关闭窗口
                                    return Comm.alertTips({
                                        msg: json.message
                                    });
                                    break;

                                  default:
                                    btn.removeAttr("disabled").removeClass("disabled");
                                    return Comm.alertTips({
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
        });
    });
});

/**
 * Created by chandre on 14-10-1.
 */
define("base/common/1/common-debug", [ "sea-modules/jquery/jquery-debug" ], function(require, exports, module) {
    var $ = require("sea-modules/jquery/jquery-debug");
    var common = {
        /*
         * 提示信息
         */
        alertTips: function(options) {
            var defaults = {
                msg: "操作成功！",
                close: true
            };
            opts = $.extend(true, {}, defaults, options);
            require.async([ "dialog-debug" ], function(dialog) {
                var alertMsg = dialog({
                    //弹出消息提示
                    width: 200,
                    cancel: false,
                    content: '<div style="text-align:center;font-size:14px;">' + opts.msg + "</div>"
                }).showModal();
                if (opts.close == true) {
                    setTimeout(function() {
                        alertMsg.remove();
                    }, 2e3);
                }
            });
        },
        /*
        * 邮箱自动补全
        * */
        AutoEmail: function(selector, options) {
            var defualts = {
                data: [ "@163.com", "@qq.com", "@sina.com", "@outlook.com", "@shohu.com", "@tom.com", "@yeah.net", "@139.com", "@189.cn", "@yahoo.cn", "@gmail.com" ]
            };
            var elt = this.selector = $(selector);
            var opts = $.extend({}, defualts, options);
            var autoComplete, autoLi;
            this.viewhtml = $('<div class="Auto-Complete"><ul></ul></div>');
            var strHtml = '<li class="AutoComplete_title">请选择邮箱后缀</li>';
            $.each(opts.data, function(i, val) {
                strHtml += '<li hz="' + val + '"></li>';
            });
            var str = this.viewhtml.find("ul").empty().append(strHtml);
            $("body").append(this.viewhtml.hide());
            autoComplete = this.viewhtml;
            autoComplete.data("elt", elt);
            autoLi = autoComplete.find("li:not(.AutoComplete_title)");
            autoLi.mouseover(function() {
                $(this).siblings().filter(".selected").removeClass("selected");
                $(this).addClass("selected");
            }).mouseout(function() {
                $(this).removeClass("selected");
            }).mousedown(function() {
                autoComplete.data("elt").val($(this).text()).change();
                autoComplete.hide();
            });
            //用户名补全+翻动
            elt.keyup(function(e) {
                if (/13|38|40|116/.test(e.keyCode) || this.value == "") {
                    return false;
                }
                var username = this.value;
                if (username.indexOf("@") == -1) {
                    autoComplete.hide();
                    return false;
                }
                autoLi.each(function() {
                    this.innerHTML = username.replace(/\@+.*/, "") + $(this).attr("hz");
                    if (this.innerHTML.indexOf(username) >= 0) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                }).filter(".selected").removeClass("selected");
                autoComplete.show().css({
                    width: $(this).outerWidth(),
                    left: $(this).offset().left,
                    top: $(this).offset().top + $(this).outerHeight(),
                    position: "absolute",
                    zIndex: "9999"
                });
                if (autoLi.filter(":visible").length == 0) {
                    autoComplete.hide();
                } else {
                    autoLi.filter(":visible").eq(0).addClass("selected");
                }
            }).keydown(function(e) {
                if (e.keyCode == 38) {
                    //上
                    autoLi.filter(".selected").prev().not(".AutoComplete_title").addClass("selected").next().removeClass("selected");
                } else if (e.keyCode == 40) {
                    //下
                    autoLi.filter(".selected").next().addClass("selected").prev().removeClass("selected");
                } else if (e.keyCode == 13) {
                    //Enter
                    autoLi.filter(".selected").mousedown();
                    e.preventDefault();
                }
            }).focus(function() {
                autoComplete.data("elt", $(this));
            }).blur(function() {
                autoComplete.hide();
            });
        },
        /*
         * 图片上传与裁图
         */
        CropPhoto: function(options) {
            var defualts = {
                title: "上传图片",
                size: [ 160, 160 ],
                fileSize: "1024KB",
                fileType: "*.gif; *.jpg; *.jpeg; *.png;",
                success: function(url) {}
            };
            var opts = $.extend({}, defualts, options);
            require.async([ "template-debug", "dialog-debug", "uploadify-debug", "jcrop-debug", "ajaxform-debug" ], function(template, dialog, uploadify, Jcrop, ajaxform) {
                data = {
                    title: opts.title,
                    width: opts.size[0],
                    height: opts.size[1],
                    fileSize: opts.fileSize,
                    fileType: opts.fileType
                };
                var html = template("PicsCrop", data);
                var _UploadPics = dialog({
                    title: "上传头像",
                    content: html,
                    width: "auto"
                }).showModal();
                var jcrop_api, boundx, boundy;
                function updateCoords(c) {
                    $("#crop-x").val(c.x);
                    $("#crop-y").val(c.y);
                    $("#crop-w").val(c.w);
                    $("#crop-h").val(c.h);
                }
                function checkCoords() {
                    if (parseInt($("#crop-w").val())) return true;
                    alert("请选择图片上合适的区域");
                    return false;
                }
                function updatePreview(c) {
                    if (parseInt(c.w) > 0) {
                        var rx = opts.size[0] / c.w;
                        var ry = opts.size[1] / c.h;
                        $("#crop-preview").css({
                            width: Math.round(rx * boundx) + "px",
                            height: Math.round(ry * boundy) + "px",
                            marginLeft: "-" + Math.round(rx * c.x) + "px",
                            marginTop: "-" + Math.round(ry * c.y) + "px"
                        });
                    }
                }
                //上传
                $("#Pics-Upload").uploadify({
                    auto: true,
                    multi: false,
                    uploadLimit: 1,
                    buttonImage: gv.URL.Btn_picsupload,
                    height: 35,
                    width: 140,
                    removeCompleted: true,
                    swf: gv.URL.uploadifySwf,
                    uploader: gv.URL.PicsUpload,
                    fileTypeExts: opts.fileType,
                    fileSizeLimit: opts.fileSize,
                    onUploadSuccess: function(file, data, response) {
                        var msg = $.parseJSON(data);
                        //裁图
                        if (msg.result_code == 1) {
                            $("#crop-pics").val(msg.result_des);
                            $("#crop-target").attr("src", msg.result_des);
                            $("#crop-preview").attr("src", msg.result_des).css("visibility", "visible");
                            $("#crop-target").Jcrop({
                                minSize: [ opts.size[0], opts.size[1] ],
                                setSelect: [ 0, 0, opts.size[0], opts.size[1] ],
                                onChange: updatePreview,
                                onSelect: updatePreview,
                                onSelect: updateCoords,
                                boxWidth: 380,
                                boxHeight: 316,
                                aspectRatio: opts.size[0] / opts.size[1]
                            }, function() {
                                // Use the API to get the real image size
                                var bounds = this.getBounds();
                                boundx = bounds[0];
                                boundy = bounds[1];
                                // Store the API in the jcrop_api variable
                                jcrop_api = this;
                            });
                        } else {
                            alert("上传失败");
                        }
                    }
                });
                //提交
                $("#CropForm").ajaxForm({
                    dataType: "json",
                    beforeSubmit: function() {
                        common.alertTips({
                            msg: "图像保存中，请稍后！"
                        });
                    },
                    error: function() {
                        common.alertTips({
                            msg: "操作失败，请稍后再试！"
                        });
                    },
                    success: function(json) {
                        if (json.status == 1) {
                            opts.success(json.picsurl);
                            //回传上传的图片地址
                            _UploadPics.remove();
                            //关闭图片上传窗口
                            common.alertTips({
                                msg: json.message
                            });
                        } else {
                            common.alertTips({
                                msg: json.message
                            });
                        }
                    }
                }).submit(function() {
                    return false;
                });
            });
        },
        /*
        *  评分
        * */
        Raty: function(selector) {
            var $this = this.selector = $(selector);
            $this.each(function() {
                var that = $(this), hasMsg = false, showmsg = null;
                that.find("a").data("msg") == undefined ? hasMsg = false : hasMsg = true;
                if (hasMsg) {
                    var w = that.outerWidth(), h = that.outerHeight(), t = that.offset().top, l = that.offset().left;
                    showmsg = $('<div class="star-msg"></div>');
                    showmsg.css({
                        position: "absolute",
                        top: (h - 20) / 2 + t + "px",
                        left: w + l + "px",
                        "z-index": 99,
                        display: "none"
                    });
                    $("body").append(showmsg);
                }
                that.find("a").mouseenter(function() {
                    var msg = $(this).data("msg");
                    var a = $(this).index();
                    that.find("a").slice(0, a + 1).addClass("on");
                    that.find("a").slice(a + 1).removeClass("on");
                    if (hasMsg) {
                        showmsg.text(msg).show();
                    }
                }).mouseleave(function() {
                    that.find("a").removeClass("on");
                    var v = that.find("input").val();
                    v == "" ? v = 0 : v = v;
                    that.find("a").slice(0, v).addClass("on");
                    if (hasMsg) {
                        showmsg.hide();
                    }
                });
                that.find("a").click(function() {
                    var v = $(this).index();
                    that.find("input").val(v + 1);
                });
            });
        },
        /*
        *   表单值转json串
        * */
        serializeJson: function(selector) {
            var that = this.selector = $(selector);
            var serializeObj = {};
            var array = that.serializeArray();
            var str = that.serialize();
            $(array).each(function() {
                if (serializeObj[this.name]) {
                    if ($.isArray(serializeObj[this.name])) {
                        serializeObj[this.name].push(this.value);
                    } else {
                        serializeObj[this.name] = [ serializeObj[this.name], this.value ];
                    }
                } else {
                    serializeObj[this.name] = this.value;
                }
            });
            return serializeObj;
        }
    };
    module.exports = common;
});
