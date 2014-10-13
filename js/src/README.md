input 快速输入提示
=================
input 标签添加以下属性

静态数据说明：
```text
    data-tips="true"            使用快速输入
    data-amount='1'             可选标签数量，默认1
    data-types='manufacturer'   javascript全局变量名
```
动态数据说明：
```text
    data-tips="ajax"                使用动态数据输入
    data-amount='1'                 可选标签数量，默认1
    data-equalto='#manufacturer'    可选项，取其它input内的数据值作为 ajax 的传参
    data-url="/source/test/get_industry.php"            数据 POST 地址， 返回json值
```
数据格式
```javascript
    {
        status : 1,         // 动态数据此参数为必传值
        title : "标题",       //可选
        text  : ['数据一','数据二','数据三']
    }
```

表单自动保存到cookie
===================
form 属性
---------------
``` text
    autosave="true" 表单是否自动保存，true为表保存，不添加或为其它则不自动保存
    data-cookiename="cookiename"     此属性必须和autosave同时使用，属性值为保存的cookie name
```
cookie值为json字符串
-----------------
``` text
    如：
    {"name":"yourname","tel":"13801099102","sex":"男"，"like[]",["购物","电影","运动"]}
```
``` html
    <form method="post" action="/user/regstep2" class="form1" data-validate="true" autosave="true" data-cookiename="userreg">
        <div class="form-item">
            <span class="label">姓名：</span>
            <div>
                <input type="text" name="name" class="text"  data-rule-required="true"  data-rule-repeat="true" data-rule-filter="true" data-rule-coe="true" data-msg-required="请填写真实姓名" />
                <span class="form-tips">*</span>
                <div class="show-msg">请填写真实姓名</div>
            </div>
        </div>
        <div class="form-item">
            <input type="submit" value="确定" class="save">
        </div>
    </form>
```
自动补全
=================
说明：
``` text
input 上添加
autocomplete="true" data-complete-url = "请求地址"
```
返回xml 数据格式
```text
    <data>
    	<item>One</item>
    	<item>Two</item>
    	<item>Three</item>
    	<item>Four</item>
    	<item>Five</item>
    </data>
```



上传头像
=================
注意： class="edit-avatar" 为事件触发

```html
    <a href="javascript:void(0)" class="edit-avatar">
        <img src="" alt="" width="80" height="80" />
        <input type="hidden" name="avatar" />
    </a>
```

```javascript
    $(document).on('click','.edit-avatar',function(){
        var $this = $(this);
        Comm.CropPhoto({
            title:"上传头像",
            size:[160,160],
            fileSize: "1024KB",
            success: function(url){
                $this.find('img').attr('src',url);
                $this.find('input').val(url);
            }
        })
    });
```
发私信
===================
```text
    使用用说明：
    <a href="javascript:void(0);" data-uid="1" data-name="username" class="btn-send-letter">发私信</a>
    data-uid    接收人ID号
    data-name   接收人昵称
    class="btn-send-letter"     事件触发
```



显示评分
===================
``` html
显示评分
<div class="star-small"><p class="star-show" style="width:75%"></p></div>
<div class="star-big "><p class="star-show" style="width:28%"></p></div>
```
打分
-----------
``` text
注意：
    star-small（小）
    star-big （大）
    <input type="hidden" name="star" value=""/>（放在最后）
    data-msg="提示语"  不添加则无提示语
不带提示
```
``` html
<div class="star-small star-scoring">
    <a href="javascript:void(0)"></a>
    <a href="javascript:void(0)"></a>
    <a href="javascript:void(0)"></a>
    <a href="javascript:void(0)"></a>
    <a href="javascript:void(0)"></a>
    <input type="hidden" name="star" value=""/>
</div>
```
带提示打分
-----------
``` html
<div class="star-big star-scoring">
    <a href="javascript:void(0)" data-msg="不很理想"></a>
    <a href="javascript:void(0)" data-msg="还凑合"></a>
    <a href="javascript:void(0)" data-msg="一般"></a>
    <a href="javascript:void(0)" data-msg="好"></a>
    <a href="javascript:void(0)" data-msg="非常好"></a>
    <input type="hidden" name="star" value="0"/>
</div>
```

表单验证
==============================
例：
``` html
    <form  data-validate="true">
        <div class="form-item">
            <span class="label">姓名：</span>
            <div>
                <input type="text" name="name" class="text"  data-rule-required="true"  data-rule-repeat="true" data-rule-filter="true" data-rule-coe="true" data-msg-required="请填写真实姓名" />
                <span class="form-tips">*</span>
                <div class="show-msg">请填写真实姓名</div>
            </div>
        </div>
        <div class="form-item">
               <input type="submit" value="确定" class="save">
        </div>
    </form>
```
使用方法：
------------------
``` text
     1、form     属性      data-validate="true"
     2、input    属性      data-rule-required="true" data-msg-required="请填写真实姓名"
```
说明
``` text
    data-rule-规则名="true"
    data-msg-规则名="提示信息"             无此填时使用默认提示语
```
规则列表：
------------------
``` text
required:true                必输字段
remote:"check.php"           使用ajax方法调用check.php验证输入值
dateISO:true                 必须输入正确格式的日期(ISO)，例如：2009-06-23，1998/01/22 只验证格式，不验证有效性
number:true                  必须输入合法的数字(负数，小数)
digits:true                  必须输入整数
creditcard:                  必须输入合法的信用卡号
equalTo:"#field"              输入值必须和#field相同
accept:                      输入拥有合法后缀名的字符串（上传文件的后缀）
maxlength:5                  输入长度最多是5的字符串(汉字算一个字符)
minlength:10                 输入长度最小是10的字符串(汉字算一个字符)
rangelength:[5,10]           输入长度必须介于 5 和 10 之间的字符串")(汉字算一个字符)
range:[5,10]                 输入值必须介于 5 和 10 之间
max:5                        输入值不能大于5
min:10                       输入值不能小于10


coe                                 只能输入纯汉字或英文+空格
cae                                 内容只能包含汉字、英文字母或空格
repeat                              不能连续输入3个相同的字符
filter                               不能输入敏感信息内容
it                                  不能只输入it两个字符
mobile_email      手机或邮箱          账号必须为手机号或邮箱地址
username          用户名             6~12个字符，包括字母、数字、下划线，以字母开头，字母或数字结尾
nickname          昵称               只能输入中文、字母、数字或下划线
pass              密码               只能输入6-20个字母、数字、特殊字符
repassword        确认密码            注：密码必须添加 id="password"
datatime          日期时间            请正确填写您的日期(如:2014-01-01 00:00:00)
date              日期               请正确填写您的日期(如:2014-01-01)
dateContrast      日期时间对比验证     注：开始日期必须添加 id="fromdate"
phone             电话号码与手机       请正确填写手机、固定电话号码(如：010-80101011/13801010101)
tel               固定电话            请正确填写固定电话号码(如：010-80101011)
mobile            手机               您输入的位数不对，手机号只能是11位哦
qq                                  请正确填写您的QQ号码
email                               请输入正确的E-mail地址
url                                 请输入正确URL地址，如：http://www.google.com
idcard                              请输入正确的15、18位身份证号码
image             图片文件            请上传png，jpg，bmp，gif，jpeg格式图片
file               附件              请上传doc,ppt,xls,pdf,zip,rar格式文件
```