<?php

class Lobby {
    function __construct($db, $user) { 
        $this->db = $db;
        $this->user = $user; 
    }

    public function createRoom($userId) {
        $roomId = $this->db->createRoom();
        if (!$roomId) {
            return ['error' => 2001];
        }
        
        $result = $this->db->addRoomMember($roomId, $userId, 'owner', 'ready');
        if (!$result) {
            return ['error' => 2002];
        }
        
        return [
            'room_id' => $roomId,
            'status' => 'open'
        ];
    }

    public function joinToRoom($params) {
        $user = $this->user->getUser($params['token']);
        if (!$user) {
            return ['error' => 705];
        }
        
        // проверка, есть ли такая комната
        $room = $this->db->getRoomById($params['roomId']);
        if (!$room) {
            return ['error' => 2003];
        }
        
        // проверка, является ли юзер уже участником комнаты
        $existingMember = $this->db->getRoomMember($params['roomId'], $user->id);
        if ($existingMember) {
            if ($existingMember->type === 'owner') {
                return ['error' => 2005];
            }
            return ['error' => 2004];
        }
        
        // добавляем юзера в комнату
        $result = $this->db->addRoomMember($params['roomId'], $user->id, 'participant', 'ready');
        if (!$result) {
            return ['error' => 2002];
        }
        
        return [
            'room_id' => $params['roomId'],
            'status' => 'joined',
            'user_type' => 'participant'
        ];
    }
}