<template>
  <el-main class="sign-up">
    <p>Мы вас не узнали.</p>
    <p>Создайте новый аккаунт или войдите.</p>
    <el-form :model="regForm" :rules="rules" status-icon=true label-width="90px">
      <el-form-item label="Имя:" prop="name">
        <el-input v-model="regForm.name"></el-input>
      </el-form-item>
      <el-form-item label="E-mail:" prop="email">
        <el-input v-model="regForm.email"></el-input>
      </el-form-item>
      <el-form-item label="Пароль:" prop="password">
        <el-input type="password" v-model="regForm.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="signUp">Создать</el-button>
        <router-link to="/login"><el-button>Войти</el-button></router-link>
      </el-form-item>
    </el-form>
  </el-main>
</template>

<script>
import firebase from 'firebase';
import { db } from '../../config/firebase';

export default {
  name: 'signUp',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Введите пароль'));
      } else if (value.length < 4) {
        callback(new Error('Пароль должен быть длинее 3х символов'));
      } else {
        callback();
      }
    };
    return {
      regForm: {
        name: '',
        email: '',
        password: '',
      },
      rules: {
        name: [
          { required: true, message: 'Укажите ваше имя', trigger: 'blur' },
          { min: 2, max: 30, message: 'Имя от 2 до 30 символов', trigger: 'blur' },
        ],
        email: [
          { required: true, message: 'Укажите вашу электронную почту', trigger: 'blur' },
          { type: 'email', message: 'Введите корректный E-mail', trigger: 'blur,change' },
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    randomAvatar() {
      const min = 2;
      const max = 9;
      return Math.floor(Math.random() * ((max - min) + 1)) + min;
    },
    randomAvatar3() {
      const min = 2;
      const max = 9;
      let randRes = '';
      for (let x = 0; x < 3; x += 1) {
        randRes += Math.floor(Math.random() * ((max - min) + 1)) + min;
      }
      return randRes;
    },
  },
  methods: {
    signUp() {
      firebase.auth().createUserWithEmailAndPassword(this.regForm.email, this.regForm.password).then(
        (user) => {
          // записываем данные нового юзера в бд
          const newUserData = {
            name: this.regForm.name,
            email: user.email,
            avatar: `https://api.adorable.io/avatars/face/eyes${this.randomAvatar}/nose${this.randomAvatar}/mouth1/${this.randomAvatar3}`,
            raiting: 0,
            streamer: 0,
            comments: 0,
          };

          const updates = {};
          updates[`/users/${user.uid}`] = newUserData;

          db.ref().update(updates);

          this.$message({
            message: `Добро Пожаловать, ${this.regForm.name}`,
            type: 'success',
          });
          this.$router.replace('user');
        },
        (err) => {
          this.$message({
            message: `Ошибка: ${err.message}`,
            type: 'error',
          });
        },
      );
    },
  },
};
</script>
