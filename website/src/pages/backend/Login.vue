<!--
  - Copyright © 2023 Enaium <enaium@outlook.com>
  -
  - This work is free. You can redistribute it and/or modify it under the
  - terms of the Do What The Fuck You Want To Public License, Version 2,
  - as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
  -->

<script setup>
import "@/styles/backend/login.css"
import "@/styles/backend/icon/iconfont.css"
import {computed, reactive, ref} from "vue";
import {loginApi} from "@/api/backend/login.js";
import {useRouter} from "vue-router";

const router = useRouter()
const loginForm = ref()

const data = reactive({
  loginForm: {
    username: 'admin',
    password: '123456'
  },
  loading: false
})

const handleLogin = async () => {
  loginForm.value.validate(async (valid) => {
    if (valid) {
      data.loading = true
      let res = await loginApi(data.loginForm)
      if (String(res.code) === '1') {//1表示登录成功
        localStorage.setItem("token", res.data.token)
        localStorage.setItem('userInfo', JSON.stringify(res.data))
        await router.push({path: "/backend/member/list"})
      } else {
        $message.error(res.msg)
        data.loading = false
      }
    }
  })
}

const loginRules = computed(() => {
  const validateUsername = (rule, value, callback) => {
    if (value.length < 1) {
      callback(new Error('请输入用户名'))
    } else {
      callback()
    }
  }
  const validatePassword = (rule, value, callback) => {
    if (value.length < 6) {
      callback(new Error('密码必须在6位以上'))
    } else {
      callback()
    }
  }
  return {
    'username': [{'validator': validateUsername, 'trigger': 'blur'}],
    'password': [{'validator': validatePassword, 'trigger': 'blur'}]
  }
})
</script>

<template>
  <div id="login-app" class="login">
    <div class="login-box">
      <img alt="" src="@/assets/backend/login/login-l.png">
      <div class="login-form">
        <el-form ref="loginForm" :model="data.loginForm" :rules="loginRules">
          <div class="login-form-title">
            <img alt="" src="@/assets/backend/login/logo.png" style="width:139px;height:42px;"/>
          </div>
          <el-form-item prop="username">
            <el-input v-model="data.loginForm.username" auto-complete="off" maxlength="20" placeholder="账号"
                      type="text"/>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="data.loginForm.password" maxlength="20" placeholder="密码"
                      type="password"
                      @keyup.enter.native="handleLogin"/>
          </el-form-item>
          <el-form-item style="width:100%;">
            <el-button :loading="data.loading" class="login-btn" size="medium" style="width:100%;" type="primary"
                       @click.native.prevent="handleLogin">
              <span v-if="!data.loading">登录</span>
              <span v-else>登录中...</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login {
  min-width: 1366px;
}
</style>