<!--
  - Copyright © 2023 Enaium <enaium@outlook.com>
  -
  - This work is free. You can redistribute it and/or modify it under the
  - terms of the Do What The Fuck You Want To Public License, Version 2,
  - as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
  -->

<script setup>
import {onMounted, reactive} from "vue";
import {loginApi, sendMsgApi} from "@/api/frontend/login.js";
import {useRouter} from "vue-router";
import {base} from "@/js/frontend/base.js";

const router = useRouter();

const data = reactive({
  form: {
    phone: '',
    code: ''
  },
  msgFlag: false,
  loading: false
})

const getCode = () => {
  data.form.code = ''
  const regex = /^(13[0-9]{9})|(15[0-9]{9})|(17[0-9]{9})|(18[0-9]{9})|(19[0-9]{9})$/;
  if (regex.test(data.form.phone)) {
    data.msgFlag = false
    //data.form.code = (Math.random()*1000000).toFixed(0)
    sendMsgApi({phone: data.form.phone})
  } else {
    data.msgFlag = true
  }
};

const btnLogin = async () => {
  if (data.form.phone && data.form.code) {
    data.loading = true
    const res = await loginApi(data.form)
    data.loading = false
    if (res.code === 1) {
      sessionStorage.setItem("userPhone", data.form.phone)
      await router.push({path: "/frontend"})
    } else {
      $notify({type: 'warning', message: res.msg});
    }
  } else {
    $notify({type: 'warning', message: '请输入手机号码'});
  }
};

onMounted(() => {
  base()
})
</script>

<template>
  <div id="login" v-loading="data.loading">
    <div class="divHead">登录</div>
    <div class="divContainer">
      <el-input placeholder=" 请输入手机号码" v-model="data.form.phone" maxlength='20'/>
      <div class="divSplit"></div>
      <el-input placeholder=" 请输入验证码" v-model="data.form.code" maxlength='20'/>
      <span @click='getCode'>获取验证码</span>
    </div>
    <div class="divMsg" v-if="data.msgFlag">手机号输入不正确，请重新输入</div>
    <el-button type="primary" :class="{btnSubmit:1===1,btnNoPhone:!data.form.phone,btnPhone:data.form.phone}"
               @click="btnLogin">
      登录
    </el-button>
  </div>
</template>

<style scoped>
@import "@/styles/frontend/index.css";
@import "@/styles/frontend/login.css";
</style>