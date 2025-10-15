| **Статус** | Не автоматизирован |
|------------|-------------------|
| **Идентификатор** | BE-3 |
| **Приоритет** | Высокий |
| **Название тест-кейса** | Успешная авторизация пользователя |
| **Указание на модуль тестирования** | User → login |
| **Исходные данные** | Логин: `testtest`<br> Пароль: `testtest`<br> rnd: `testtest` |
| **Шаги тест-кейса** | 1. Выполнить команду: `http://knightwars.local/api?method=login&login=testtest&passwordHash=md5(testtesttesttest)&rnd=testtest`<br>2. Проверить ответ |
| **Ожидаемый результат** | Ответ содержит `result: 'ok'`, `data` с id, nickname, token |test