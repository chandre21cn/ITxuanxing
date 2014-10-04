<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="renderer" content="webkit">
    <meta name="keywords" content="" />
    <meta name="description" content="" />
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <title>首页</title>
    <link href="http://www.itxuanxing.com/css/header.css" rel="stylesheet" type="text/css" />
    <link href="http://www.itxuanxing.com/css/mainbody.css" rel="stylesheet" type="text/css" />
    <style>

        .FileUpload-Box {margin-bottom: 15px;}
        .FileUpload-Box .info {font-size:12px; color:#999; line-height:1.5}
        .EditPics {width:380px;height:316px; overflow: hidden; float:left; vertical-align: middle; background: #F3F3F3 url(img/nopics.png) no-repeat center; border:1px solid #ddd; margin-right:20px;}
        .EditPics img {visibility: hidden;}
        .PreviewPics { float:left;}
        .PreviewPics .preview1 {overflow: hidden; background: #F3F3F3; border:1px solid #DDD}
        .PreviewPics img {visibility: hidden;}
        .dialog-btn { clear:both; padding-top: 15px; text-align: right;}
        .dialog-btn .btn-save {background: url(img/btn-save.png) no-repeat left top; border:0;padding:0;margin:0; width:70px; height:35px; cursor: pointer;}
        .dialog-btn .btn-save:hover{background-position: 0 -35px}
        .jcrop-keymgr {opacity: 0; filter:alpha(opacity="0");  }

        /*评分*/
            .star-small,.star-small .star-show,.star-big, .star-big .star-show, .star-small a , .star-big a
            { display:inline-block; *display:inline;*zoom:1; width:95px; height:16px; vertical-align: middle; font-size:0; line-height:0;background: url(img/star.png) no-repeat 0 0;}
            .star-small a {width:16px; height: 16px;padding-right: 3px;}
            .star-small .star-show,.star-small a.on {background-position: 0 -16px;}
            .star-big, .star-big .star-show,.star-big a {height:24px; width:143px;background: url(img/star_big.png) no-repeat 0 0;}
            .star-big a {width:24px; height: 24px;padding-right: 4px;}
            .star-big .star-show , .star-big a.on{background-position: 0 -24px}
            .star-msg {height:20px; line-height:20px; display: inline-block; *display: inline;*zoom:1; font-size:12px; vertical-align: middle}
    </style>
</head>
<body>
    <?php require_once("header.php"); ?>
    

    <div>
        <a href="javascript:void(0)" class="edit-avatar"><img src="http://www.cio.com.cn/avatar/big/3249" alt="" width="80" height="80" class="useravatar"></a>
    </div>
    <div>
        <p>显示评分</p>
        <div class="star-small"><p class="star-show" style="width:75%"></p></div>
        <div class="star-big "><p class="star-show" style="width:28%"></p></div>
        <p>评分</p>
        <div class="star-small star-scoring"><a href="javascript:void(0)"></a><a href="javascript:void(0)"></a><a href="javascript:void(0)"></a><a href="javascript:void(0)"></a><a href="javascript:void(0)"></a><input type="hidden" name="star" value=""/></div>
        <div class="star-big star-scoring">
            <a href="javascript:void(0)" data-msg="不很理想"></a>
            <a href="javascript:void(0)" data-msg="还凑合"></a>
            <a href="javascript:void(0)" data-msg="一般"></a>
            <a href="javascript:void(0)" data-msg="好"></a>
            <a href="javascript:void(0)" data-msg="非常好"></a>
            <input type="hidden" name="star" value=""/>
        </div>

    </div>
    <form method="post" action="/user/regstep2" class="form1" data-validate="true" autosave="true" data-cookiename="login">
        <div class="form-item">
            <span class="label">姓名：</span>
            <div>
                <input type="text" name="name" class="text"  data-rule-required="true"  data-rule-repeat="true" data-rule-filter="true" data-rule-coe="true" data-msg-required="请填写真实姓名" />
                <span class="form-tips">*</span>
                <div class="show-msg">请填写真实姓名</div>
            </div>
        </div>
        <div class="form-item">
            <span class="label">手机号：</span>
            <div>
                <input type="text" name="phone" class="text"  autocomplete="true" data-complete-url = "/test/get_industry.php"/>
                <span class="form-tips">*</span>
                <div class="show-msg">请填写真实的手机号码，只用于短信验证</div>
            </div>
        </div>
        <div class="form-item">
            <input type="submit" value="确定" class="save">
        </div>

    </form>

    <?php require_once("footer.php"); ?>
</body>
</html>

<script id="PicsCrop" type="text/html">
    <div class="FileUpload-Box">
        <a href="javascript:void(0);" id="Pics-Upload">选择文件</a>
        <p class="info">图片尺寸<span>{{width}}*{{height}}px</span>，文件最大<span>{{fileSize}}</span>，支持<span>{{fileType}}</span></p>
    </div>
    <div>
        <div class="EditPics"><img src="" id="crop-target"/></div>
        <div class="PreviewPics">
            <p class="preview1" style="width:{{width}}px;height:{{height}}px"><img src="" id="crop-preview"/></p>
        </div>
        <form action="crop.php" method="post" id="CropForm">
            <div class="dialog-btn">
                <input type="hidden" id="crop-pics" name="img" />
                <input type="hidden" id="crop-x" name="x" />
                <input type="hidden" id="crop-y" name="y" />
                <input type="hidden" id="crop-w" name="w" />
                <input type="hidden" id="crop-h" name="h" />
                <input type="hidden" name="width" value="{{width}}"/>
                <input type="hidden" name="height" value="{{height}}" />
                <input type="submit" value="" class="btn-save"/>
            </div>
        </form>
    </div>
</script>
