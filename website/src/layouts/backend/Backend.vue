<!--
  - Copyright © 2023 Enaium <enaium@outlook.com>
  -
  - This work is free. You can redistribute it and/or modify it under the
  - terms of the Do What The Fuck You Want To Public License, Version 2,
  - as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
  -->

<script setup>
import {onBeforeUnmount, onMounted, reactive, ref} from "vue";
import "@/styles/backend/icon/iconfont.css"
import "@/styles/backend/index.css"
import "@/styles/backend/common.css"
import "@/styles/backend/page.css"
import {useRouter} from "vue-router";
import {logoutApi} from "@/api/backend/login.js";
import Message from "@/components/backend/Message.vue";


const router = useRouter();

const data = reactive({
  defAct: '2',
  menuActivated: '2',
  userInfo: {},
  menuList: [
    // {
    //   id: '1',
    //   name: '门店管理',
    //   children: [
    {
      id: '2',
      name: '员工管理',
      path: '/backend/member/list',
      icon: 'icon-member'
    },
    {
      id: '3',
      name: '分类管理',
      path: '/backend/category/list',
      icon: 'icon-category'
    },
    {
      id: '4',
      name: '菜品管理',
      path: '/backend/food/list',
      icon: 'icon-food'
    },
    {
      id: '5',
      name: '套餐管理',
      path: '/backend/combo/list',
      icon: 'icon-combo'
    },
    {
      id: '6',
      name: '订单明细',
      path: '/backend/order/list',
      icon: 'icon-order'
    }
    //   ],
    // },
  ],
  headTitle: '员工管理',
  goBackFlag: false,
  loading: true,
  timer: ref()
})

const logout = () => {
  logoutApi().then((res) => {
    if (res.code === 1) {
      localStorage.removeItem('userInfo')
      router.push({path: "/backend/login"})
    }
  })
}

const goBack = () => {
  const menu = data.menuList.find(item => item.id === data.menuActivated)
  menuHandle(menu, false)
}

const menuHandle = (item, goBackFlag) => {
  data.loading = true
  data.menuActivated = item.id
  router.push({path: item.path})
  data.headTitle = item.name
  data.goBackFlag = goBackFlag
  closeLoading()
}

const closeLoading = () => {
  data.timer = null
  data.timer = setTimeout(() => {
    data.loading = false
  }, 1000)
}

onMounted(() => {
  window.menuHandle = menuHandle
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    this.userInfo = JSON.parse(userInfo)
  }
  closeLoading();
})

onBeforeUnmount(() => {
  clearTimeout(data.timer)
  data.timer = ref()
})
</script>

<template>
  <Message/>
  <div id="app" class="app">
    <div class="app-wrapper openSidebar clearfix">
      <!-- sidebar -->
      <div class="sidebar-container">
        <div class="logo">
          <!-- <img src="images/logo.png" width="122.5" alt="" /> -->
          <img alt="" src="@/assets/backend/login/login-logo.png" style="width: 117px; height: 32px"/>
        </div>

        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-menu
              :collapse-transition="false"
              :default-active="data.defAct"
              :unique-opened="false"
              active-text-color="#f4f4f5"
              background-color="#343744"
              text-color="#bfcbd9"
          >
            <div v-for="item in data.menuList" :key="item.id">
              <el-menu-item :index="item.id" @click="menuHandle(item,false)">
                <i :class="item.icon" class="iconfont"></i>
                <span slot="title">{{ item.name }}</span>
              </el-menu-item>
            </div>
          </el-menu>
        </el-scrollbar>
      </div>
      <div class="main-container">
        <!-- <navbar /> -->
        <div class="navbar">
          <div class="head-lable">
              <span v-if="data.goBackFlag" class="goBack" @click="goBack()"
              ><img alt="" src="@/assets/backend/icons/btn_back@2x.png"/> 返回</span
              >
            <span>{{ data.headTitle }}</span>
          </div>
          <div class="right-menu">
            <div class="avatar-wrapper">userInfo.name</div>
            <!-- <div class="logout" @click="logout">退出</div> -->
            <img alt="退出" class="outLogin" src="@/assets/backend/icons/btn_close@2x.png" @click="logout"/>
          </div>
        </div>
        <div v-loading="data.loading" class="app-main">
          <div v-show="data.loading" class="divTmp"></div>
          <router-view v-show="!data.loading"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  min-width: 1366px;
}

.app-main {
  height: calc(100% - 64px);
}

.app-main .divTmp {
  width: 100%;
  height: 100%;
}
</style>