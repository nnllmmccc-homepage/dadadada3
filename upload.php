<?php
header('Content-Type: application/json; charset=utf-8');

$uploadDir = __DIR__ . '/uploads/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if (!isset($_FILES['file'])) {
    echo json_encode(['error' => 'ファイルがありません']);
    exit;
}

$ext = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
$randomName = substr(str_shuffle('abcdefghijklmnopqrstuvwxyz0123456789'), 0, 8) . '.' . $ext;
$uploadFile = $uploadDir . $randomName;

if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadFile)) {
    $url = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://{$_SERVER['HTTP_HOST']}/uploads/$randomName";
    echo json_encode(['url' => $url]);
} else {
    echo json_encode(['error' => 'アップロードに失敗しました']);
}
?>
