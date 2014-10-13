define("base/common/1/base",["sea-modules/jquery/jquery","sea-modules/lib/template","./common"],function(require){var $=require("sea-modules/jquery/jquery"),template=require("sea-modules/lib/template"),Comm=require("./common");$(function(){$("[data-validate='true']").size()>0&&require.async(["./validate_methods","ajaxform"],function(a){new a.checked("[data-validate='true']",{debug:!1,errorElement:"label",errorClass:"err",ignore:null,errorPlacement:function(a,b){b.parent().find(".show-msg").html(a)},success:function(){},submitHandler:function(a){var b=$(a).find('[type="submit"]');b.removeAttr("disabled").removeClass("disabled"),$(a).ajaxSubmit({dataType:"json",timeout:3e3,error:function(){return b.attr("disabled",!1).removeClass("disabled"),Comm.alertTips({msg:"提交出错！"})},success:function(a){var c=Number(a.status),d=a.url;switch(c){case 1:Comm.alertTips({msg:a.message}),""!=d?window.location.href=d:setTimeout("location.reload();",2e3);break;default:return b.removeAttr("disabled").removeClass("disabled"),Comm.alertTips({msg:a.message})}}}).submit(function(){return!1})}})}),Comm.AutoEmail("[autoemail='true']",{data:gv.autoemail});var AutoIndustry=$("#tags-industry");AutoIndustry.size()>0&&require.async(["tagsedit"],function(){AutoIndustry.tagEditor({autocomplete:{data:gv.URL.GetIndustry,async:!0,ajaxDataType:"xml"},delimiter:" "}),$(document).on("click",".industry-tags a",function(){var a=$(this).text();AutoIndustry.tagEditor("addTag",a)})}),$(document).on("focus",'[autocomplete="true"]',function(){var a=$(this);require.async(["AutoComplete"],function(){a.AutoComplete({data:a.data("complete-url"),ajaxDataType:"xml",maxHeight:300})})}),$(document).on("click",".edit-avatar",function(){var a=$(this),b=a.data("uid");Comm.CropPhoto({title:"上传头像",size:[160,160],data:{userid:b},fileSize:"1024KB",success:function(b){a.find("img").attr("src",b),a.find("input").val(b)}})}),$("#SetPhone").one("click",function(){$("#Phone").removeAttr("disabled").removeClass("disabled")});var wait=60,__time=function(a){0==wait?(a.addClass("btn-orange"),a.html("重新发送"),wait=60):(a.removeClass("btn-orange"),a.html("重新发送("+wait+")"),wait--,setTimeout(function(){__time(a)},1e3))},__SendCode=function(a){var b=$("#Phone").val();return/^0?(13|15|18|17|14)[0-9]{9}$/.test(b)?($.ajax({cache:!0,type:"POST",url:gv.URL.SendCode,data:{phone:b},dataType:"JSON",async:!1,error:function(){return Comm.alertTips({msg:"发送失败，请稍后再试！！"})},success:function(b){var c=Number(b.status);return 1!=c?Comm.alertTips({msg:b.message}):(Comm.alertTips({msg:b.message}),a.removeClass("btn-orange"),__time(a),void 0)}}),void 0):Comm.alertTips({msg:"请输入正确的手机号！"})};$(document).on("click","#SendCode",function(){var a=$(this);return a.hasClass("btn-orange")?__SendCode(a):!1}),$(document).on("focus",'[data-tips="true"]',function(){var that=$(this),amount=that.data("amount"),types=that.data("types");new Comm.TipsInput(that,{data:eval(types),Amount:amount})}),$(document).on("focus",'[data-tips="ajax"]',function(){var a=$(this),b=a.data("amount"),c=$(a.data("equalto")).val(),d=a.data("url"),e={keyword:""};(void 0!=c||""!=c)&&(e={keyword:c}),$.ajax({type:"POST",url:d,data:e,dataType:"json",success:function(c){1==c.status&&new Comm.TipsInput(a,{data:c,Amount:b})}})}),new Comm.Raty(".star-scoring"),$("select").size()>0&&require.async(["selectbox"],function(a){a($("select"))}),$('[autosave="true"]').size()>0&&require.async(["cookie"],function(){var a=function(){var a=$('[autosave="true"]').data("cookiename"),b=JSON.stringify(Comm.serializeJson('[autosave="true"]'));$.cookie(a,b,{path:"/"})};setInterval(a,1e4)}),$(document).on("click",".btn-send-letter",function(){var a=$(this),b={uid:a.data("uid"),name:a.data("name")};require.async(["template","dialog","./validate_methods","ajaxform"],function(a,c,d){var e=a("SendLetter",b),f=c({title:"发私信给："+b.name,content:e,width:"400"}).showModal();new d.checked("#SendLetterForm",{errorElement:"label",errorClass:"err",ignore:null,errorPlacement:function(a,b){b.parent().parent().find(".show-msg").html(a)},success:function(){},submitHandler:function(a){var b=$(a).find('[type="submit"]');b.removeAttr("disabled").removeClass("disabled"),$(a).ajaxSubmit({dataType:"json",timeout:3e3,error:function(){return b.attr("disabled",!1).removeClass("disabled"),Comm.alertTips({msg:"提交出错！"})},success:function(a){var c=Number(a.status);switch(c){case 1:return f.remove(),Comm.alertTips({msg:a.message});default:return b.removeAttr("disabled").removeClass("disabled"),Comm.alertTips({msg:a.message})}}}).submit(function(){return!1})}})})})})}),define("base/common/1/common",["sea-modules/jquery/jquery"],function(a,b,c){var d=a("sea-modules/jquery/jquery"),e={alertTips:function(b){var c={msg:"操作成功！",close:!0};opts=d.extend(!0,{},c,b),a.async(["dialog"],function(a){var b=a({width:200,cancel:!1,content:'<div style="text-align:center;font-size:14px;">'+opts.msg+"</div>"}).showModal();1==opts.close&&setTimeout(function(){b.remove()},2e3)})},AutoEmail:function(a,b){var c,e,f={data:["@163.com","@qq.com","@sina.com","@outlook.com","@shohu.com","@tom.com","@yeah.net","@139.com","@189.cn","@yahoo.cn","@gmail.com"]},g=this.selector=d(a),h=d.extend({},f,b);this.viewhtml=d('<div class="Auto-Complete"><ul></ul></div>');var i='<li class="AutoComplete_title">请选择邮箱后缀</li>';d.each(h.data,function(a,b){i+='<li hz="'+b+'"></li>'}),this.viewhtml.find("ul").empty().append(i),d("body").append(this.viewhtml.hide()),c=this.viewhtml,c.data("elt",g),e=c.find("li:not(.AutoComplete_title)"),e.mouseover(function(){d(this).siblings().filter(".selected").removeClass("selected"),d(this).addClass("selected")}).mouseout(function(){d(this).removeClass("selected")}).mousedown(function(){c.data("elt").val(d(this).text()).change(),c.hide()}),g.keyup(function(a){if(/13|38|40|116/.test(a.keyCode)||""==this.value)return!1;var b=this.value;return-1==b.indexOf("@")?(c.hide(),!1):(e.each(function(){this.innerHTML=b.replace(/\@+.*/,"")+d(this).attr("hz"),this.innerHTML.indexOf(b)>=0?d(this).show():d(this).hide()}).filter(".selected").removeClass("selected"),c.show().css({width:d(this).outerWidth(),left:d(this).offset().left,top:d(this).offset().top+d(this).outerHeight(),position:"absolute",zIndex:"9999"}),0==e.filter(":visible").length?c.hide():e.filter(":visible").eq(0).addClass("selected"),void 0)}).keydown(function(a){38==a.keyCode?e.filter(".selected").prev().not(".AutoComplete_title").addClass("selected").next().removeClass("selected"):40==a.keyCode?e.filter(".selected").next().addClass("selected").prev().removeClass("selected"):13==a.keyCode&&(e.filter(".selected").mousedown(),a.preventDefault())}).focus(function(){c.data("elt",d(this))}).blur(function(){c.hide()})},CropPhoto:function(b){var c={title:"上传图片",size:[160,160],data:[],fileSize:"1024KB",fileType:"*.gif; *.jpg; *.jpeg; *.png;",success:function(){}},f=d.extend({},c,b);a.async(["template","dialog","uploadify","jcrop","ajaxform"],function(a,b){function c(a){d("#crop-x").val(a.x),d("#crop-y").val(a.y),d("#crop-w").val(a.w),d("#crop-h").val(a.h)}function g(a){if(parseInt(a.w)>0){var b=f.size[0]/a.w,c=f.size[1]/a.h;d("#crop-preview").css({width:Math.round(b*i)+"px",height:Math.round(c*j)+"px",marginLeft:"-"+Math.round(b*a.x)+"px",marginTop:"-"+Math.round(c*a.y)+"px"})}}data={title:f.title,width:f.size[0],height:f.size[1],fileSize:f.fileSize,fileType:f.fileType};var h,i,j,k=a("PicsCrop",data),l=b({title:"上传头像",content:k,width:"auto"}).showModal();d("#Pics-Upload").uploadify({auto:!0,multi:!1,uploadLimit:1,formData:f.data,buttonImage:gv.URL.Btn_picsupload,height:35,width:140,removeCompleted:!0,fileObjName:"file",swf:gv.URL.uploadifySwf,uploader:gv.URL.PicsUpload,fileTypeExts:f.fileType,fileSizeLimit:f.fileSize,onUploadSuccess:function(a,b){var k=d.parseJSON(b);1==k.status?(d("#crop-pics").val(k.filelink),d("#crop-target").attr("src",k.filelink),d("#crop-preview").attr("src",k.filelink).css("visibility","visible"),d("#codesrc").val(k.codesrc),d("#crop-target").Jcrop({setSelect:[0,0,f.size[0],f.size[1]],onChange:g,onSelect:g,onSelect:c,boxWidth:380,boxHeight:316,aspectRatio:f.size[0]/f.size[1]},function(){var a=this.getBounds();i=a[0],j=a[1],h=this})):e.alertTips({msg:k.message})}}),d("#CropForm").ajaxForm({dataType:"json",beforeSubmit:function(){e.alertTips({msg:"图像保存中，请稍后！"})},error:function(){e.alertTips({msg:"操作失败，请稍后再试！"})},success:function(a){1==a.status?(f.success(a.picsurl),l.remove(),e.alertTips({msg:a.message})):e.alertTips({msg:a.message})}}).submit(function(){return!1})})},Raty:function(a){var b=this.selector=d(a);b.each(function(){var a=d(this),b=!1,c=null;b=void 0==a.find("a").data("msg")?!1:!0;var e=function(b){var e=a.outerWidth(),f=a.outerHeight(),g=a.offset().top,h=a.offset().left;c=d('<div class="star-msg">'+b+"</div>"),c.css({position:"absolute",top:(f-20)/2+g+"px",left:e+h+"px","z-index":99,display:"none"}).show(),d("body").append(c)};a.find("a").mouseenter(function(){var c=d(this).data("msg"),f=d(this).index();a.find("a").slice(0,f+1).addClass("action"),a.find("a").slice(f+1).removeClass("action"),b&&e(c)}).mouseleave(function(){a.find("a").removeClass("action");var d=a.find("input").val();d=""==d?0:d,a.find("a").slice(0,d).addClass("action"),b&&c.remove()}),a.find("a").click(function(){var b=d(this).index();a.find("input").val(b+1)})})},TipsInput:function(a,b){var c=this.selector=d(a),e={data:{title:"行业",text:["it","intel","IBM"]},AutoClose:!0,Amount:1};c.each(function(){var a=d.extend({},e,b),c=d(this),f=null,g=function(a){var b=c.outerWidth(),e=(c.outerHeight(),c.offset().top),g=c.offset().left;f=d('<div class="tips-input"><div class="arrow-left"><span></span><em></em></div>'+a+"</div>"),f.css({position:"absolute",top:e+"px",left:b+g+20+"px","z-index":99,display:"none"}).show(),d("body").append(f)},h=a.data,i="";h.title&&(i+="<p>"+h.title+"</p>");var k=h.text;for(j in k)i+='<a href="javascript:void(0)">'+k[j]+"</a>";g(i),d("a",f).on("click",function(){for(var b=c.val().split(" "),e=d(this).html(),f=0;f<b.length;f++)(""==b[f]||"undefined"==typeof b[f])&&(b.splice(f,1),f-=1);return d.inArray(e,b)>-1?!1:1===Number(a.Amount)?c.val(e).focus():b.length===Number(a.Amount)?!1:(b.push(e),c.val(b.join(" ")).focus(),void 0)}),a.AutoClose&&c.blur(function(){setTimeout(function(){f.remove()},120)})})},serializeJson:function(a){var b=this.selector=d(a),c={},e=b.serializeArray();return b.serialize(),d(e).each(function(){c[this.name]?d.isArray(c[this.name])?c[this.name].push(this.value):c[this.name]=[c[this.name],this.value]:c[this.name]=this.value}),c}};c.exports=e});
