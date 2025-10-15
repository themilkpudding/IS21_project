<?php
class Menu {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getUserInfo($userId) {
        $user = $this->db->getUserById($userId);
        if (!$user) return ['error' => 3001];

        return [
            'id' => $user->id,
            'login' => $user->login,
            'nickname' => $user->nickname,
            'money' => $user->money
        ];
    }

    public function getClasses() {
        return $this->db->getAllPersonClasses();
    }

    public function getUserOwnedClasses($userId) {
        return $this->db->getUserOwnedClasses($userId);
    }

public function buyClass($userId, $classId) {
    $class = $this->db->getPersonClassById($classId);
    $user = $this->db->getUserById($userId);

    if (!$class) return ['error' => 3004];
    if (!$user) return ['error' => 3005];

    $owned = $this->db->getUserPersonClass($userId, $classId);
    if ($owned) return ['error' => 3009];

    if ($user->money < $class->cost) return ['error' => 3006];

    try {
        $this->db->beginTransaction();
        $this->db->updateUserMoneySubtract($userId, $class->cost);
        $this->db->addUserPersonClass($userId, $classId);
        $this->db->commit();
        return ['success' => true];
    } catch (Exception $e) {
        $this->db->rollBack();
        return ['error' => 3007];
    }
}


    public function selectClass($userId, $classId) {
        $owned = $this->db->getUserPersonClass($userId, $classId);
        if (!$owned) return ['error' => 3008];

        $this->db->clearSelectedUserClasses($userId);
        $this->db->setUserSelectedPersonClass($userId, $classId);
        return ['success' => true];
    }
}
