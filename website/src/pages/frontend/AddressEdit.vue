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
import {addAddressApi, addressFindOneApi, deleteAddressApi, updateAddressApi} from "@/api/frontend/address.js";
import {parseUrl} from "@/js/frontend/common.js";
import {useRouter} from "vue-router";
import "@/styles/frontend/address-edit.css"

const router = useRouter()

const data = reactive({
  title: '新增收货地址',
  form: {
    consignee: '',//联系人
    phone: undefined,//手机号
    sex: '1',//0表示女 1 表示男
    detail: '',//收货地址
    label: '公司',//标签
  },
  labelList: [
    '无', '公司', '家', '学校'
  ],
  id: undefined,
  activeIndex: 0
})

onMounted(() => {
  base()
  initData()
})

const goBack = () => {
  router.back()
};

const initData = async () => {
  const params = parseUrl(window.location.search)
  data.id = params.id
  if (params.id) {
    data.title = '编辑收货地址'
    const res = await addressFindOneApi(params.id)
    if (res.code === 1) {
      data.form = res.data
    } else {
      $notify({type: 'warning', message: res.msg});
    }
  }
};

const saveAddress = async () => {
  const form = data.form
  if (!form.consignee) {
    $notify({type: 'warning', message: '请输入联系人'});
    return
  }
  if (!form.phone) {
    $notify({type: 'warning', message: '请输入手机号'});
    return
  }
  if (!form.detail) {
    $notify({type: 'warning', message: '请输入收货地址'});
    return
  }
  const reg = /^1[3|4|5|7|8][0-9]{9}$/
  if (!reg.test(form.phone)) {
    $notify({type: 'warning', message: '手机号码不合法'});
    return
  }
  let res
  if (data.id) {
    res = await updateAddressApi(data.form)
  } else {
    res = await addAddressApi(data.form)
  }

  if (res.code === 1) {
    await router.push({path: "/frontend/address"})
  } else {
    $notify({type: 'warning', message: res.msg});
  }
};

const deleteAddress = async function () {
  const res = await deleteAddressApi({ids: data.id})
  if (res.code === 1) {
    await router.push({path: "/frontend/address"})
  } else {
    $notify({type: 'warning', message: res.msg});
  }
};
</script>

<template>
  <div id="address_edit" class="app">
    <div class="divHead">
      <div class="divTitle">
        <i class="el-icon-arrow-left" @click="goBack"></i>{{ data.title }}
      </div>
    </div>
    <div class="divContent">
      <div class="divItem">
        <span>联系人：</span>
        <el-input placeholder=" 请填写收货人的姓名" v-model="data.form.consignee" maxlength='10' class="inputUser"/>
        <span class="spanChecked" @click="data.form.sex = '1'">
                    <i :class="{iActive:data.form.sex === '1'}"></i>
                    先生
                   </span>
        <span class="spanChecked" @click="data.form.sex = '0'">
                    <i :class="{iActive:data.form.sex === '0'}"></i>
                    女士
                </span>
      </div>
      <div class="divItem">
        <span>手机号：</span>
        <el-input placeholder=" 请填写收货人手机号码" v-model="data.form.phone" maxlength='20'
                  style="width: calc(100% - 80rem);"/>
      </div>
      <div class="divItem">
        <span>收货地址：</span>
        <el-input placeholder=" 请输入收货地址" v-model="data.form.detail" maxlength='140'/>
      </div>
      <div class="divItem ">
        <span>标签：</span>
        <span v-for="(item,index) in data.labelList" :key="index"
              @click="data.form.label = item;data.activeIndex = index"
              :class="{spanItem:true,spanActiveSchool:data.activeIndex === index}">{{ item }}</span>
      </div>
      <div class="divSave" @click="saveAddress">保存地址</div>
      <div class="divDelete" @click="deleteAddress" v-if="data.id">删除地址</div>
    </div>
  </div>
</template>

<style scoped>

</style>