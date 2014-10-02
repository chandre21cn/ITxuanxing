/**
 * Created by chandre on 14-10-1.
 */
define(function(require, exports, module) {
    var $ = require('$');

    var common = {

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
        }
    };


    module.exports = common;

});