<?php

class Answer {
    static $CODES = array(
        '101' => 'Param method not setted',
        '102' => 'Method not found',
        '242' => 'Params not set fully',
        '404' => 'Not found',
        '705' => 'User is not found',
        '706' => 'Character is not found',
        '1001' => 'Params login or password not set',
        '1002' => 'Wrong login or password',
        '1003' => 'Error to logout user',
        '1004' => 'Error to register user',
        '1005' => 'User is no exists',
        '1006' => 'User with this email is already registered',
        //lobby
        '2001' => 'Error creating room',
        '2002' => 'Error adding user to room',
        '2003' => 'Room not found',
        '2004' => 'User already in room',
        '2005' => 'User is already owner of this room',
        '2006' => 'The user is already playing',
        '2007' => 'The room is not available',
        '2008' => 'User is not in room',
        '2009' => 'Owner cannot kick yourself',
        '2010' => 'Only the owner can kick out participants of the room.',
        '2011' => 'User to kick not found in room',
        '2012' => 'Error deleting user',
        '2013' => 'Not enough players to start game (need 3 players)',
        '2014' => 'You cannot start a room: you are either not the owner or you are not in the room',
        '2015' => 'Room not found or not open',
        '2016' => 'Rooms data not changed',
         //menu
        '3001' => 'No classes found',
        '3002' => 'Class not found',
        '3003' => 'User not found',
        '3004' => 'Insufficient funds',
        '3005' => 'Error during purchase',
        '3006' => 'Class not owned',
        '3007' => 'Class already purchased',
        //store
        '4001' => 'Item not found',
        '4002' => 'Not enough money to buy',
        '4003' => 'Item already owned',
        '4004' => 'Error purchasing item',
        '4005' => 'Invalid consumable type',
        '4006' => 'Maximum arrows limit reached (50)',
        '4007' => 'Maximum potions limit reached (3)',
        '4008' => 'Error purchasing consumables',
        //math
        '8001' => 'Enter at least one value',
        '8002' => 'The discriminant cannot be less than zero',
        '8003' => 'No real roots found',
        //other
        '9000' => 'Unknown error'
    );

    static function response($data) {
        if ($data) {
            if (!is_bool($data) && array_key_exists('error', $data)) {
                $code = $data['error'];
                return [
                    'result' => 'error',
                    'error' => [
                        'code' => $code,
                        'text' => self::$CODES[$code]
                    ]
                ];
            }
            return [
                'result' => 'ok',
                'data' => $data
            ];
        }
        $code = 9000;
        return [
            'result' => 'error',
            'error' => [
                'code' => $code,
                'text' => self::$CODES[$code]
            ]
        ];
    }
}
