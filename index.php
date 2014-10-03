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
        .jcrop-keymgr {
            opacity: 0; filter:alpha(opacity="0");
        }
    </style>
</head>
<body>
    <?php require_once("header.php"); ?>
    

    <div>
        <a href="javascript:void(0)" class="edit-avatar"><img src="http://www.cio.com.cn/avatar/big/3249" alt="" width="80" height="80" class="useravatar"></a>
    </div>

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
