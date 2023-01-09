<!--
  - Copyright © 2023 Enaium <enaium@outlook.com>
  -
  - This work is free. You can redistribute it and/or modify it under the
  - terms of the Do What The Fuck You Want To Public License, Version 2,
  - as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
  -->

<script setup>
import "@/styles/frontend/no-wify.css"
import {onMounted} from "vue";
import {base} from "@/js/frontend/base.js";
import {useRouter} from "vue-router";

const router = useRouter()

onMounted(() => {
  base()
})

const goBack = () => {
  router.back()
};
const toPagePrev = () => {
  router.back()
};
</script>

<template>
  <div id="no_wifi" class="app">
    <div class="divHead">
      <div class="divTitle">
        <i class="el-icon-arrow-left" @click="goBack"></i>菩提阁
      </div>
    </div>
    <div class="divContent">
      <img src="@/assets/frontend/no_wifi.png"/>
      <div class="divDesc">网络连接异常</div>
      <div class="btnRefresh" @click="toPagePrev">点击刷新</div>
    </div>
  </div>
</template>

<style scoped>

</style>