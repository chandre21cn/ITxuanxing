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
            require.async(['./validate_methods','ajaxform'], function(Validate) {
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
                                var url = json.url;
                                switch(n){
                                    case 1:
                                        Comm.alertTips({'msg' : json.message});
                                        if (url!='') {
                                            window.location.href=url;
                                        } else {
                                            setTimeout('location.reload();',2000);
                                        }
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
            Comm.AutoEmail("[autoemail='true']",{
                'data' : gv.autoemail
            });
        //行业 带默认选项
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

        //通用自动补全方法
            $(document).on('focus','[autocomplete="true"]',function(){
                var that = $(this);
                require.async(['AutoComplete'], function() {
                    that.AutoComplete({
                        'data': that.data("complete-url"),
                        'ajaxDataType': 'xml',
                        'maxHeight': 300
                    })
                });
            })



        /*
         *   上传头像
         */
        $(document).on('click','.edit-avatar',function(){
            var $this = $(this),
                uid = $this.data('uid');
            Comm.CropPhoto({
                title:"上传头像",
                size:[160,160],
                data: {
                    'userid' : uid
                },
                fileSize: "1024KB",
                success: function(url){
                    $this.find('img').attr('src',url);
                    $this.find('input').val(url);
                }
            })
        });

        /*
        *   重新绑定手机号
        * */
            //注册
            $('#SetPhone').one('click',function(){
                $('#Phone').removeAttr('disabled').removeClass('disabled');
            });

        /*
        *   发送验证码
        * */

            // 倒计时
            var wait = 60;
            var __time = function (o) {
                if (wait == 0) {
                    o.addClass("btn-orange");
                    o.html("重新发送");
                    wait = 60;
                } else {
                    o.removeClass('btn-orange');
                    o.html("重新发送(" + wait + ")");
                    wait--;
                    setTimeout(function() {
                            __time(o)
                        },
                        1000)
                }
            };

            var __SendCode = function (that) {
                var phone = $("#Phone").val();
                if ( !/^0?(13|15|18|17|14)[0-9]{9}$/.test(phone)  ) { return Comm.alertTips({'msg' : '请输入正确的手机号！'}) }
                $.ajax({
                    cache: true,
                    type: "POST",
                    url: gv.URL.SendCode,
                    data: {'phone':phone},
                    dataType: 'JSON',
                    async: false,
                    error: function() {
                        return Comm.alertTips({'msg' : '发送失败，请稍后再试！！'})
                    },
                    success: function(data) {
                        var status = Number(data.status);
                        if ( status==1 ) {
                            Comm.alertTips({'msg': data.message });
                            that.removeClass('btn-orange');
                            __time(that);
                        } else {
                            return Comm.alertTips({'msg' : data.message })
                        }
                    }
                });
            };

            $(document).on('click','#SendCode',function(){
                 var that = $(this);
                 if (that.hasClass('btn-orange')) {
                    return __SendCode(that)
                 }
                return false;
            });

        /*
        * 表单输入框默认提示
        * */
             //静态数据
             $(document).on('focus','[data-tips="true"]',function(){
                var that = $(this),
                    amount = that.data('amount'),
                    types = that.data('types');
                new Comm.TipsInput(that,{
                    'data'   : eval(types),
                    'Amount' : amount
                });
            });

            //动态数据
            $(document).on('focus','[data-tips="ajax"]',function(){
                var that = $(this),
                    amount = that.data('amount'),
                    equalto = $(that.data('equalto')).val(),
                    url = that.data('url'),
                    PostData = {"keyword":''};
                if ( equalto != undefined || equalto != "") {
                    PostData = {"keyword": equalto }
                }
                $.ajax({
                    type: "POST",
                    url: url,
                    data: PostData,
                    dataType: "json",
                    success: function(json){
                        if (json.status == 1) {
                            new Comm.TipsInput(that,{
                                'data'   : json,
                                'Amount' : amount
                            });
                        }
                    }
                });
            });
        /*
         *   评分
         */
        new Comm.Raty('.star-scoring');


        /*
        *   下拉选项
        * */
        if ($('select').size() > 0 ) {
            require.async(['selectbox'],function(selectbox){
                selectbox($('select'));
            })
        }

        /*
        * 表单自动保存
        * */
         if ($('[autosave="true"]').size() > 0 ) {
            require.async(['cookie'], function() {
                var SaveForm = function(){
                    var cookiename = $('[autosave="true"]').data('cookiename');
                    var val = JSON.stringify(Comm.serializeJson('[autosave="true"]'));
                    $.cookie(cookiename, val,{path:'/'});
                };
                setInterval( SaveForm, 10000 );
            })
        }

        /*
        *  发私信
        * */

        $(document).on('click','.btn-send-letter',function(){
            var that = $(this),
                data  = {
                    "uid": that.data('uid'),
                    "name": that.data('name')
                };
            require.async(['template','dialog','./validate_methods','ajaxform'], function(template,dialog,Validate,ajaxform) {
                var html = template('SendLetter', data);
                var _SendLetter = dialog({
                    title: '发私信给：' + data.name,
                    content: html,
                    width: '400'
                }).showModal();

                new Validate.checked("#SendLetterForm",{
                    'errorElement'  : 'label',       //用什么标签标记错误
                    'errorClass'   : "err",         //指定错误提示的css类名
                    'ignore': null,                   //对某些元素不进行验证
                    'errorPlacement' : function (error, element) {    //更改错误信息显示的位置
                        element.parent().parent().find('.show-msg').html(error)
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
                            'success': function(data) {
                                var n = Number(data.status);
                                switch(n){
                                    case 1:
                                        _SendLetter.remove();   //关闭窗口
                                        return Comm.alertTips({'msg' : data.message});
                                        break;
                                    default:
                                        btn.removeAttr('disabled').removeClass('disabled');
                                        return Comm.alertTips({'msg' : data.message})
                                }
                            }
                        }).submit(function() {return false;});
                    }
                })

            })
        })


    });

})