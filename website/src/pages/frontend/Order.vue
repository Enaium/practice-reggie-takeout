<!--
  - Copyright © 2023 Enaium <enaium@outlook.com>
  -
  - This work is free. You can redistribute it and/or modify it under the
  - terms of the Do What The Fuck You Want To Public License, Version 2,
  - as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
  -->

<script setup>
import "@/styles/frontend/order.css"
import {onMounted, reactive} from "vue";
import {base} from "@/js/frontend/base.js";
import {orderAgainApi, orderPagingApi} from "@/api/frontend/order.js";
import {useRouter} from "vue-router";

const router = useRouter()

const data = reactive({
  paging: {
    page: 1,
    pageSize: 5
  },
  orderList: [],
  loading: false,
  finished: false
})

onMounted(() => {
  base()
  initData()
})

function goBack() {
  const url = document.referrer
  //表示是从订单页面跳转过来的
  if (url.includes('success')) {
    router.push({path: "/frontend"})
  } else {
    router.back()
  }
}

const initData = () => {
  getList()
};

const getList = async () => {
  if (data.finished) {
    data.loading = false;
    return
  }
  const res = await orderPagingApi(data.paging)
  if (res.code === 1) {
    data.orderList.push(...res.data.records)
    let records = res.data.records
    if (records && Array.isArray(records)) {
      records.forEach(item => {
        let number = 0
        item.orderDetails.forEach(ele => {
          number += ele.number
        })
        item.sumNum = number
      })
    }
    data.loading = false;
    if (data.paging.page >= res.data.pages) {
      data.finished = true;
    }
    data.paging.page = data.paging.page + 1
  } else {
    $notify({type: 'warning', message: res.msg});
  }
};

const addOrderAgain = async order => {
  const res = await orderAgainApi({id: order.id})
  if (res.code === 1) {
    await router.push({path: "/frontend"})
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
</script>

<template>
  <div id="order" class="app">
    <div class="divHead">
      <div class="divTitle">
        <i class="el-icon-arrow-left" @click="goBack"></i>菩提阁
      </div>
    </div>
    <div class="divBody" v-if="data.orderList.length > 0">
      <van-list
          v-model="data.loading"
          :finished="data.finished"
          finished-text="没有更多了"
          @load="getList"
      >
        <van-cell v-for="(order,index) in data.orderList" :key="index" class="item">
          <div class="timeStatus">
            <span>{{ order.orderTime }}</span>
            <span>{{ getStatus(order.status) }}</span>
            <!-- <span>正在派送</span> -->
          </div>
          <div class="dishList">
            <div v-for="(item,index) in order.orderDetails" :key="index" class="item">
              <span>{{ item.name }}</span>
              <span>x{{ item.number }}</span>
            </div>
          </div>
          <div class="result">
            <span>共{{ order.sumNum }} 件商品,实付</span><span class="price">￥{{ order.amount }}</span>
          </div>
          <div class="btn" v-if="order.status === 4">
            <div class="btnAgain" @click="addOrderAgain(order)">再来一单</div>
          </div>
        </van-cell>
      </van-list>
    </div>
    <div class="divNoData" v-else>
      <div class="divContainer">
        <img src="@/styles/frontend/no_order.png"/>
        <div>暂无订单</div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>