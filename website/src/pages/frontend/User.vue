<!--
  - Copyright © 2023 Enaium <enaium@outlook.com>
  -
  - This work is free. You can redistribute it and/or modify it under the
  - terms of the Do What The Fuck You Want To Public License, Version 2,
  - as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
  -->

<script setup>
import {onMounted, reactive} from "vue";
import {orderAgainApi, orderPagingApi} from "@/api/frontend/order.js";
import {loginoutApi} from "@/api/frontend/login.js";
import {useRouter} from "vue-router";
import {base} from "@/js/frontend/base.js";

const router = useRouter()

const data = reactive({
  form: {
    phone: '',
    code: ''
  },
  msgFlag: false,
  order: [{
    orderTime: '',//下单时间
    status: undefined,//订单状态 1已结账，2未结账，3已退单，4已完成，5已取消
    orderDetails: [{
      name: '',//菜品名称
      number: undefined,//数量
    }],//明细
    amount: undefined,//实收金额
    sumNum: 0,//菜品总数
  }],
})

onMounted(() => {
  base()
  data.userPhone = sessionStorage.getItem("userPhone")
  initData()
})

const goBack = () => {
  history.go(-1)
};

const toAddressPage = () => {
  router.push({path: "/frontend/address"})
};

const toOrderPage = () => {
  router.push({path: "/frontend/order"})
};

const initData = () => {
  getLatestOrder()
};

const getLatestOrder = async () => {
  const params = {
    page: 1,
    pageSize: 1
  }
  const res = await orderPagingApi(params)
  if (res.code === 1) {
    data.order = res.data.records
    if (data.order && data.order[0].orderDetails) {
      let number = 0
      data.order[0].orderDetails.forEach(item => {
        number += item.number
      })
      data.order[0].sumNum = number
    }
  } else {
    $notify({type: 'warning', message: res.msg});
  }
};

const getStatus = status => {
  let str = ''
  switch (status) {
    case 1:
      str = '待付款'
      break;
    case 2:
      str = '正在派送'
      break;
    case 3:
      str = '已派送'
      break;
    case 4:
      str = '已完成'
      break;
    case 5:
      str = '已取消'
      break;

  }
  return str
};

const addOrderAgain = async () => {
  const res = await orderAgainApi({id: data.order[0].id})
  if (res.code === 1) {
    await router.push({path: "/frontend"})
  } else {
    $notify({type: 'warning', message: res.msg});
  }
};

const toPageLogin = async () => {
  const res = await loginoutApi()
  if (res.code === 1) {
    await router.push({path: "/backend/login"})
  } else {
    $notify({type: 'warning', message: res.msg});
  }
};
</script>

<template>
  <div id="user" class="app">
    <div class="divHead">
      <div class="divTitle">
        <i class="el-icon-arrow-left" @click="goBack"></i>个人中心
      </div>
      <div class="divUser">
        <img src="@/assets/frontend/headPage.png" alt=""/>
        <div class="desc">
          <div class="divName">林之迷 <img src="@/assets/frontend/women.png" alt=""/></div>
          <div class="divPhone">{{ data.userPhone }}</div>
        </div>
      </div>
    </div>
    <div class="divContent">
      <div class="divLinks">
        <div class="item" @click="toAddressPage">
          <img src="@/assets/frontend/locations.png" alt=""/>
          <span>地址管理</span>
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="divSplit"></div>
        <div class="item" @click="toOrderPage">
          <img src="@/assets/frontend/orders.png" alt=""/>
          <span>历史订单</span>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
      <div class="divOrders" v-if="data.order[0]">
        <div class="title">最新订单</div>
        <div class="timeStatus">
          <span>{{ data.order[0].orderTime }}</span>
          <span>{{ getStatus(data.order[0].status) }}</span>
          <!-- <span>正在派送</span> -->
        </div>
        <div class="dishList">
          <div v-for="(item,index) in data.order[0].orderDetails" :key="index" class="item">
            <span>{{ item.name }}</span>
            <span>x{{ item.number }}</span>
          </div>
        </div>
        <div class="result">
          <span>共{{ data.order[0].sumNum }} 件商品,实付</span>
          <span class="price">￥{{ data.order[0].amount }}</span>
        </div>
        <div class="btn" v-if="data.order[0].status === 4">
          <div class="btnAgain" @click="addOrderAgain">再来一单</div>
        </div>
      </div>
      <div class="quitLogin" @click="toPageLogin">
        退出登录
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/styles/frontend/index.css";
@import "@/styles/frontend/user.css";
</style>