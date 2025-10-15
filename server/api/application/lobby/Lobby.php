<?php

class Lobby {
    function __construct($db) { 
        $this->db = $db;
    }

    private function isUserPlaying($userId) {
        return boolval($this->db->isUserPlaying($userId));
    }

    private function getUserTypeInRoom($userId) {
        $user = $this->db->getUserTypeInRoom($userId);
        if ($user) {
            return $user->type;
        }
        return false;
    }

    private function leaveParticipantFromRoom($userId) {
        $this->db->leaveParticipantFromRoom($userId);
    }

    public function createRoom($userId) {
        //если юзер уже играет (started) --> error
        if ($this->isUserPlaying($userId)) {
            return ['error' => 2006];
        }
        $userType = $this->getUserTypeInRoom($userId);
        
        //если комната уже создана (owner) --> error
        if ($userType === 'owner') {
            return ['error' => 2005];
        }

        //если юзер является участником другой комнаты (ready) --> leave & create
        if ($userType === 'participant') {
            $this->leaveParticipantFromRoom($userId);
        }

        //создаем комнату
        $this->db->createRoom($userId);
        $this->db->updateRoomHash(md5(rand()));
        return true;
    }

    public function joinToRoom($roomId, $userId) { 
        //проверка, есть ли такая комната
        $room = $this->db->getRoomById($roomId);
        if (!$room) {
            return ['error' => 2003];
        }
        
        //проверка, что комната открыта
        if ($room->status != 'open') {
            return ['error' => 2007];
        }

        //проверка, если юзер уже играет (started) --> error
        if ($this->isUserPlaying($userId)) {
            return ['error' => 2006];
        }
        $userType = $this->getUserTypeInRoom($userId);

        //проверка, если комната уже уже создана юзером (owner) --> error
        if ($userType === 'owner') {
            return ['error' => 2005];
        }

        //если юзер является участником другой комнаты (ready) --> leave & create
        if ($userType === 'participant') {
            $this->leaveParticipantFromRoom($userId);
        }
        
        //добавляем юзера в комнату
        $this->db->addRoomMember($roomId, $userId, 'participant');
        $this->db->updateRoomHash(md5(rand()));
        return true;
    }

    public function leaveRoom($userId) {
        $userType = $this->getUserTypeInRoom($userId);
        
        //если юзер не в комнате, то ошибка
        if (!$userType) {
            return ['error' => 2008];
        }
        
        //если юзер === 'owner', то комната распускается, а если юзер НЕ 'owner', то он удалется из комнаты
        if ($userType === 'owner') {
            $roomMember = $this->db->getRoomMemberByUserId($userId);
            if ($roomMember) {
                //удаляем всех участников комнаты и саму комнату
                $this->db->deleteAllRoomMembers($roomMember->room_id);
                $this->db->deleteRoom($roomMember->room_id);
            }
        } else {
            $this->leaveParticipantFromRoom($userId);
        }
        
        $this->db->updateRoomHash(md5(rand()));
        return true;
    }

    public function dropFromRoom($userId, $targetToken) {
        //получаем инфу о юзере
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        
        //проверяем, что владелец вообще в комнате и является owner
        if (!$roomMember || $roomMember->type !== 'owner') {
            return ['error' => 2010];
        }
        
        //получаем цель по его токену
        $targetUser = $this->db->getUserByToken($targetToken);
        if (!$targetUser) {
            return ['error' => 705];
        }
        
        //находим его id
        $targetId = $targetUser->id;
        
        //проверяем, что владелец не пытается кикнуть себя
        if ($userId == $targetId) {
            return ['error' => 2009];
        }
        
        //получаем информацию о цели для кика в комнате
        $targetRoomMember = $this->db->getRoomMemberByUserId($targetId);
        
        //проверяем, что цель вообще находится в той же комнате
        if (!$targetRoomMember || $targetRoomMember->room_id != $roomMember->room_id) {
            return ['error' => 2011];
        }
        
        // кикаем участника
        $this->db->leaveParticipantFromRoom($targetId);
        $this->db->updateRoomHash(md5(rand()));
        return true;
    }

    public function startGame($userId) {
        //получаем инфу о юзере
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        
        //проверяем, что владелец вообще в комнате и является owner
        if (!$roomMember || $roomMember->type !== 'owner') {
            return ['error' => 2014];
        }
        
        //есть ли такая комната и открыта ли она
        $room = $this->db->getRoomById($roomMember->room_id);
        if (!$room || $room->status != 'open') {
            return ['error' => 2015];
        }
        
        //получаем всех участников комнаты
        $roomMembers = $this->db->getAllRoomMembers($roomMember->room_id);
        
        //проверка, есть ли в комнате 3 пользователя со статусом ready
        $readyPlayers = 0;
        foreach ($roomMembers as $member) {
            if ($member['status'] === 'ready') {
                $readyPlayers++;
            }
        }
        
        if ($readyPlayers < 3) {
            return ['error' => 2013];
        }
        
        //меняем статус комнаты и участников на started
        $this->db->updateRoomStatus($roomMember->room_id, 'started');
        $this->db->updateAllRoomMembersStatus($roomMember->room_id, 'started');
        
        $this->db->updateRoomHash(md5(rand()));
        return true;
    }

    public function getRooms($roomHash) {
        $currentHash = $this->db->getRoomHash();
        
        //если хэш совпадает, то данные не изменились
        if ($roomHash === $currentHash) {
            return ['status' => 'unchanged'];
        }
        
        //получаем все открытые комнаты
        $rooms = $this->db->getOpenRooms();
        
        return [
            'status' => 'updated',
            'hash' => $currentHash,
            'rooms' => $rooms
        ];
    }
}