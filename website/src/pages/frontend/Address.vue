<!--
  - Copyright © 2023 Enaium <enaium@outlook.com>
  -
  - This work is free. You can redistribute it and/or modify it under the
  - terms of the Do What The Fuck You Want To Public License, Version 2,
  - as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
  -->

<script setup>
import {onMounted, reactive} from "vue";
import {useRouter} from "vue-router";
import {addressListApi, setDefaultAddressApi} from "@/api/frontend/address.js";
import {base} from "@/js/frontend/base.js";
import "@/styles/frontend/address.css"


const router = useRouter()

const data = reactive({
  addressList: [
    //     {
    //     label:'公司',
    //     detail:'金燕龙写字楼 4层电梯口fsdfdsfsdfsdfsssssssssssss（电梯可…）',
    //     consignee:'周先生',//姓名
    //     phone:18544445566,//手机号
    //     isDefault:0,//是否是默认
    // },
    // {
    //     label:'家',
    //     detail:'金燕龙写字楼 4层电梯口（电梯可…）',
    //     consignee:'周先生',//姓名
    //     phone:18544445566,//手机号
    //     isDefault:0,//是否是默认
    // },
    // {
    //     label:'学校',
    //     detail:'金燕龙写字楼 4层电梯口（电梯可…）',
    //     consignee:'周先生',//姓名
    //     phone:18544445566,//手机号
    //     isDefault:0,//是否是默认
    // },
    // {
    //     label:'公司',
    //     detail:'金燕龙写字楼 4层电梯口（电梯可…）',
    //     consignee:'周先生',//姓名
    //     phone:18544445566,//手机号
    //     isDefault:0,//是否是默认
    // },
    // {
    //     label:'公司',
    //     detail:'金燕龙写字楼 4层电梯口（电梯可…）',
    //     consignee:'周先生',//姓名
    //     phone:18544445566,//手机号
    //     isDefault:0,//是否是默认
    // },
    // {
    //     label:'公司',
    //     detail:'金燕龙写字楼 4层电梯口（电梯可…）',
    //     consignee:'周先生',//姓名
    //     phone:18544445566,//手机号
    //     isDefault:1,//是否是默认
    // }
  ]
})

onMounted(() => {
  base()
  initData()
})

const goBack = () => {
  router.back()
};

const toAddressEditPage = item => {
  router.push({path: `/frontend/address-edit?id=${item.id}`})
};

const toAddressCreatePage = () => {
  router.push({path: "/frontend/address-edit"})
};

const initData = async () => {
  const res = await addressListApi()
  if (res.code === 1) {
    data.addressList = res.data
  } else {
    $message.error(res.msg)
  }
};

const setDefaultAddress = async item => {
  if (item.id) {
    const res = await setDefaultAddressApi({id: item.id})
    if (res.code === 1) {
      await initData()
    } else {
      $message.error(res.msg)
    }
  }
};

const itemClick = item => {
  const url = document.referrer
  //表示是从订单页面跳转过来的
  if (url.includes('order')) {
    setDefaultAddress(item)
    history.go(-1)
  }
};
</script>

<template>
  <div id="address" class="app">
    <div class="divHead">
      <div class="divTitle">
        <i class="el-icon-arrow-left" @click="goBack"></i>地址管理
      </div>
    </div>
    <div class="divContent">
      <div class="divItem" v-for="(item,index) in data.addressList" :key="index" @click.capture="itemClick(item)">
        <div class="divAddress">
          <span
              :class="{spanCompany:item.label === '公司',spanHome:item.label === '家',spanSchool:item.label === '学校'}">{{
              item.label
            }}</span>
          {{ item.detail }}
        </div>
        <div class="divUserPhone">
          <span>{{ item.consignee }}</span>
          <span>{{ item.sex === '0' ? '女士' : '先生' }}</span>
          <span>{{ item.phone }}</span>
        </div>
        <img src="@/assets/frontend/edit.png" @click.stop.prevent="toAddressEditPage(item)"/>
        <div class="divSplit"></div>
        <div class="divDefault">
          <img src="@/assets/frontend/checked_true.png" v-if="item.isDefault === 1">
          <img src="@/assets/frontend/checked_false.png" @click.stop.prevent="setDefaultAddress(item)" v-else>设为默认地址
        </div>
      </div>
    </div>
    <div class="divBottom" @click="toAddressCreatePage">+ 添加收货地址</div>
  </div>
</template>

<style scoped>

</style>