/**
 * Created by chandre on 14-9-24.
 * 依赖 jquery validate插件
 */
define(function(require, exports, module) {
    var $ = require('$');
    var validate = require('validate');
    var Exp = {
            email:  /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,     //邮箱
            password : /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,20}$/,  			//密码
            username : /^[a-zA-Z]\w{5,11}$/,                //用户名
            nickname:  /^[\w\u4e00-\u9fa5]+$/,                   //昵称
            //日期支持 00-00-00 00:00:00 | 0000-00-00 00:00:00 | 09-05-22 08:16:00 | 1970-00-00 00:00:00 | 20090522081600
            datetime : /^(\d{2}|\d{4})(?:\-)?([0]{1}\d{1}|[1]{1}[0-2]{1})(?:\-)?([0-2]{1}\d{1}|[3]{1}[0-1]{1})(?:\s)?([0-1]{1}\d{1}|[2]{1}[0-3]{1})(?::)?([0-5]{1}\d{1})(?::)?([0-5]{1}\d{1})$/,
            tel : /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,			//固定电话
            mobile : /^0?(13|15|18|17|14)[0-9]{9}$/,									//手机号
            qq : /^[1-9][0-9]{4,}$/,												//QQ
            date :  /^(\d{4})-(\d{2})-(\d{2})$/,   //日期 YYYY-MM-DD
            zip:  /^[1-9][0-9]{5}$/,         //邮编
            url : /^((https|http|ftp|rtsp|mms)?:\/\/)?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/,       //url
            idcard : /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,   //18位身份证
            color :  /^#[a-fA-F0-9]{6}$/,		//color
            image : /^.*[^a][^b][^c]\.(?:png|jpg|bmp|gif|jpeg)$/,   //图片
            file:   /^.*[^a][^b][^c]\.(?:doc|docx|pdf|pptx|ppt|xls|xlsx|zip|rar)$/,  //文件

            //字符头尾是字母，中间由空格和字母组成，中间只有一个空格，如：Taylor Gre Swift
            coe:   /^(([A-Za-z]+\s?)*[A-Za-z]|([\u4e00-\u9fa5]+)){2,}$/,
            //内容至少应该包含一个汉字或英文字母
            cae: /^([A-Za-z\u4e00-\u9fa5]+\s?)*[A-Za-z\u4e00-\u9fa5]$/,
            //用户输入的内容中不能包含“测试”、“学生”、“某”、“保密“、“注册中”、自营、XXOO、游民
            filter : /(?!.*\u6d4b\u8bd5|.*\u5b66\u751f|.*\u4fdd\u5bc6|.*\u6ce8\u518c\u4e2d|.*\u81ea\u8425|.*\u6e38\u6c11|.*\u67d0|.*XXOO|.*xxoo)^.*$/,
            //单一字符或汉字连续重复的次数不能超过3次;
            repeat : /(\w|[\u4e00-\u9fa5]{1})\1{2,}/,
            //不能只是IT
            it:/^(it|IT|iT|It)$/
        };

    $.extend($.validator.messages, {
        required: "必填",
        remote: "您输入的内容已存在",
        email: "请输入正确格式的电子邮件",
        url: "请输入合法的网址",
        date: "请输入合法的日期",
        dateISO: "请输入合法的日期 (ISO).",
        number: "请输入合法的数字",
        digits: "只能输入整数",
        creditcard: "请输入合法的信用卡号",
        equalTo: "请再次输入",
        accept: "请输入拥有合法后缀名的字符串",
        maxlength: $.validator.format("最多输入 {0} 个字符"),
        minlength: $.validator.format("最少输入 {0} 个字符"),
        rangelength: $.validator.format("只能输入 {0} - {1} 个字符"),
        range: $.validator.format("请输入一个介于 {0} - {1} 之间的值"),
        max: $.validator.format("请输入一个最大为{0} 的值"),
        min: $.validator.format("请输入一个最小为{0} 的值")
    });

    //纯汉字或英文与空格
    $.validator.addMethod("coe", function(value, element) {
        return this.optional(element) || Exp.coe.test(value);
    }, "只能输入纯汉字或英文+空格");
    //包含一个汉字或英文字母
    $.validator.addMethod("cae", function(value, element) {
        return this.optional(element) || Exp.cae.test(value);
    }, "内容只能包含汉字、英文字母或空格");

    //连续重复3次的文字内容
    $.validator.addMethod("repeat", function(value, element) {
        return this.optional(element) || !Exp.repeat.test(value)
    }, "不能连续输入3个相同的字符");

    //过滤字符
    $.validator.addMethod("filter", function(value, element) {
        return this.optional(element) ||  Exp.filter.test(value);
    }, "不能输入敏感信息内容");

    //不能等于it
    $.validator.addMethod("it", function(value, element) {
        return this.optional(element) ||  !Exp.it.test(value);
    }, "输入的内容不能只是\"IT\"，而无其他内容");


    //登录账号 邮箱与手机号
    $.validator.addMethod("mobile_email", function(value, element) {
        return this.optional(element) || ( (Exp.mobile.test(value)) || (Exp.email.test(value)) );
    }, "账号必须为手机号或邮箱地址");

    //用户名
    $.validator.addMethod("username", function(value, element) {
        return this.optional(element) || Exp.username.test(value);
    }, "6~12个字符，包括字母、数字、下划线，以字母开头，字母或数字结尾");

    //昵称
    $.validator.addMethod("nickname", function(value, element) {
        return this.optional(element) || Exp.nickname.test(value);
    }, "只能输入中文、字母、数字或下划线");
    // 密码
    $.validator.addMethod("pass", function(value, element) {
        return this.optional(element) || (Exp.password.test(value));
    }, "只能输入6-20个字母、数字、特殊字符");

    // 确认密码
    $.validator.addMethod("repassword", function(value, element) {
        var val = $('#password').val();
        return this.optional(element) || (value == val);
    }, "两次输入的密码不一致");

    //日期时间
    $.validator.addMethod("datetime", function(value, element) {
        return this.optional(element) || (Exp.datetime.test(value));
    }, "请正确填写您的日期(如:2014-01-01 00:00:00)");
    //日期
    $.validator.addMethod("date", function(value, element) {
        return this.optional(element) || (Exp.date.test(value));
    }, "请正确填写您的日期(如:2014-01-01)");

    // 日期时间对比验证
    $.validator.addMethod("dateContrast", function(value, element, param) {
        var startDate = $('#starttime').val();
        return new Date(Date.parse(startDate.replace(/-/g,"/"))) <= new Date(Date.parse(value.replace(/-/g,"/")));
    },"结束日期必须大于开始日期");

    //日期对比
    $.validator.addMethod("datefromto", function(value, element, param) {
        var startDate = $('#fromdate').val();
        return new Date(Date.parse(value.replace(/-/g,"/"))) > new Date(Date.parse(startDate.replace(/-/g,"/")));
    },"结束日期必须大于或等于开始日期");

    // 电话号码与手机
    $.validator.addMethod("phone", function(value, element) {
        return this.optional(element) || ( (Exp.tel.test(value)) || (Exp.mobile.test(value)) );
    },"请正确填写手机、固定电话号码(如：010-80101011/13801010101)");
    // 电话号码 (包括验证国内区号,国际区号,分机号如：+86-010-11111111-010)
    $.validator.addMethod("tel", function(value, element) {
        return this.optional(element) || (Exp.tel.test(value));
    },"请正确填写固定电话号码(如：010-80101011)");
    // 手机 支持最新的18、17开头号码
    $.validator.addMethod("mobile", function(value, element) {
        return this.optional(element) || (Exp.mobile.test(value));
    },"您输入的位数不对，手机号只能是11位哦");
    // QQ号码
    $.validator.addMethod("qq", function(value, element) {
        return this.optional(element) || (Exp.qq.test(value));
    },"请正确填写您的QQ号码");
    //邮箱
    $.validator.addMethod("email", function(value, element) {
        return this.optional(element) || (Exp.email.test(value));
    }, '请输入正确的E-mail地址');
    //邮编
    $.validator.addMethod("zip", function(value, element) {
        return this.optional(element) || (Exp.zip.test(value));
    }, '请输入正确的邮编号码');
    //URL
    $.validator.addMethod("url", function(value, element) {
        return this.optional(element) || (Exp.url.test(value));
    }, '请输入正确URL地址，如：http://www.google.com');
    // 身份证号
    $.validator.addMethod("idcard",function(value, element) {
        return this.optional(element) || (idcard.test(value))
    },'请输入正确的15、18位身份证号码');

    //颜色验证
    $.validator.addMethod("color", function(value, element, param) {
        return this.optional(element) || (Exp.color.test(value));
    },"颜色值填写错误");

    //图片文件
    $.validator.addMethod("image", function(value, element, param) {
        return this.optional(element) || (Exp.image.test(value));
    },"请上传png，jpg，bmp，gif，jpeg格式图片");

    //附件
    $.validator.addMethod("file", function(value, element, param) {
        return this.optional(element) || (Exp.file.test(value));
    },"请上传doc,ppt,xls,pdf,zip,rar格式文件");

    var defaults = {
        'debug': false,                 //进行调试模式（表单不提交）
        'wrapper' : null,               //用什么标签再把errorELement包起来
        'errorElement'  : 'label',       //用什么标签标记错误
        'errorClass'   : "err",         //指定错误提示的css类名
        'ignore': null,                   //对某些元素不进行验证
        'errorPlacement' : function (error, element) {    //更改错误信息显示的位置
            element.parent().append(error)
        },
        'success': function (label) {
            label.addClass("ok").text("ok!")
        },
        'submitHandler': function(form){       //提交事件
            form.submit()
        },
        'rules' : {},
        'messages': {}
    };

    var Validate = {
        /**
         *   添加验证规则
         *   方法：
         *   new Validate.AddMethod('规则名称'，function(value, element){
         *      执行代码
         *   },'提示信息’);
         */

        AddMethod : function (name,method,message) {
            return $.validator.addMethod(name,method,message);
        },

        /**
         *   表单验证
         */
        checked : function (select,options) {
            select = this.select = $(select);
            options = $.extend({}, defaults, options);
            select.validate(options);
        }
    }

    module.exports = Validate;
});