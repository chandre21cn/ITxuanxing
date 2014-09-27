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
    <link rel="stylesheet" href="css/style.css"/>
</head>
<body>
    <?php require_once("header.php"); ?>
    <div class="FormBox">
        <form id="form1">
            <div class="form-item">
                <span class="label"><span class="red">*</span>用户名：</span>
                <div>
                    <input type="text" name="username" class="text"  data-rule-required="true"  data-rule-it="true" data-rule-filter="true" data-rule-repeat="true" data-msg-required="请输入账号" />
                </div>
            </div>
            <div class="form-item">
                <button type="submit">提交</button>
            </div>
        </form>
    <?php require_once("footer.php"); ?>
</body>
</html>
