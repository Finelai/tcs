# Top Comment System [tcs]

### flow:
- webpack
- vue
- vuex
- jsonp
- firebase

### structure:
- - [ ] **sign-up & login** (создание аккаунта и вход с использованием firebase)
- - [ ] **stream list** (только активные стримы)
- - [ ] **create stream** (создание стрима с возможностью вставить url и последующее управление)
- - [ ] **stream page** (страница с запущенным стримом)
  - - [ ] **comment form** (форма отправки комментария с таймером раунда)
  - - [ ] **comments list** (список комментариев к данному стриму в текущем раунде с оценками)
  - - [ ] **top comments** (список топ10 комментариев к текущему стриму)
  - - [ ] **top users** (список топ5 комментаторов текущего стрима)
- - [ ] **top stream comments** (список топ100 комментариев определенного стримера за все время)
- - [ ] **top stream users** (список топ100 комментаторов определенного стримера за все время)
- - [ ] **user profile** (страница пользователя с рейтингом)
  - - [ ] **top user comments by streamer** (список комментариев, которые находятся в топе у стримеров, упорядоченных по стримерам)
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
```