# Фичи
* Синхронизация c Google Drive
* Возможность прикрепить к заданию координату!


## Материалы
- https://ionicframework.com/docs/native/sqlite
- https://devdactic.com/sqlite-ionic-app-with-capacitor/
- https://github.com/capacitor-community/sqlite/blob/master/docs/Ionic-Angular-Usage.md
- https://indepth.dev/posts/1451/ngrx-best-practices-new


## Capacitor: Инициализация проекта
```
# Install the Capacitor plugin
npm install @capacitor-community/sqlite

# Add the native platforms
ionic build
npx cap add ios
npx cap add android
```
## Capacitor: Сборка и запуск проекта
```
# для копирования вэб-артефактов в android-проект.
npx cap copy

npx cap sync

npx cap sync android

ionic capacitor open android

ionic cap run android --livereload --external

```

## Capacitor: Сборка Релиза
https://ionicframework.com/docs/cli/commands/capacitor-build
```
# Сборка capacitor ionic-проекта в production окружении
ionic capacitor build android --configuration=production
```

## Cordova
Запуск в режиме браузера: `ionic cordova run browser --livereload`
[Using Cordova Plugins and Ionic Native|https://capacitorjs.com/docs/v2/cordova/using-cordova-plugins]

## Логика
при отметке задачи выполненной, происходит проход по всему дереву, которому принадлежит эта задача, и если она последняя савшая выполненной, выполненными становятся все задачи вверх по дереву, у которых выполненны все дочерние.

## Синхронизация

## Локализация
https://phrase.com/blog/posts/localizing-ionic-applications-with-ngx-translate/

### Google login
#### Native Google Plus plugin
[Страница плагина Google Plus|https://ionicframework.com/docs/native/google-plus]
#### (проблемы с silent login)Capacitor плагин CapacitorGoogleAuth
Проблемы с работой метода refresh(), который не работает при старте приложения, с ошибкой `core.mjs:6469 ERROR TypeError: Cannot read properties of undefined (reading 'getAuthInstance')`.
##### Материалы
[How to implement Google OAuth2 in a Capacitor/Ionic app|https://mariana-costa.web.app/writing/capacitor-google-oauth/]
[How to add Capacitor Google Sign In to your Ionic App|https://devdactic.com/capacitor-google-sign-in/]
[article title|https://enappd.com/blog/google-login-in-ionic-capacitor-app-with-angular/178/]
##### Либы
[@reslear/capacitor-google-auth|https://www.npmjs.com/package/@reslear/capacitor-google-auth]
[CapacitorGoogleAuth|https://github.com/CodetrixStudio/CapacitorGoogleAuth]
https://github.com/capacitor-community/speech-recognition

### Google Drive API
[Store application-specific data|https://developers.google.com/drive/api/v3/appdata]
[Google drive scopes|https://developers.google.com/drive/api/v3/about-auth]



### Синхронизация материалы
[Calendar:Syncing Algorithm|https://wiki.mozilla.org/Calendar:Syncing_Algorithm]
[A simple synchronization algorithm|https://unterwaditzer.net/2016/sync-algorithm.html]

### Google Drive API
[Drive API JavaScript Quickstart|https://developers.google.com/drive/api/quickstart/js]
[Display the Google picker|https://developers.google.com/drive/api/v3/picker]
### Google Drive for App API
Не подходит, т.к. скрытая папка приложения недоступна пользователю и другим приложениям.
[Store application-specific data|https://developers.google.com/drive/api/v3/appdata]

### Google Tasks API
Tasks API : https://developers.google.com/tasks/reference/rest/
Javascript library: https://github.com/google/google-api-javascript-client


# Локализация
https://phrase.com/blog/posts/localizing-ionic-applications-with-ngx-translate/

# Миграция данных при установке новой версии.
В таблице БД, установленной на устройстве есть данные о текущей версии приложения. В строке с данными о последней миграции.
Приложение, при старте сравнивает свою версию и версию из последней миграции БД.
В случае, если версия приложения больше, чем версия БД, значит произошло обновлнение ранее установленного приложения. Происходит поэтапное выполнение скриптов миграции БД. Каждый скрипт соовтетствует своей версии.

# Обновление дистрибутива из приложения
## Скачать файл
https://ionicframework.com/docs/v5/native/file-transfer

### При скачивании файла, возвращается ошибка 401 несмотря на то, что файл в источнике не ограничен
https://stackoverflow.com/a/35381787/3201594
## Открыть файл
https://ionicframework.com/docs/native/file-opener
https://forum.ionicframework.com/t/ionic-2-fileopener-open-an-apk-file-from-download-path/83499/3
## При сборке ошибка Error: "package android.support.* does not exist"
https://github.com/ionic-team/capacitor/issues/2822#issuecomment-637361632
```
npm install jetifier
npx jetify
npx cap sync android
```

# Генерация ресурсов. Иконка и Splashscreen
Утилита https://github.com/ionic-team/capacitor-assets
## Генерация ресурвов для android
1) Создавть в корне проекта папку `resources` со стркутурой:
```
resources/
├── android/
│   ├── icon-background.png
│   └── icon-foreground.png
├── icon.png
└── splash.png
```
2)
```cordova-res android --skip-config --copy```


## Plugins
https://ionicframework.com/docs/native/social-sharing
https://ionicframework.com/docs/native/file/
https://ionicframework.com/docs/v3/native/file-chooser/
https://capacitorjs.com/docs/apis/network


## Библиотеки
https://github.com/ionic-team/capacitor-assets

## Материалы
https://github.com/ngrx/platform/tree/master/projects/example-app
https://habr.com/ru/company/tinkoff/blog/497282/
[BL and SQL #1|https://www.vertabelo.com/blog/why-sql-is-neither-legacy-nor-low-level-but-simply-awesome/]
[BL and SQL #2|https://www.vertabelo.com/blog/business-logic-in-the-database-yes-or-no-it-depends/]
[SQLite triggers|https://proandroiddev.com/sqlite-triggers-android-room-2e7120bb3e3a]


## Качество кода
* [Установка Husky|https://typicode.github.io/husky/#/]
### Инструменты
* eslint
* stylelint
* prettier
* husky
* lint-staged

## Структура feature-модуля / корневого модуля.
* models - интерфейсы модели данного feature-модуля
* modules - feature-модули и прочие, являющиеся дочерними, для данного
* services - сервисы. В случае, если сервисы могут быть переиспользованы, следует из выностить в отдельный feature-модуль.
* store - boilerplate для store данного feature-модуля.
* pages - компоненты, для которых описан роутинг, и которые доступны по определённому адресу. Как правило являются контейнерами.
* components - Контейнеры, и простые компоненты, являющиеся строительными блоками для ui.