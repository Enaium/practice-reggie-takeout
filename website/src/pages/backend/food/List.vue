<!--
  - Copyright © 2023 Enaium <enaium@outlook.com>
  -
  - This work is free. You can redistribute it and/or modify it under the
  - terms of the Do What The Fuck You Want To Public License, Version 2,
  - as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
  -->

<script setup>
import {onMounted, reactive} from "vue";
import {deleteDish, dishStatusByStatus, getDishPage} from "@/api/backend/food.js";

const data = reactive({
  input: '',
  counts: 0,
  page: 1,
  pageSize: 10,
  tableData: [],
  dishState: '',
  checkList: []
})

onMounted(() => {
  init()
})

const init = async () => {
  const params = {
    page: data.page,
    pageSize: data.pageSize,
    name: data.input ? data.input : undefined
  }
  await getDishPage(params).then(res => {
    if (String(res.code) === '1') {
      data.tableData = res.data.records || []
      data.counts = res.data.total
    }
  }).catch(err => {
    $message.error('请求出错了：' + err)
  })
}

const getImage = (image) => {
  return `http://localhost:8080/common/download?name=${image}`
}

const handleQuery = () => {
  data.page = 1;
  init();
}

const addFoodType = (st) => {
  if (st === 'add') {
    window.parent.menuHandle({
      id: '4',
      path: '/backend/food/add',
      name: '添加菜品'
    }, true)
  } else {
    window.parent.menuHandle({
      id: '4',
      path: '/backend/food/add?id=' + st,
      name: '修改菜品'
    }, true)
  }
}

const deleteHandle = (type, id) => {
  if (type === '批量' && id === null) {
    if (data.checkList.length === 0) {
      return $message.error('请选择删除对象')
    }
  }
  deleteDish(type === '批量' ? data.checkList.join(',') : id).then(res => {
    if (res.code === 1) {
      $message.success('删除成功！')
      handleQuery()
    } else {
      $message.error(res.msg || '操作失败')
    }
  }).catch(err => {
    $message.error('请求出错了：' + err)
  })
}

const statusHandle = (row) => {
  let params = {}
  if (typeof row === 'string') {
    if (data.checkList.length === 0) {
      $message.error('批量操作，请先勾选操作菜品！')
      return false
    }
    params.id = data.checkList.join(',')
    params.status = row
  } else {
    params.id = row.id
    params.status = row.status ? '0' : '1'
  }
  data.dishState = params
  dishStatusByStatus(data.dishState).then(res => {
    if (res.code === 1) {
      $message.success('菜品状态已经更改成功！')
      handleQuery()
    } else {
      $message.error(res.msg || '操作失败')
    }
  }).catch(err => {
    $message.error('请求出错了：' + err)
  })
}

const handleSelectionChange = (val) => {
  let checkArr = []
  val.forEach((n) => {
    checkArr.push(n.id)
  })
  data.checkList = checkArr
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
  <div id="food-app" class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <el-input v-model="data.input" clearable placeholder="请输入菜品名称" style="width: 250px"
                  @keyup.enter.native="handleQuery">
          <i slot="prefix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="init"></i>
        </el-input>
        <div class="tableLab">
          <span class="span-btn delBut non" @click="deleteHandle('批量', null)">批量删除</span>
          <span class="span-btn blueBug non" @click="statusHandle('1')">批量启售</span>
          <span class="span-btn delBut non" style="border:none;" @click="statusHandle('0')">批量停售</span>
          <el-button type="primary" @click="addFoodType('add')">
            + 新建菜品
          </el-button>
        </div>
      </div>
      <el-table :data="data.tableData" class="tableBox" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="25"></el-table-column>
        <el-table-column label="菜品名称" prop="name"></el-table-column>
        <el-table-column align="center" label="图片" prop="image">
          <template #default="{ row }">
            <el-image :preview-src-list="[ `/common/download?name=${row.image}` ]" :src="getImage(row.image)"
                      style="width: auto; height: 40px; border:none;cursor: pointer;">
              <div slot="error" class="image-slot">
                <img src="@/assets/backend/noImg.png" style="width: auto; height: 40px; border:none;">
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="菜品分类" prop="categoryName"></el-table-column>
        <el-table-column label="售价">
          <template #default="scope">
            <span style="margin-right: 10px;">￥{{ scope.row.price / 100 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="售卖状态">
          <template #default="scope">
            <span style="margin-right: 10px;">{{ scope.row.status === '0' ? '停售' : '启售' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最后操作时间" prop="updateTime">
        </el-table-column>
        <el-table-column align="center" label="操作" width="160">
          <template #default="scope">
            <el-button class="blueBug" size="small" type="text" @click="addFoodType(scope.row.id)">
              修改
            </el-button>
            <el-button class="blueBug" size="small" type="text" @click="statusHandle(scope.row)">
              {{ scope.row.status === '0' ? '启售' : '停售' }}
            </el-button>
            <el-button class="delBut non" size="small" type="text" @click="deleteHandle('单删', scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page.sync="page" :page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
                     :total="counts" class="pageList" layout="total, sizes, prev, pager, next, jumper"
                     @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
    </div>
  </div>
</template>

<style scoped>

</style>