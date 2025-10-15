| **Статус** | Не автоматизирован |
|------------|-------------------|
| **Идентификатор** | BE-2 |
| **Приоритет** | Высокий |
| **Название тест-кейса** | Регистрация с уже занятым логином |
| **Указание на модуль тестирования** | User → registration |
| **Исходные данные** | Логин: `existinguser`<br> Пароль: `pass123`<br> Никнейм: `ExistingNick` |
| **Шаги тест-кейса** | 1. Выполнить команду: `http://knightwars.local/api?method=registration&login=existinguser&passwordHash=md5(pass123)&nickname=ExistingNick`<br>2. Проверить ответ |
| **Ожидаемый результат** | Ответ содержит `result: 'error'`, `error: { code: 1001, text: 'Is it unique login?' }` |