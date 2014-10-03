define("base/common/1/base",["sea-modules/jquery/jquery","sea-modules/lib/template","./common"],function(a){var b=a("sea-modules/jquery/jquery");a("sea-modules/lib/template");var c=a("./common");b(function(){b("[data-validate='true']").size()>0&&a.async(["validate_methods","ajaxform"],function(a){new a.checked("[data-validate='true']",{debug:!1,errorElement:"label",errorClass:"err",ignore:null,errorPlacement:function(a,b){b.parent().find(".show-msg").html(a)},success:function(){},submitHandler:function(a){var d=b(a).find('[type="submit"]');d.removeAttr("disabled").removeClass("disabled"),b(a).ajaxSubmit({dataType:"json",timeout:3e3,error:function(){return d.attr("disabled",!1).removeClass("disabled"),c.alertTips({msg:"提交出错！"})},success:function(a){var b=Number(a.status);switch(b){case 1:c.alertTips({msg:a.message}),setTimeout("location.reload();",2e3);break;default:return d.removeAttr("disabled").removeClass("disabled"),c.alertTips({msg:a.message})}}}).submit(function(){return!1})}})}),c.AutoEmail("[autoemail='true']");var d=b("#tags-industry");d.size()>0&&a.async(["tagsedit"],function(){d.tagEditor({autocomplete:{data:gv.URL.GetIndustry,async:!0,ajaxDataType:"xml"},delimiter:" "}),b(document).on("click",".industry-tags a",function(){var a=b(this).text();d.tagEditor("addTag",a)})}),b(document).on("click",".edit-avatar",function(){c.CropPhoto({title:"上传头像",size:[160,160],fileSize:"1024KB",success:function(a){b(".useravatar").attr("src",a)}})})})}),define("base/common/1/common",["sea-modules/jquery/jquery"],function(a,b,c){var d=a("sea-modules/jquery/jquery"),e={alertTips:function(b){var c={msg:"操作成功！",close:!0};opts=d.extend(!0,{},c,b),a.async(["dialog"],function(a){var b=a({width:200,cancel:!1,content:'<div style="text-align:center;font-size:14px;">'+opts.msg+"</div>"}).showModal();1==opts.close&&setTimeout(function(){b.remove()},2e3)})},AutoEmail:function(a,b){var c,e,f={data:["@163.com","@qq.com","@sina.com","@outlook.com","@shohu.com","@tom.com","@yeah.net","@139.com","@189.cn","@yahoo.cn","@gmail.com"]},g=this.selector=d(a),h=d.extend({},f,b);this.viewhtml=d('<div class="Auto-Complete"><ul></ul></div>');var i='<li class="AutoComplete_title">请选择邮箱后缀</li>';d.each(h.data,function(a,b){i+='<li hz="'+b+'"></li>'}),this.viewhtml.find("ul").empty().append(i),d("body").append(this.viewhtml.hide()),c=this.viewhtml,c.data("elt",g),e=c.find("li:not(.AutoComplete_title)"),e.mouseover(function(){d(this).siblings().filter(".selected").removeClass("selected"),d(this).addClass("selected")}).mouseout(function(){d(this).removeClass("selected")}).mousedown(function(){c.data("elt").val(d(this).text()).change(),c.hide()}),g.keyup(function(a){if(/13|38|40|116/.test(a.keyCode)||""==this.value)return!1;var b=this.value;return-1==b.indexOf("@")?(c.hide(),!1):(e.each(function(){this.innerHTML=b.replace(/\@+.*/,"")+d(this).attr("hz"),this.innerHTML.indexOf(b)>=0?d(this).show():d(this).hide()}).filter(".selected").removeClass("selected"),c.show().css({width:d(this).outerWidth(),left:d(this).offset().left,top:d(this).offset().top+d(this).outerHeight(),position:"absolute",zIndex:"9999"}),0==e.filter(":visible").length?c.hide():e.filter(":visible").eq(0).addClass("selected"),void 0)}).keydown(function(a){38==a.keyCode?e.filter(".selected").prev().not(".AutoComplete_title").addClass("selected").next().removeClass("selected"):40==a.keyCode?e.filter(".selected").next().addClass("selected").prev().removeClass("selected"):13==a.keyCode&&(e.filter(".selected").mousedown(),a.preventDefault())}).focus(function(){c.data("elt",d(this))}).blur(function(){c.hide()})},CropPhoto:function(b){var c={title:"上传图片",size:[160,160],fileSize:"1024KB",fileType:"*.gif; *.jpg; *.jpeg; *.png;",success:function(){}},f=d.extend({},c,b);a.async(["template","dialog","uploadify","jcrop","ajaxform"],function(a,b){function c(a){d("#crop-x").val(a.x),d("#crop-y").val(a.y),d("#crop-w").val(a.w),d("#crop-h").val(a.h)}function g(a){if(parseInt(a.w)>0){var b=f.size[0]/a.w,c=f.size[1]/a.h;d("#crop-preview").css({width:Math.round(b*i)+"px",height:Math.round(c*j)+"px",marginLeft:"-"+Math.round(b*a.x)+"px",marginTop:"-"+Math.round(c*a.y)+"px"})}}data={title:f.title,width:f.size[0],height:f.size[1],fileSize:f.fileSize,fileType:f.fileType};var h,i,j,k=a("PicsCrop",data),l=b({title:"上传头像",content:k,width:"auto"}).showModal();d("#Pics-Upload").uploadify({auto:!0,multi:!1,uploadLimit:1,buttonImage:gv.URL.Btn_picsupload,height:35,width:140,removeCompleted:!0,swf:gv.URL.uploadifySwf,uploader:gv.URL.PicsUpload,fileTypeExts:f.fileType,fileSizeLimit:f.fileSize,onUploadSuccess:function(a,b){var e=d.parseJSON(b);1==e.result_code?(d("#crop-pics").val(e.result_des),d("#crop-target").attr("src",e.result_des),d("#crop-preview").attr("src",e.result_des).css("visibility","visible"),d("#crop-target").Jcrop({minSize:[f.size[0],f.size[1]],setSelect:[0,0,f.size[0],f.size[1]],onChange:g,onSelect:g,onSelect:c,boxWidth:380,boxHeight:316,aspectRatio:f.size[0]/f.size[1]},function(){var a=this.getBounds();i=a[0],j=a[1],h=this})):alert("上传失败")}}),d("#CropForm").ajaxForm({dataType:"json",beforeSubmit:function(){e.alertTips({msg:"图像保存中，请稍后！"})},error:function(){e.alertTips({msg:"操作失败，请稍后再试！"})},success:function(a){1==a.status?(f.success(a.picsurl),l.remove(),e.alertTips({msg:a.message})):e.alertTips({msg:a.message})}}).submit(function(){return!1})})}};c.exports=e});
