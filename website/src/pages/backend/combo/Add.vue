<!--
  - Copyright © 2023 Enaium <enaium@outlook.com>
  -
  - This work is free. You can redistribute it and/or modify it under the
  - terms of the Do What The Fuck You Want To Public License, Version 2,
  - as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
  -->

<script setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import {requestUrlParam} from "@/js/backend/index.js";
import {addSetmeal, editSetmeal, querySetmealById} from "@/api/backend/combo.js";
import {getCategoryList, queryDishList} from "@/api/backend/food.js";
import {useRouter} from "vue-router";

const router = useRouter()

const data = reactive({
  id: '',
  actionType: '',
  value: '',
  setMealList: [],
  searchKey: '',
  dishList: [],
  imageUrl: '',
  dishTable: [],
  dialogVisible: false,
  checkList: [],
  ruleForm: {
    name: '',
    categoryId: '',
    price: '',
    code: '',
    image: '',
    description: '',
    dishList: [],
    status: true,
    idType: '',
  },
  dishType: [],
  dishAddList: [],
  dishListCache: [],
  keyInd: 0,
  searchValue: '',
  checkedList: []
})

const ruleForm = ref(null)
const upload = ref(null)

const rules = computed(() => ({
  name: {
    required: true,
    message: '请输入套餐名称',
    trigger: 'blur',
  },
  idType: {
    required: true,
    message: '请选择套餐分类',
    trigger: 'change',
  },
  price: {
    required: true,
    // 'message': '请输入套餐价格',
    validator: (rules, value, callback) => {
      if (!value) {
        callback(new Error('请填写菜品价格'))
      } else {
        const reg = /^\d+(\.\d{0,2})?$/
        if (reg.test(value)) {
          if (value < 10000) {
            callback()
          } else {
            callback(new Error('菜品价格小于10000'))
          }
        } else {
          callback(new Error('菜品价格格式只能为数字,且最多保留两位小数'))
        }
      }
    },
    trigger: 'blur',
  },
}))

watch(data.searchKey, (newValue, oldValue) => {
  if (newValue.trim()) {
    getDishForName(data.searchKey)
  }
})

watch(data.checkList, (newValue, oldValue) => {
  if (newValue.trim()) {
    data.checkedList = newValue
  }
})

onMounted(() => {
  getDishTypeList()
  getDishType()
  data.id = requestUrlParam('id')
  data.actionType = data.id ? 'edit' : 'add'
  if (data.id) {
    init()
  }
})

const init = async () => {
  querySetmealById(data.id).then((res) => {
    if (String(res.code) === '1') {
      data.ruleForm = res.data
      data.ruleForm.status = res.data.status === '1'
      data.ruleForm.price = res.data.price / 100
      data.imageUrl = `/common/download?name=${res.data.image}`
      data.checkList = res.data.setmealDishes
      data.dishTable = res.data.setmealDishes
      data.ruleForm.idType = res.data.categoryId
      // data.ruleForm.password = ''
    } else {
      $message.error(res.msg || '操作失败')
    }
  })
};
const searchHandle = () => {
  data.searchKey = data.value
};
// 获取套餐分类
const getDishTypeList = () => {
  getCategoryList({type: 2}).then((res) => {
    if (res.code === 1) {
      data.setMealList = res.data.map((obj) => ({...obj, idType: obj.id}))
    } else {
      $message.error(res.msg || '操作失败')
    }
  })
};
// 删除套餐菜品
const delDishHandle = index => {
  data.dishTable.splice(index, 1)
  data.checkList.splice(index, 1)
};

// 获取添加菜品数据
const getCheckList = value => {
  data.checkList = [...value]
};

// 添加菜品
const openAddDish = () => {
  data.searchKey = ''
  data.dialogVisible = true
  //搜索条件清空，菜品重新查询，菜品类别选第一个重新查询
  data.value = ''
  data.keyInd = 0
  getDishList(data.dishType[0].id)
};
// 取消添加菜品
const handleClose = done => {
  // data.$refs.adddish.close()
  data.dialogVisible = false
  // data.checkList = JSON.parse(JSON.stringify(data.dishTable))
  // data.dialogVisible = false
};

// 保存添加菜品列表
const addTableList = () => {
  data.dishTable = JSON.parse(JSON.stringify(data.checkList))
  data.dishTable.forEach((n) => {
    n.copies = 1
  })
  data.dialogVisible = false
  // 添加处理逻辑清空选中list
  data.checkList = []
};

function submitForm(formName, st) {
  ruleForm.value.validate((valid) => {
    if (valid) {
      let prams = {...data.ruleForm}
      prams.price *= 100
      prams.setmealDishes = data.dishTable.map((obj) => ({
        copies: obj.copies,
        dishId: obj.dishId,
        name: obj.name,
        price: obj.price,
      }))
      prams.status = data.ruleForm ? 1 : 0
      prams.categoryId = data.ruleForm.idType
      if (prams.setmealDishes.length < 1) {
        $message.error('请选择菜品！')
        return
      }
      if (!data.imageUrl) {
        $message.error('请上传套餐图片')
        return
      }
      // delete prams.dishList
      if (data.actionType === 'add') {
        delete prams.id
        addSetmeal(prams)
            .then((res) => {
              if (res.code === 1) {
                $message.success('套餐添加成功！')
                if (!st) {
                  goBack()
                } else {
                  ruleForm.value.resetFields()
                  data.dishList = []
                  data.dishTable = []
                  data.ruleForm = {
                    name: '',
                    categoryId: '',
                    price: '',
                    code: '',
                    image: '',
                    description: '',
                    dishList: [],
                    status: true,
                    id: '',
                    idType: '',
                  }
                  data.imageUrl = ''
                }
              } else {
                $message.error(res.msg || '操作失败')
              }
            })
            .catch((err) => {
              $message.error('请求出错了：' + err)
            })
      } else {
        delete prams.updateTime
        editSetmeal(prams)
            .then((res) => {
              if (res.code === 1) {
                $message.success('套餐修改成功！')
                goBack()
              } else {
                $message.error(res.msg || '操作失败')
              }
            })
            .catch((err) => {
              $message.error('请求出错了：' + err)
            })
      }
    } else {
      return false
    }
  })
}

function handleAvatarSuccess(response, file, fileList) {
  // data.imageUrl = response.data
  if (response.code === 0 && response.msg === '未登录') {
    router.push({path: "/backend/login"})
  } else {
    data.imageUrl = `/common/download?name=${response.data}`
    data.ruleForm.image = response.data
  }
}

function onChange(file) {
  if (file) {
    const suffix = file.name.split('.')[1]
    const size = file.size / 1024 / 1024 < 2
    if (['png', 'jpeg', 'jpg'].indexOf(suffix) < 0) {
      $message.error('上传图片只支持 png、jpeg、jpg 格式！')
      upload.value.clearFiles()
      return false
    }
    if (!size) {
      $message.error('上传文件大小不能超过 2MB!')
      return false
    }
    return file
  }
}

function goBack() {
  window.parent.menuHandle(
      {
        id: '5',
        url: '/backend/combo/list',
        name: '套餐管理',
      },
      false
  )
}

// 获取套餐分类
const getDishType = () => {
  getCategoryList({'type': 1}).then(res => {
    if (res.code === 1) {
      data.dishType = res.data
      getDishList(res.data[0].id)
    } else {
      $message.error(res.msg)
    }
  })
};

// 通过套餐ID获取菜品列表分类
const getDishList = id => {
  queryDishList({categoryId: id}).then(res => {
    if (res.code === 1) {
      if (res.data.length === 0) {
        data.dishAddList = []
        return
      }
      let newArr = res.data;
      newArr.forEach((n) => {
        n.dishId = n.id
        n.copies = 1
        // n.dishCopies = 1
        n.dishName = n.name
      })
      data.dishAddList = newArr
    } else {
      $message.error(res.msg)
    }
  })
};

// 关键词收搜菜品列表分类
const getDishForName = name => {
  queryDishList({name}).then(res => {
    if (res.code === 1) {
      let newArr = res.data
      newArr.forEach((n) => {
        n.dishId = n.id
        n.dishName = n.name
      })
      data.dishAddList = newArr
    } else {
      $message.error(res.msg)
    }
  })
};

const checkTypeHandle = (ind, id) => {
  data.keyInd = ind
  getDishList(id)
};

const checkedListHandle = value => {
  getCheckList(data.checkedList)
};

const open = done => {
  data.dishListCache = JSON.parse(JSON.stringify(data.checkList))
};

const close = done => {
  data.checkList = data.dishListCache
};

// 删除
const delCheck = ind => {
  data.checkedList.splice(ind, 1)
};
</script>

<template>
  <div id="combo-add-app" class="addBrand-container">
    <div class="container">
      <el-form
          ref="ruleForm"
          :inline="true"
          :model="data.ruleForm"
          :rules="rules"
          class="demo-ruleForm"
          label-width="180px"
      >
        <div>
          <el-form-item label="套餐名称:" prop="name">
            <el-input v-model="data.ruleForm.name" maxlength="20" placeholder="请填写套餐名称"/>
          </el-form-item>
          <el-form-item label="套餐分类:" prop="idType">
            <el-select v-model="data.ruleForm.idType" placeholder="请选择套餐分类" @change="$forceUpdate()">
              <el-option v-for="(item, index) in data.setMealList" :key="index" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="套餐价格:" prop="price">
            <el-input v-model="data.ruleForm.price" placeholder="请设置套餐价格"/>
          </el-form-item>
        </div>
        <div>
          <el-form-item class="setmealFood" label="套餐菜品:">
            <el-form-item>
              <div class="addDish">
                <span v-if="data.dishTable.length === 0" class="addBut" @click="openAddDish"> + 添加菜品</span>
                <div v-if="data.dishTable.length !== 0" class="content">
                  <div class="addBut" style="margin-bottom: 20px" @click="openAddDish">+ 添加菜品</div>
                  <div class="table">
                    <el-table :data="data.dishTable" style="width: 100%">
                      <el-table-column align="center" label="名称" prop="name" width="180"></el-table-column>
                      <el-table-column label="原价" prop="price" width="180">
                        <template slot-scope="scope"> {{ Number(scope.row.price) / 100 }}</template>
                      </el-table-column>
                      <el-table-column align="center" label="份数" prop="address">
                        <template slot-scope="scope">
                          <el-input-number
                              v-model="scope.row.copies"
                              :max="99"
                              :min="1"
                              label="描述文字"
                              size="small"
                          ></el-input-number>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" label="操作" prop="address" width="180px;">
                        <template slot-scope="scope">
                          <el-button size="small" type="text" @click="delDishHandle(scope.$index)"> 删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-form-item>
        </div>
        <div>
          <el-form-item class="uploadImg" label="套餐图片:">
            <el-upload
                ref="upload"
                :on-change="onChange"
                :on-success="handleAvatarSuccess"
                :show-file-list="false"
                action="/common/upload"
                class="avatar-uploader"
            >
              <img v-if="data.imageUrl" :src="data.imageUrl" alt="avatar" class="avatar"/>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>
        <div class="address">
          <el-form-item label="套餐描述:">
            <el-input v-model="data.ruleForm.description" :rows="3" maxlength="200" placeholder="套餐描述，最长200字"
                      type="textarea"/>
          </el-form-item>
        </div>
        <div class="subBox address">
          <el-form-item>
            <el-button @click="goBack()"> 取消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm', false)"> 保存</el-button>
            <el-button
                v-if="data.actionType === 'add'"
                class="continue"
                type="primary"
                @click="submitForm('ruleForm', true)"
            >
              保存并继续添加套餐
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-dialog
        :before-close="handleClose"
        :visible.sync="data.dialogVisible"
        class="addDishList"
        title="添加菜品"
        width="60%"
    >
      <el-input
          v-model="data.value"
          class="searchDish"
          clearable
          placeholder="请输入菜品名称进行搜索"
          size="small"
          style="width: 250px"
      >
        <i slot="prefix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="searchHandle"></i>
      </el-input>
      <!-- <AddDish ref="adddish" :check-list="checkList" :search-key="searchKey" @checkList="getCheckList" /> -->

      <div class="addDishCon">
        <div class="leftCont">
          <div
              v-show="data.searchKey.trim() === ''"
              class="tabBut"
          >
              <span
                  v-for="(item, index) in dishType"
                  :key="index"
                  :class="{act:index === data.keyInd}"
                  @click="checkTypeHandle(index, item.id)"
              >{{ item.name }}</span>
          </div>
          <div class="tabList">
            <div class="table">
              <div v-if="data.dishAddList.length === 0" style="padding-left:10px">
                暂无菜品!
              </div>
              <el-checkbox-group
                  v-if="data.dishAddList.length > 0"
                  v-model="data.checkedList"
                  @change="checkedListHandle"
              >
                <div
                    v-for="(item, index) in data.dishAddList"
                    :key="index"
                    class="items"
                >
                  <el-checkbox
                      :key="index"
                      :label="item"
                  >
                    <div class="item">
                      <span style="flex: 3;text-align: left">{{ item.dishName }}</span>
                      <span>{{ item.status === 0 ? '停售' : '在售' }}</span>
                      <span>{{ Number(item.price) / 100 }}</span>
                    </div>
                  </el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div class="ritCont">
          <div class="tit">
            已选菜品({{ data.checkedList.length }})
          </div>
          <div class="items">
            <div
                v-for="(item, ind) in data.checkedList"
                :key="ind"
                class="item"
            >
              <span>{{ item.dishName }}</span>
              <span class="price">￥ {{ Number(item.price) / 100 }} </span>
              <span
                  class="del"
                  @click="delCheck(ind)"
              >
                  <img
                      alt=""
                      src="@/assets/backend/icons/btn_clean@2x.png"
                  >
                </span>
            </div>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="addTableList">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<style scoped>
.addDish .el-input {
  width: 130px;
}

.addDish .el-input-number__increase {
  border-left: solid 1px #FFE1CA;
  background: #fff3ea;
}

.addDish .el-input-number__decrease {
  border-right: solid 1px #FFE1CA;
  background: #fff3ea;
}

.addDish input {
  border: 1px solid #ffe1ca;
}

.addDish .table {
  border: solid 1px #EBEEF5;
  border-radius: 3px;
}

.addDish .table th {
  padding: 5px 0;
}

.addDish .table td {
  padding: 7px 0;
}

.addDishList .searchDish {
  position: absolute;
  top: 10px;
  right: 20px;
}

.addDishList .el-dialog__body {
  padding: 0;
  border-bottom: solid 1px #ccc;
}

.addDishList .el-dialog__footer {
  padding-top: 27px;
}

.addDish {
  width: 777px;
}

.addDish .addBut {
  background: #ffc200;
  display: inline-block;
  padding: 0px 20px;
  border-radius: 3px;
  line-height: 40px;
  cursor: pointer;
  border-radius: 4px;
  color: #333333;
  font-weight: 500;
}

.addDish .content {
  background: #fafafb;
  padding: 20px;
  border: solid 1px #ccc;
  border-radius: 3px;
}

.addDishCon {
  padding: 0 20px;
  display: flex;
  line-height: 40px;
}

.addDishCon .leftCont {
  display: flex;
  border-right: solid 2px #E4E7ED;
  width: 60%;
  padding: 15px;
}

.addDishCon .leftCont .tabBut {
  width: 110px;
}

.addDishCon .leftCont .tabBut span {
  display: block;
  text-align: center;
  border-right: solid 2px #f4f4f4;
  cursor: pointer;
}

.addDishCon .leftCont .act {
  border-color: #FFC200 !important;
  color: #FFC200 !important;
}

.addDishCon .leftCont .tabList {
  flex: 1;
  padding: 15px;
}

.addDishCon .leftCont .tabList .table {
  border: solid 1px #f4f4f4;
  border-bottom: solid 1px #f4f4f4;
}

.addDishCon .leftCont .tabList .table .items {
  border-bottom: solid 1px #f4f4f4;
  padding: 0 10px;
  display: flex;
}

.addDishCon .leftCont .tabList .table .items .el-checkbox, .addDishCon .leftCont .tabList .table .items .el-checkbox__label {
  width: 100%;
}

.addDishCon .leftCont .tabList .table .items .item {
  display: flex;
  padding-right: 20px;
}

.addDishCon .leftCont .tabList .table .items .item span {
  display: inline-block;
  text-align: center;
  flex: 1;
}

.addDishCon .ritCont {
  width: 40%;
  padding: 0 15px;
}

.addDishCon .ritCont .item {
  box-shadow: 0px 1px 4px 3px rgba(0, 0, 0, 0.03);
  display: flex;
  text-align: center;
  padding: 0 10px;
  margin-bottom: 20px;
  border-radius: 6px;
  color: #818693;
}

.addDishCon .ritCont .item span:first-child {
  text-align: left;
  color: #20232A;
}

.addDishCon .ritCont .item .price {
  display: inline-block;
  flex: 1;
}

.addDishCon .ritCont .item .del {
  cursor: pointer;
}

.addDishCon .ritCont .item .del img {
  position: relative;
  top: 5px;
  width: 20px;
}

.addDishCon .el-checkbox__label {
  width: 100%;
}

#combo-add-app .setmealFood .el-form-item__label::before {
  content: '*';
  color: #F56C6C;
  margin-right: 4px;
}

#combo-add-app .uploadImg .el-form-item__label::before {
  content: '*';
  color: #F56C6C;
  margin-right: 4px;
}
</style>