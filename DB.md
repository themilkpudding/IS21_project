**users**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| login | string | unique not null |
| password | string | not null |
| nickname | string | not null |
| token | string | |
| money | integer | 100 by default |

**person_classes**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| name | string | not null |
| type | string | not null |
| cost | integer | 0 by default |
| hp | integer | 50 by default |

**users_person_classes**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| user_id | integer | not null |
| person_class_id | integer | not null |
| selected | boolean | false by default |

**rooms**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| status | string | 'open'/'closed'/'started' |

**room_members**
| name | type | comment |
| - | - | - |
| id | integer | primary key |
| room_id | integer | not null |
| user_id | integer | not null |
| type | string | 'owner'/'participant' |
| status | string | 'ready'/'started' |

**hashes**

В этой таблице только одна запись

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
| created | integer | current datetime |


