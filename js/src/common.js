/**
 * Created by chandre on 14-10-1.
 */
define(function(require, exports, module) {
    var $ = require('$');

    var common = {
        /*
         * 提示信息
         */
        'alertTips' : function(options) {
            var defaults = {
                'msg'       :  "操作成功！",
                'close'     : true
            };
            opts = $.extend(true, {}, defaults, options);
            require.async(['dialog'],function(dialog){
                var alertMsg = dialog({       //弹出消息提示
                    width: 200,
                    cancel: false,
                    content: '<div style=\"text-align:center;font-size:14px;\">'+ opts.msg +'</div>'
                }).showModal();
                if (opts.close==true) {
                    setTimeout(function () {alertMsg.remove()},2000);
                }
            });
        },

        /*
        * 邮箱自动补全
        * */
        'AutoEmail' : function(selector,options){
            var defualts = {
                data : ['@163.com','@qq.com','@sina.com','@outlook.com','@shohu.com','@tom.com','@yeah.net','@139.com','@189.cn','@yahoo.cn','@gmail.com']
            };
            var elt = this.selector =  $(selector);
            var opts = $.extend({}, defualts, options);
            var autoComplete,autoLi;
            this.viewhtml = $('<div class="Auto-Complete"><ul></ul></div>');
            var strHtml = '<li class="AutoComplete_title">请选择邮箱后缀</li>';
            $.each(opts.data, function(i, val) {
                strHtml += '<li hz="'+ val +'"></li>';
            });

            var str = this.viewhtml.find('ul').empty().append(strHtml);
            $('body').append(this.viewhtml.hide());

            autoComplete = this.viewhtml;
            autoComplete.data('elt',elt);
            autoLi = autoComplete.find('li:not(.AutoComplete_title)');
            autoLi.mouseover(function(){
                $(this).siblings().filter('.selected').removeClass('selected');
                $(this).addClass('selected');
            }).mouseout(function(){
                $(this).removeClass('selected');
            }).mousedown(function(){
                autoComplete.data('elt').val($(this).text()).change();
                autoComplete.hide();
            });
            //用户名补全+翻动
            elt.keyup(function(e){
                if(/13|38|40|116/.test(e.keyCode) || this.value == ''){
                    return false;
                }
                var username = this.value;
                if(username.indexOf('@') == -1){
                    autoComplete.hide();
                    return false;
                }
                autoLi.each(function(){
                    this.innerHTML = username.replace(/\@+.*/,'') + $(this).attr('hz');
                    if(this.innerHTML.indexOf(username) >= 0){
                        $(this).show();
                    }else{
                        $(this).hide();
                    }
                }).filter('.selected').removeClass('selected');
                autoComplete.show().css({
                    width:$(this).outerWidth(),
                    left: $(this).offset().left,
                    top: $(this).offset().top + $(this).outerHeight(),
                    position: 'absolute',
                    zIndex: '9999'
                });
                if(autoLi.filter(':visible').length == 0){
                    autoComplete.hide();
                }else{
                    autoLi.filter(':visible').eq(0).addClass('selected');
                }
            }).keydown(function(e){
                if(e.keyCode == 38){ //上
                    autoLi.filter('.selected').prev().not('.AutoComplete_title').addClass('selected').next().removeClass('selected');
                }else if(e.keyCode == 40){ //下
                    autoLi.filter('.selected').next().addClass('selected').prev().removeClass('selected');
                }else if(e.keyCode == 13){ //Enter
                    autoLi.filter('.selected').mousedown();
                    e.preventDefault();    //如有表单，阻止表单提交
                }
            }).focus(function(){
                autoComplete.data('elt',$(this));
            }).blur(function(){
                autoComplete.hide();
            });
        },


        /*
         * 图片上传与裁图
         */
        "CropPhoto" : function (options){
            var defualts = {
                title: "上传图片",
                size: [160,160],
                fileSize : "1024KB",
                fileType : '*.gif; *.jpg; *.jpeg; *.png;',
                success : function(url){}
            };
            var opts = $.extend({}, defualts, options);
            require.async(['template','dialog','uploadify','jcrop','ajaxform'],function(template,dialog,uploadify,Jcrop,ajaxform) {
                data = {
                    title : opts.title,
                    width:opts.size[0],
                    height:opts.size[1],
                    fileSize: opts.fileSize,
                    fileType : opts.fileType
                }
                var html = template('PicsCrop', data);
                var _UploadPics = dialog({
                    title: '上传头像',
                    content: html,
                    width: 'auto'
                }).showModal();

                var jcrop_api, boundx, boundy;

                function updateCoords(c){
                    $('#crop-x').val(c.x);
                    $('#crop-y').val(c.y);
                    $('#crop-w').val(c.w);
                    $('#crop-h').val(c.h);
                };
                function checkCoords(){
                    if (parseInt($('#crop-w').val())) return true;
                    alert('请选择图片上合适的区域');
                    return false;
                };
                function updatePreview(c){
                    if (parseInt(c.w) > 0){
                        var rx = opts.size[0] / c.w;
                        var ry = opts.size[1] / c.h;
                        $('#crop-preview').css({
                            width: Math.round(rx * boundx) + 'px',
                            height: Math.round(ry * boundy) + 'px',
                            marginLeft: '-' + Math.round(rx * c.x) + 'px',
                            marginTop: '-' + Math.round(ry * c.y) + 'px'
                        });
                    }
                };

                //上传
                $("#Pics-Upload").uploadify({
                    'auto'				: true,
                    'multi'				: false,
                    'uploadLimit'		: 1,
                    'buttonImage'		: gv.URL.Btn_picsupload,
                    'height'			: 35,
                    'width'				: 140,
                    'removeCompleted'	: true,
                    'swf'				: gv.URL.uploadifySwf,
                    'uploader'			: gv.URL.PicsUpload,
                    'fileTypeExts'		: opts.fileType,
                    'fileSizeLimit'		: opts.fileSize,
                    'onUploadSuccess' : function(file, data, response) {
                        var msg = $.parseJSON(data);
                        //裁图
                        if( msg.result_code == 1 ){
                            $("#crop-pics").val( msg.result_des );
                            $("#crop-target").attr("src",msg.result_des);
                            $("#crop-preview").attr("src",msg.result_des).css('visibility',"visible");
                            $('#crop-target').Jcrop({
                                    minSize: [opts.size[0],opts.size[1]],
                                    setSelect: [0,0,opts.size[0],opts.size[1]],
                                    onChange: updatePreview,
                                    onSelect: updatePreview,
                                    onSelect: updateCoords,
                                    boxWidth : 380,
                                    boxHeight: 316,
                                    aspectRatio: opts.size[0] / opts.size[1]
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
                    }
                });

                //提交
                $("#CropForm").ajaxForm({
                    'dataType': 'json',
                    'beforeSubmit': function(){
                        common.alertTips({'msg':'图像保存中，请稍后！'})
                    },
                    'error' : function(){
                        common.alertTips({'msg':'操作失败，请稍后再试！'})
                    },
                    'success': function(json){
                        if (json.status == 1){
                            opts.success(json.picsurl); //回传上传的图片地址
                            _UploadPics.remove();   //关闭图片上传窗口
                            common.alertTips({'msg': json.message })
                        } else {
                            common.alertTips({'msg': json.message })
                        }
                    }
                }).submit(function(){return false})
            });

        },

        /*
        *  评分
        * */
        "Raty" : function(selector) {
            var $this = this.selector = $(selector);
            $this.each(function(){
                var that = $(this),
                    hasMsg = false,
                    showmsg = null;
                that.find('a').data('msg') == undefined ? hasMsg = false : hasMsg = true;
                if (hasMsg) {
                    var w = that.outerWidth(),
                        h = that.outerHeight(),
                        t = that.offset().top,
                        l = that.offset().left;
                    showmsg = $('<div class=\"star-msg\"></div>');
                    showmsg.css({
                        'position': 'absolute',
                        'top': ( h - 20 ) / 2 + t + 'px',
                        'left': w + l + 'px',
                        'z-index': 99,
                        'display': "none"
                    });
                    $("body").append(showmsg);
                };
                that.find("a").mouseenter(function(){
                    var msg = $(this).data("msg");
                    var a = $(this).index();
                    that.find('a').slice(0, a + 1).addClass('on');
                    that.find('a').slice(a + 1).removeClass("on");
                    if (hasMsg) { showmsg.text(msg).show(); }
                }).mouseleave(function(){
                    that.find('a').removeClass('on');
                    var v = that.find("input").val();
                    v == '' ? v = 0 : v = v;
                    that.find('a').slice(0, v).addClass('on')
                    if (hasMsg) { showmsg.hide(); }
                });
                that.find("a").click(function(){
                    var v = $(this).index();
                    that.find("input").val( v + 1);
                });
            });
        },

        /*
        *   表单值转json串
        * */
        "serializeJson": function (selector) {
            var that = this.selector = $(selector);
            var serializeObj = {};
            var array = that.serializeArray();
            var str = that.serialize();
            $(array).each(function () {
                if (serializeObj[this.name]) {
                    if ($.isArray(serializeObj[this.name])) {
                        serializeObj[this.name].push(this.value);
                    } else {
                        serializeObj[this.name] = [serializeObj[this.name], this.value];
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