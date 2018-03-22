<template>
  <el-main class="login">
    <h3>Вход</h3>
    <el-form :model="inForm" :rules="rules" :status-icon="true" label-width="90px">
      <el-form-item label="E-mail:" prop="email">
        <el-input v-model="inForm.email"></el-input>
      </el-form-item>
      <el-form-item label="Пароль:" prop="password">
        <el-input type="password" v-model="inForm.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="signIn">Войти</el-button>
        <router-link to="/sign-up"><el-button>Создать</el-button></router-link>
      </el-form-item>
    </el-form>
  </el-main>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'login',
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
      inForm: {
        email: '',
        password: '',
      },
      rules: {
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
  methods: {
    signIn() {
      firebase.auth().signInWithEmailAndPassword(this.inForm.email, this.inForm.password).then(
        (user) => {
          this.$message({
            message: `Добро пожаловать. Снова.`,
            type: 'success',
          });
          this.$router.push({
            name: 'UserProfile',
            params: { userId: user.uid },
          });
        },
        (err) => {
          this.$message({
            message: `Ошибка входа: ${err.message}`,
            type: 'error',
          });
        },
      );
    },
  },
};
</script>
