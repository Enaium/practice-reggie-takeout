<!--
  - Copyright © 2023 Enaium <enaium@outlook.com>
  -
  - This work is free. You can redistribute it and/or modify it under the
  - terms of the Do What The Fuck You Want To Public License, Version 2,
  - as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
  -->

<script setup>
import {computed, onMounted, reactive} from "vue";
import {imgPath} from "@/js/frontend/common.js";
import {cartListApi} from "@/api/frontend/main.js";
import {getDefaultAddressApi} from "@/api/frontend/address.js";
import {useRouter} from "vue-router";
import {addOrderApi} from "@/api/frontend/order.js";
import {base} from "@/js/frontend/base.js";

const router = useRouter()

const data = reactive({
  address: {
    phone: '',//手机号
    consignee: '',//姓名
    detail: '',//详细地址
    sex: '1',
    id: undefined
  },
  finishTime: '',//送达时间
  cartData: [],
  note: ''//备注信息
})

const goodsNum = computed(() => {
  let num = 0
  data.cartData.forEach(item => {
    num += item.number
  })
  if (num < 99) {
    return num
  } else {
    return '99+'
  }
})

const goodsPrice = computed(() => {
  let price = 0
  data.cartData.forEach(item => {
    price += (item.number * item.amount)
  })
  return price
})

onMounted(() => {
  initData()
  base()
})

const goBack = () => {
  router.back()
};
const initData = () => {
  //获取默认的地址
  defaultAddress()
  //获取购物车的商品
  getCartData()
};
//获取默认地址
const defaultAddress = async () => {
  const res = await getDefaultAddressApi()
  if (res.code === 1) {
    data.address = res.data
    getFinishTime()
  } else {
    await router.push({path: "/frontend/address-edit"})
  }
};
//获取送达时间
const getFinishTime = () => {
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
};
const toAddressPage = () => {
  router.push({path: "/frontend/address"})
};
//获取购物车数据
const getCartData = async () => {
  const res = await cartListApi({})
  if (res.code === 1) {
    data.cartData = res.data
  } else {
    $notify({type: 'warning', message: res.msg});
  }
};

const goToPaySuccess = async () => {
  const params = {
    remark: data.note,
    payMethod: 1,
    addressBookId: data.address.id
  }
  const res = await addOrderApi(params)
  if (res.code === 1) {
    await router.push({path: "/frontend/pay-success"})
  } else {
    $notify({type: 'warning', message: res.msg});
  }
};

//网络图片路径转换
const imgPathConvert = path => imgPath(path);
</script>

<template>
  <div id="add_order" class="app">
    <div class="divHead">
      <div class="divTitle">
        <i class="el-icon-arrow-left" @click="goBack"></i>菩提阁
      </div>
    </div>
    <div class="divContent">
      <div class="divAddress">
        <div @click="toAddressPage">
          <div class="address">{{ data.address.detail }}</div>
          <div class="name">
            <span>{{ data.address.consignee }}{{ data.address.sex === '1' ? '先生' : '女士' }}</span>
            <span>{{ data.address.phone }}</span>
          </div>
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="divSplit"></div>
        <div class="divFinishTime">预计{{ data.finishTime }}送达</div>
      </div>
      <div class="order">
        <div class="title">订单明细</div>
        <div class="divSplit"></div>
        <div class="itemList">
          <div class="item" v-for="(item,index) in data.cartData" :key="index">
            <el-image :src="imgPathConvert(item.image)">
              <div slot="error" class="image-slot">
                <img src="@/assets/frontend/noImg.png" alt=""/>
              </div>
            </el-image>
            <div class="desc">
              <div class="name">{{ item.name }}</div>
              <div class="numPrice">
                <span class="num">x{{ item.number }}</span>
                <div class="price">
                  <span class="spanMoney">￥</span>{{ item.amount }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="note">
        <div class="title">备注</div>
        <van-field
            v-model="data.note"
            rows="2"
            autosize
            type="textarea"
            maxlength="50"
            placeholder="请输入您需要备注的信息"
            show-word-limit
        />
      </div>
    </div>
    <div class="divCart">
      <div
          :class="{imgCartActive: data.cartData && data.cartData.length > 0, imgCart:!data.cartData || data.cartData.length<1}"></div>
      <div :class="{divGoodsNum:1===1, moreGoods:data.cartData && data.cartData.length > 99}"
           v-if="data.cartData && data.cartData.length > 0">{{ goodsNum }}
      </div>
      <div class="divNum">
        <span>￥</span>
        <span>{{ goodsPrice }}</span>
      </div>
      <div class="divPrice"></div>
      <div
          :class="{btnSubmitActive: data.cartData && data.cartData.length > 0, btnSubmit:!data.cartData || data.cartData.length<1}"
          @click="goToPaySuccess">去支付
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/styles/frontend/index.css";
@import "@/styles/frontend/add-order.css";
</style>