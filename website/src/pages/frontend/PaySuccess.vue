<!--
  - Copyright © 2023 Enaium <enaium@outlook.com>
  -
  - This work is free. You can redistribute it and/or modify it under the
  - terms of the Do What The Fuck You Want To Public License, Version 2,
  - as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
  -->

<script setup>
import {onMounted, reactive} from "vue";
import {base} from "@/js/frontend/base.js";
import {useRouter} from "vue-router";

const router = useRouter()

const data = reactive({
  finishTime: ''
})

onMounted(() => {
  base()
  getFinishTime()
})

function goBack() {
  router.push({path: "/frontend"})
}

function toOrderPage() {
  router.push({path: "/frontend/order"})
}

function toMainPage() {
  router.push({path: "/frontend"})
}

//获取送达时间
function getFinishTime() {
  let now = new Date()
  let hour = now.getHours() + 1
  let minute = now.getMinutes()
  if (hour.toString().length < 2) {
    hour = '0' + hour
  }
  if (minute.toString().length < 2) {
    minute = '0' + minute
  }
  data.finishTime = hour + ':' + minute
}
</script>

<template>
  <div id="pay_success" class="app">
    <div class="divHead">
      <div class="divTitle">
        <i class="el-icon-arrow-left" @click="goBack"></i>
        菩提阁
        <img src="@/assets/frontend/home.png" @click="toMainPage"/>
      </div>
    </div>
    <div class="divContent">
      <img src="@/assets/frontend/success.png"/>
      <div class="divSuccess">下单成功</div>
      <div class="divDesc">预计{{ data.finishTime }}到达</div>
      <div class="divDesc1">后厨正在加紧制作中，请耐心等待~</div>
      <div class="btnView" @click="toOrderPage">查看订单</div>
    </div>
  </div>
</template>

<style scoped>
@import "@/styles/frontend/index.css";
@import "@/styles/frontend/pay-success.css";
</style>