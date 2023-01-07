<!--
  - Copyright © 2023 Enaium <enaium@outlook.com>
  -
  - This work is free. You can redistribute it and/or modify it under the
  - terms of the Do What The Fuck You Want To Public License, Version 2,
  - as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
  -->

<script setup>
import {onMounted, reactive} from "vue";
import {enableOrDisableEmployee, getMemberList} from "@/api/backend/member.js";

const data = reactive({
  input: '',
  counts: 0,
  page: 1,
  pageSize: 2,
  tableData: [],
  id: '',
  status: '',
  user: {}
})

onMounted(() => {
  init()
  if (localStorage.getItem('userInfo') != null) {
    //获取当前登录员工的账号，并赋值给模型数据user
    data.user = JSON.parse(localStorage.getItem('userInfo')).username
  }
})

const init = async () => {
  const params = {
    page: data.page,
    pageSize: data.pageSize,
    name: data.input ? data.input : undefined
  }
  await getMemberList(params).then(res => {
    if (String(res.code) === '1') {
      data.tableData = res.data.records || []
      data.counts = res.data.total
    }
  }).catch(err => {
    $message.error('请求出错了：' + err)
  })
}

const handleQuery = () => {
  data.page = 1;
  init();
}

const addMemberHandle = (st) => {
  if (st === 'add') {
    window.parent.menuHandle({
      id: '2',
      url: '/backend/member/add',
      name: '添加员工'
    }, true)
  } else {
    window.parent.menuHandle({
      id: '2',
      url: '/backend/member/add?id=' + st,
      name: '修改员工'
    }, true)
  }
}

const statusHandle = (row) => {
  data.id = row.id
  data.status = row.status
  enableOrDisableEmployee({ 'id': data.id, 'status': !data.status ? 1 : 0 }).then(res => {
    console.log('enableOrDisableEmployee', res)
    if (String(res.code) === '1') {
      $message.success('账号状态更改成功！')
      handleQuery()
    }
  }).catch(err => {
    $message.error('请求出错了：' + err)
  })
}

const handleSizeChange = (val) => {
  data.pageSize = val
  init()
}

const handleCurrentChange = (val) => {
  data.page = val
  init()
}
</script>

<template>
  <div class="dashboard-container" id="member-app">
    <div class="container">
      <div class="tableBar">
        <el-input v-model="data.input" placeholder="请输入员工姓名" style="width: 250px" clearable
                  @keyup.enter.native="handleQuery">
          <i slot="prefix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="handleQuery"></i>
        </el-input>
        <el-button type="primary" @click="addMemberHandle('add')">
          + 添加员工
        </el-button>
      </div>
      <el-table :data="data.tableData" stripe class="tableBox">
        <el-table-column prop="name" label="员工姓名"></el-table-column>
        <el-table-column prop="username" label="账号"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column label="账号状态">
          <template slot-scope="scope">
            {{ String(scope.row.status) === '0' ? '已禁用' : '正常' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" class="blueBug" @click="addMemberHandle(scope.row.id)"
                       :class="{notAdmin:user !== 'admin'}">
              编辑
            </el-button>
            <el-button type="text" size="small" class="delBut non" @click="statusHandle(scope.row)"
                       v-if="user === 'admin'">
              {{ scope.row.status == '1' ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pageList" :page-sizes="[2]" :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="counts" :current-page.sync="page"
                     @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
    </div>
  </div>
</template>

<style scoped>
#member-app .notAdmin::after {
  border: 0 !important;
}
</style>