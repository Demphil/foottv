<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

// التحقق من الصلاحيات
if ($_SERVER['REQUEST_METHOD'] !== 'POST'  !isset($data['api_key'])  $data['api_key'] !== 'YOUR_SECRET_KEY') {
    http_response_code(403);
    die(json_encode(['error' => 'Unauthorized']));
}

// التحقق من صحة التواريخ
$currentDate = new DateTime();
$validMatches = array_filter($data['matches'], function($match) use ($currentDate) {
    try {
        $matchDate = new DateTime($match['date']);
        return $matchDate >= $currentDate;
    } catch (Exception $e) {
        return false;
    }
});

// حفظ البيانات
file_put_contents('../data/matches.json', json_encode([
    'last_updated' => date('c'),
    'matches' => array_values($validMatches) // إعادة ترقيم المصفوفة
]));

echo json_encode(['success' => true, 'valid_matches' => count($validMatches)]);
