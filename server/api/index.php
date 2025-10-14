<?php

error_reporting(1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once('application/Answer.php');
require_once('application/Application.php');

function result($params) {
    $method = $params['method'];
    if ($method) {
        $app = new Application();
        switch ($method) {
            // user
            case 'login': return $app->login($params);
            case 'logout': return $app->logout($params);
            case 'registration': return $app->registration($params);
            case 'deleteUser': return $app->deleteUser($params); // для тестеров
            //math
            case 'math': return $app->math($params);
            // chat
            case 'sendMessage': return $app->sendMessage($params);
            case 'getMessages': return $app->getMessages($params);
            //lobby
            case 'createRoom': return $app->createRoom($params);
            case 'joinToRoom': return $app->joinToRoom($params);
            case 'leaveRoom': return $app->leaveRoom($params);
            case 'dropFromRoom': return $app->dropFromRoom($params);
            case 'startGame': return $app->startGame($params);
            case 'getRooms': return $app->getRooms($params);
            //menu
            case 'getUserInfo': return $app->getUserInfo($params);
            case 'getClasses': return $app->getClasses($params);
            case 'buyClass': return $app->buyClass($params);
            case 'selectClass': return $app->selectClass($params);

            default: return ['error' => 102];
        }
    }
    return ['error' => 101];
}

echo json_encode(Answer::response(result($_GET)), JSON_UNESCAPED_UNICODE);
