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

## Система оружия

**weapons**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| name | string | not null |
| weapon_type | enum | 'sword','bow','axe','staff','dagger' |
| damage | integer | not null |
| attack_speed | integer | 1 by default |
| cost | integer | 0 by default |

**characters_weapons**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| character_id | integer | not null |
| weapon_id | integer | not null |
| selected | boolean | false by default |

## Система брони

**helmets**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| name | string | not null |
| defense | integer | not null |
| hp | integer | 0 by default |
| cost | integer | 0 by default |

**chestplates**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| name | string | not null |
| defense | integer | not null |
| hp | integer | 0 by default |
| cost | integer | 0 by default |

**leggings**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| name | string | not null |
| defense | integer | not null |
| hp | integer | 0 by default |
| cost | integer | 0 by default |

**shields**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| name | string | not null |
| defense | integer | not null |
| cost | integer | 0 by default |

**characters_armor**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| character_id | integer | not null |
| helmet_id | integer | nullable |
| chestplate_id | integer | nullable |
| leggings_id | integer | nullable |
| shield_id | integer | nullable |
| selected | boolean | false by default |

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




