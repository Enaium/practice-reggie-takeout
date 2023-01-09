<!--
  - Copyright © 2023 Enaium <enaium@outlook.com>
  -
  - This work is free. You can redistribute it and/or modify it under the
  - terms of the Do What The Fuck You Want To Public License, Version 2,
  - as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
  -->

<script setup>
import {onMounted, reactive} from "vue";
import {addCategory, deleCategory, editCategory, getCategoryPage} from "@/api/backend/category.js";

const data = reactive({
  action: '',
  counts: 0,
  page: 1,
  pageSize: 10,
  tableData: [],
  type: '',
  classData: {
    'title': '添加菜品分类',
    'dialogVisible': false,
    'categoryId': '',
    'name': '',
    'sort': ''
  }
})

onMounted(() => {
  init()
})

const init = async () => {
  await getCategoryPage({'page': data.page, 'pageSize': data.pageSize}).then(res => {
    if (String(res.code) === '1') {
      data.tableData = res.data.records
      data.counts = Number(res.data.total)
    } else {
      $message.error(res.msg || '操作失败')
    }
  }).catch(err => {
    $message.error('请求出错了：' + err)
  })
}

const handleQuery = () => {
  data.page = 1;
  init();
}

const addClass = (st) => {
  if (st === 'class') {
    data.classData.title = '新增菜品分类'
    data.type = '1'
  } else {
    data.classData.title = '新增套餐分类'
    data.type = '2'
  }
  data.action = 'add'
  data.classData.name = ''
  data.classData.sort = ''
  data.classData.dialogVisible = true
}

const editHandle = (dat) => {
  data.classData.title = '修改分类'
  data.action = 'edit'
  data.classData.name = dat.name
  data.classData.sort = dat.sort
  data.classData.id = dat.id
  data.classData.dialogVisible = true
}

const handleClose = (st) => {
  data.classData.dialogVisible = false
}

const deleteHandle = (id) => {
  deleCategory(id).then(res => {
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

const submitForm = (st) => {
  const classData = data.classData
  const valid = (classData.name === 0 || classData.name) && (classData.sort === 0 || classData.sort)
  if (data.action === 'add') {
    if (valid) {
      const reg = /^\d+$/
      if (reg.test(classData.sort)) {
        addCategory({'name': classData.name, 'type': data.type, sort: classData.sort}).then(res => {
          console.log(res)
          if (res.code === 1) {
            $message.success('分类添加成功！')
            if (!st) {
              data.classData.dialogVisible = false
            } else {
              data.classData.name = ''
              data.classData.sort = ''
            }
            handleQuery()
          } else {
            $message.error(res.msg || '操作失败')
          }
        }).catch(err => {
          $message.error('请求出错了：' + err)
        })
      } else {
        $message.error('排序只能输入数字类型')
      }

    } else {
      $message.error('请输入分类名称或排序')
    }
  } else if (valid) {
    const reg = /^\d+$/
    if (reg.test(data.classData.sort)) {
      editCategory({'id': data.classData.id, 'name': data.classData.name, sort: data.classData.sort}).then(res => {
        if (res.code === 1) {
          $message.success('分类修改成功！')
          data.classData.dialogVisible = false
          handleQuery()
        } else {
          $message.error(res.msg || '操作失败')
        }
      }).catch(err => {
        $message.error('请求出错了：' + err)
      })
    } else {
      $message.error('排序只能输入数字类型')
    }
  } else {
    $message.error('请输入分类名称或排序')
  }
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
  <div id="category-app" class="dashboard-container">
    <div class="container">
      <div class="tableBar" style="display: inline-block">
        <el-button class="continue" type="primary" @click="addClass('class')">
          + 新增菜品分类
        </el-button>
        <el-button type="primary" @click="addClass('meal')">
          + 新增套餐分类
        </el-button>
      </div>
      <el-table :data="data.tableData" class="tableBox" stripe>
        <el-table-column label="分类名称" prop="name"/>
        <el-table-column label="分类类型" prop="type">
          <template #default="scope">
            <span>{{ scope.row.type == '1' ? '菜品分类' : '套餐分类' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" prop="updateTime">
          <template #default="scope">
            {{ scope.row.updateTime }}
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort"/>
        <el-table-column align="center" label="操作" width="160">
          <template #default="scope">
            <el-button class="blueBug" size="small" type="text" @click="editHandle(scope.row)">
              修改
            </el-button>
            <el-button class="delBut non" size="small" type="text" @click="deleteHandle(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :page-size="data.pageSize" :page-sizes="[10, 20, 30, 40]" :total="data.counts"
                     class="pageList" layout="total, sizes, prev, pager, next, jumper"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"></el-pagination>
    </div>
    <el-dialog :before-close="handleClose" :title="data.classData.title" v-model="data.classData.dialogVisible"
               width="30%">
      <el-form class="demo-form-inline" label-width="100px">
        <el-form-item label="分类名称：">
          <el-input v-model="data.classData.name" maxlength="14" placeholder="请输入分类名称"/>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="data.classData.sort" placeholder="请输入排序" type="number"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="data.classData.dialogVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="submitForm">确 定</el-button>
        <el-button v-if="data.action !== 'edit'" class="continue" size="medium" type="primary" @click="submitForm('go')">
          保存并继续添加 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped>

</style>