# Top Comment System [tcs]

### flow:
- webpack
- vue
- vue2-filters
- firebase
- element
- sass

### structure:
- - [x] **sign-up & login** (создание аккаунта и вход с использованием firebase)
- - [x] **stream list** (только активные стримы)
- - [x] **create stream** (создание стрима с возможностью вставить url и последующее управление)
- - [x] **stream page** (страница с запущенным стримом)
  - - [x] **comment form** (форма отправки комментария с таймером раунда)
  - - [x] **comments list** (список комментариев к данному стриму в текущем раунде с оценками)
  - - [x] **top comments** (список топ10 комментариев к текущему стриму)
  - - [x] **top users** (список топ5 комментаторов текущего стрима)
- - [ ] **top stream comments** (список топ100 комментариев определенного стримера за все время)
- - [ ] **top stream users** (список топ100 комментаторов определенного стримера за все время)
- - [x] **user profile** (страница пользователя с рейтингом)
  - - [x] **top user comments by streamer** (список комментариев, которые находятся в топе у стримеров, упорядоченных по стримерам)
- - [x] **user list** (все пользователи по рейтингу | только стримеры)
- - [ ] **about** (как пользоваться сервисом)


### firebase config

Чтобы подключить к проекту базу данных firebase необходимо создать файл **firebase.js** в папке **config** следующего содержания:

```
import { initializeApp } from 'firebase';

const app = initializeApp({
  apiKey: 'YOURPROJECT Api Key',
  authDomain: 'YOURPROJECT.firebaseapp.com',
  databaseURL: 'https://YOURPROJECT.firebaseio.com',
  projectId: 'YOURPROJECTID',
  storageBucket: 'YOURPROJECT.appspot.com',
  messagingSenderId: 'YOURPROJECT',
});

export const db = app.database();
export const usersRef = db.ref('users');
export const streamsRef = db.ref('streams');
```