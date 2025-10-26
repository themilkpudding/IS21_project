# Описание структуры базы данных

## Основные таблицы пользователей

**users**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| login | string | unique not null |
| password | string | not null |
| nickname | string | not null |
| token | string | |

**characters**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| user_id | integer | not null, unique |
| hp | integer | 100 by default |
| defense | integer | 10 by default |
| arrows | integer | 0 by default |
| potions | integer | 0 by default |
| money | integer | 100 by default |

## Система классов

**classes**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| name | string | not null |
| type | string | not null |
| cost | integer | 0 by default |
| hp | integer | 50 by default |
| defense | integer | 0 by default |

**characters_classes**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| character_id | integer | not null |
| class_id | integer | not null |
| selected | boolean | false by default |

## Система предметов

**items**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| name | string | not null |
| item_type | enum | 'weapon'/'helmet'/'chestplate'/'leggings'/'shield' |
| weapon_type | enum | 'sword'/'bow'/'axe'/'staff'/'dagger' or null |
| damage | integer | 0 by default |
| attack_speed | integer | 0 by default |
| attack_distance | integer | 0 by default |
| bonus_defense | integer | 0 by default |
| bonus_hp | integer | 0 by default |
| cost | integer | 0 by default |

**characters_items**

**character_items**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| item_id | integer | not null |
| character_id | integer | nullable |
| room_id | integer | nullable |
| x | integer | nullable |
| y | integer | nullable |
| selected | boolean | false by default |
| quantity | integer | 1 by default |

## Лобби и комнаты

**rooms**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| status | enum | 'open'/'closed'/'started' |

**room_members**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| room_id | integer | not null |
| user_id | integer | not null |
| type | enum | 'owner'/'participant' |
| status | enum | 'ready'/'started' |
| x | integer |  |
| y | integer |  |
| direction | enum | 'left'/'right' |
| hp | integer |  |

## Игровые объекты

**arrows**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| room_id | integer | not null |
| x | integer | position by X |
| y | integer | position by Y |
| direction | enum | 'left'/'right' |
| speed | integer | |
| damage | integer | |

**bots**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| room_id | integer | not null |
| data | string | JSON |

## Вспомогательные таблицы

**hashes**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| chat_hash | string | |
| room_hash | string | |

**messages**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| user_id | integer | not null |
| message | string | |
| created | datetime | current datetime |




