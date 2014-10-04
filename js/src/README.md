表单自动保存到cookie
===================
``` text
form 属性
    autosave="true" 表单是否自动保存，true为表保存，不添加或为其它则不自动保存
    data-cookiename="cookiename"     此属性必须和autosave同时使用，属性值为保存的cookie name

cookie值为json字符串如：
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


显示评分
===================
``` html
显示评分
<div class="star-small"><p class="star-show" style="width:75%"></p></div>
<div class="star-big "><p class="star-show" style="width:28%"></p></div>
```
打分
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
带提示
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


