| **Статус** | Не автоматизирован |
|------------|-------------------|
| **Идентификатор** | BE-2 |
| **Приоритет** | Высокий |
| **Название тест-кейса** | Регистрация с уже занятым логином |
| **Указание на модуль тестирования** | User → registration |
| **Исходные данные** | Логин: `existing_user_123`<br> Пароль: `password`<br> Никнейм: `existing_nick_123` |
| **Шаги тест-кейса** | 1. Выполнить команду: `http://knightwars.local/api?method=registration&login=test123&passwordHash=md5(testtest)&nickname=test123`<br>2. Проверить ответ |
| **Ожидаемый результат** | Ответ содержит `result: 'error'`, `error: { code: 1001, text: 'Is it unique login?' }` |