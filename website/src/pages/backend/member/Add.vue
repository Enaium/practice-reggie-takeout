<!--
  - Copyright © 2023 Enaium <enaium@outlook.com>
  -
  - This work is free. You can redistribute it and/or modify it under the
  - terms of the Do What The Fuck You Want To Public License, Version 2,
  - as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
  -->

<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import {addEmployee, editEmployee, queryEmployeeById} from "@/api/backend/member.js";
import {requestUrlParam} from "@/js/backend/index.js";
import {checkName, checkPhone, checkUserName, validID} from "@/js/backend/validate.js";

const data = reactive({
  id: '',
  actionType: '',
  ruleForm: {
    'name': '',
    'phone': '',
    'sex': '男',
    'idNumber': '',
    username: ''
  }
})

const ruleForm = ref(null)

const rules = computed(() => ({
  //账号
  username: [
    {
      required: true, 'validator': checkUserName, trigger: 'blur'
    }
  ],
  //姓名
  name: [{required: true, 'validator': checkName, 'trigger': 'blur'}],
  'phone': [{'required': true, 'validator': checkPhone, 'trigger': 'blur'}],
  'idNumber': [{'required': true, 'validator': validID, 'trigger': 'blur'}]
}))

onMounted(() => {
  data.id = requestUrlParam('id')
  data.actionType = data.id ? 'edit' : 'add'
  if (data.id) {
    init()
  }
})

const init = async () => {
  queryEmployeeById(data.id).then(res => {
    console.log(res)
    if (String(res.code) === '1') {
      console.log(res.data)
      data.ruleForm = res.data
      data.ruleForm.sex = res.data.sex === '0' ? '女' : '男'
      // data.ruleForm.password = ''
    } else {
      $message.error(res.msg || '操作失败')
    }
  })
};
const submitForm = function (formName, st) {
  ruleForm.value.validate((valid) => {
    if (valid) {
      if (data.actionType === 'add') {
        const params = {
          ...data.ruleForm,
          sex: data.ruleForm.sex === '女' ? '0' : '1'
        }
        addEmployee(params).then(res => {
          if (res.code === 1) {
            $message.success('员工添加成功！')
            if (!st) {
              goBack()
            } else {
              data.ruleForm = {
                username: '',
                'name': '',
                'phone': '',
                // 'password': '',
                // 'rePassword': '',/
                'sex': '男',
                'idNumber': ''
              }
            }
          } else {
            $message.error(res.msg || '操作失败')
          }
        }).catch(err => {
          $message.error('请求出错了：' + err)
        })
      } else {
        const params = {
          ...data.ruleForm,
          sex: data.ruleForm.sex === '女' ? '0' : '1'
        }
        editEmployee(params).then(res => {
          if (res.code === 1) {
            $message.success('员工信息修改成功！')
            goBack()
          } else {
            $message.error(res.msg || '操作失败')
          }
        }).catch(err => {
          $message.error('请求出错了：' + err)
        })
      }
    } else {
      console.log('error submit!!')
      return false
    }
  })
};
const goBack = () => {
  window.parent.menuHandle({
    id: '2',
    path: '/backend/member/list',
    name: '员工管理'
  }, false)
};
</script>

<template>
  <div id="member-add-app" class="addBrand-container">
    <div class="container">
      <el-form
          ref="ruleForm"
          :inline="false"
          :model="data.ruleForm"
          :rules="rules"
          class="demo-ruleForm"
          label-width="180px"
      >
        <el-form-item label="账号:" prop="username">
          <el-input v-model="data.ruleForm.username" maxlength="20" placeholder="请输入账号"/>
        </el-form-item>
        <el-form-item
            label="员工姓名:"
            prop="name"
        >
          <el-input
              v-model="data.ruleForm.name"
              maxlength="20"
              placeholder="请输入员工姓名"
          />
        </el-form-item>

        <el-form-item
            label="手机号:"
            prop="phone"
        >
          <el-input
              v-model="data.ruleForm.phone"
              maxlength="20"
              placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item
            label="性别:"
            prop="sex"
        >
          <el-radio-group v-model="data.ruleForm.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
            label="身份证号:"
            prop="idNumber"
        >
          <el-input
              v-model="data.ruleForm.idNumber"
              maxlength="20"
              placeholder="请输入身份证号"
          />
        </el-form-item>
        <div class="subBox address">
          <el-form-item>
            <el-button @click="goBack">
              取消
            </el-button>
            <el-button
                type="primary"
                @click="submitForm('ruleForm', false)"
            >
              保存
            </el-button>
            <el-button
                v-if="data.actionType === 'add'"
                class="continue"
                type="primary"
                @click="submitForm('ruleForm', true)"
            >
              保存并继续添加
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>

</style>