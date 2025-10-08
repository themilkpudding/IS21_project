<?php

class Answer {
    static $CODES = array(
        '101' => 'Param method not setted',
        '102' => 'Method not found',
        '242' => 'Params not set fully',
        '705' => 'User is not found',
        '1001' => 'Is it unique login?',
        '1002' => 'Wrong login or password',
        '1003' => 'Error to logout user',
        '1004' => 'Error to register user',
        '1005' => 'User is no exists',
        '404' => 'Not found',
        '1001' => 'Params login or password not set',
        '1005' => 'Other user is playing wright now. If you doesn`t, please change the password',
        '1006' => 'User with this email is already registered',
        //lobby answers
        '2001' => 'Error creating room',
        '2002' => 'Error adding user to room',
        '2003' => 'Room not found',
        '2004' => 'User already in room',
        '2005' => 'User is already owner of this room',
         //menu answers
        '3000' => 'Placeholder',
        '8001' => 'Enter at least one value',
        '8002' => 'The discriminant cannot be less than zero',
        '8003' => 'No real roots found',
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