Инструкция по запуску проекта KnightWars на localhost и подключение базы данных 
1. Установка окружения

Для работы проекта требуется:

OSPanel ≥ 6.0 (Windows)

PHP ≥ 8.3

MySQL 8.0

Проверка версий через командную строку OSPanel:

php -v
mysql --version

2. Разворачивание проекта

Копировать проект в директорию OSPanel:

C:\OSPanel\home\localhost


Создать в корне папку .osp:

C:\OSPanel\home\localhost\.osp


В .osp создать файл project.ini:

[localhost]
php_engine = PHP-8.3
public_dir = {base_dir}/server/api


Перезапустить OSPanel.

Сервер проекта будет доступен по адресу:

http://localhost/

3. Настройка MySQL и phpMyAdmin

phpMyAdmin доступен по адресу:

http://localhost/phpmyadmin/


Конфигурационный файл:

C:\OSPanel\home\phpmyadmin\public\config.sample.inc.php


Переименовать config.sample.inc.php в config.inc.php.

В файле задать следующие настройки:

$cfg['Servers'][$i]['auth_type'] = 'cookie';
$cfg['Servers'][$i]['host'] = 'MySQL-8.0';
$cfg['Servers'][$i]['port'] = '3306';
$cfg['Servers'][$i]['user'] = 'root';
$cfg['Servers'][$i]['password'] = '';
$cfg['Servers'][$i]['AllowNoPassword'] = true;

4. Создание базы данных

Через phpMyAdmin создать базу данных:

knightwars_db


Импортировать дамп knightwars_db.sql.

Таблица users содержит следующие поля:

Поле	Описание
id	уникальный идентификатор
login	логин для авторизации
password_hash	хэш пароля
nickname	отображаемое имя
date	дата регистрации
token	уникальный токен для идентификации

5. Проверка работы

Запустить OSPanel и убедиться, что MySQL и PHP активны.

В браузере открыть:

http://localhost/api?method=login


Ожидаемый ответ JSON:

{"error":101,"text":"Param method not setted"}


Для теста логина с данными из таблицы users:

http://localhost/api?method=login&login=admin&password=123
