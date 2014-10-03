<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST')
{
    $targ_w = $_POST['width'];
    $targ_h = $_POST['height'];
    $jpeg_quality = 100;
    $src = $_POST['img'];
    $img_r = imagecreatefromjpeg($src);
    $dst_r = ImageCreateTrueColor( $targ_w, $targ_h );
    imagecopyresampled($dst_r,$img_r,0,0,$_POST['x'],$_POST['y'],
        $targ_w,$targ_h,$_POST['w'],$_POST['h']);

//    header('Content-type: image/jpeg');
//    imagejpeg($dst_r,null,$jpeg_quality);

    $msg = array(
        "status" => 1,
        "message" => "保存成功！",
        "picsurl" => "/images/1.jpg"
    );
    echo json_encode($msg);

} else {
    $msg = array(
        "status" => 0,
		"message" => "保存失败！"
    );
    echo json_encode($msg);
}

?>