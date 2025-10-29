<?php

class Store {
    function __construct($db) { 
        $this->db = $db;
    }
    
    //покупка шмота (оружие/броня)
    public function buyItem($userId, $itemId) {
        //проверка, существует ли юзер
        $user = $this->db->getUserById($userId);
        if (!$user) {
            return ['error' => 705];
        }
        
        //проверка, существует ли шмот
        $item = $this->db->getItemById($itemId);
        if (!$item) {
            return ['error' => 4001];
        }
        
        //проверка, есть ли у юзера персонаж и деньги
        $character = $this->db->getCharacterByUserId($userId);
        if (!$character) {
            return ['error' => 705];
        }
        
        if ($character->money < $item->cost) {
            return ['error' => 4002];
        }
        
        //проверка, не куплен ли уже такой шмот (по character_id)
        $existingItem = $this->db->getUserItem($character->id, $itemId);
        if ($existingItem) {
            return ['error' => 4003];
        }
        
        //начинаем транзакцию
        $this->db->beginTransaction();
        
        try {
            //списываем деньгу (из characters по character_id)
            $moneyUpdated = $this->db->updateCharacterMoneySubtract($character->id, $item->cost);
            if (!$moneyUpdated) {
                $this->db->rollBack();
                return ['error' => 4004];
            }
            
            //добавляем шмот в инвентарь (по character_id)
            $itemAdded = $this->db->addUserItem($character->id, $itemId);
            if (!$itemAdded) {
                $this->db->rollBack();
                return ['error' => 4004];
            }
            
            $this->db->commit();
            return true;
            
        } catch (Exception $e) {
            $this->db->rollBack();
            return ['error' => 4004];
        }
    }

    //покупка расходников (стрелы/хилки)
    public function buyConsumables($userId, $consumType) {
        //проверка на существование типа расходника
        if ($consumType !== 'arrows' && $consumType !== 'potions') {
            return ['error' => 4005];
        }
        
        //получаем данные юзера и персонажа
        $user = $this->db->getUserById($userId);
        if (!$user) {
            return ['error' => 705];
        }
        
        $character = $this->db->getCharacterByUserId($userId);
        if (!$character) {
            return ['error' => 706];
        }
        
        //определяем стоимость и лимиты в зависимости от типа
        if ($consumType === 'arrows') {
            $cost = 10; // стоимость 10 стрел
            $currentAmount = $character->arrows;
            $maxAmount = 50;
            $buyAmount = 10;
            
            //проверяем лимит
            if ($currentAmount >= $maxAmount) {
                return ['error' => 4006];
            }
            
            //проверяем, не превысит ли покупка лимит
            if ($currentAmount + $buyAmount > $maxAmount) {
                return ['error' => 4006];
            }
            
        } else { // potions
            $cost = 15; // стоимость 1 зелья
            $currentAmount = $character->potions;
            $maxAmount = 3;
            $buyAmount = 1;
            
            // проверяем лимит
            if ($currentAmount >= $maxAmount) {
                return ['error' => 4007];
            }
        }
        
        //проверяем, хватает ли денег у перса
        if ($character->money < $cost) {
            return ['error' => 4002];
        }
        
        //начинаем транзакцию
        $this->db->beginTransaction();
        
        try {
            //списываем деньгу (из characters)
            $moneyUpdated = $this->db->updateCharacterMoneySubtract($character->id, $cost);
            if (!$moneyUpdated) {
                $this->db->rollBack();
                return ['error' => 4008];
            }
            
            //добавляем расходники
            if ($consumType === 'arrows') {
                $consumablesUpdated = $this->db->updateUserArrows($userId, $buyAmount);
            } else {
                $consumablesUpdated = $this->db->updateUserPotions($userId, $buyAmount);
            }
            
            if (!$consumablesUpdated) {
                $this->db->rollBack();
                return ['error' => 4008];
            }
            
            $this->db->commit();
            return [
                'purchased' => $buyAmount,
                'newBalance' => $consumType === 'arrows' ? $currentAmount + $buyAmount : $currentAmount + $buyAmount,
                'moneyLeft' => $character->money - $cost
            ];
            
        } catch (Exception $e) {
            $this->db->rollBack();
            return ['error' => 4008];
        }
    }
}