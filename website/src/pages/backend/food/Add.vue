<!--
  - Copyright © 2023 Enaium <enaium@outlook.com>
  -
  - This work is free. You can redistribute it and/or modify it under the
  - terms of the Do What The Fuck You Want To Public License, Version 2,
  - as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
  -->

<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import {requestUrlParam} from "@/js/backend/index.js";
import {addDish, editDish, getCategoryList, queryDishById} from "@/api/backend/food.js";
import {useRouter} from "vue-router";

const router = useRouter()

const data = reactive({
  id: '',
  restKey: 0,
  textarea: '',
  value: '',
  imageUrl: '',
  actionType: '',
  dishList: [],
  dishFlavorsData: [],
  dishFlavors: [],
  vueRest: '1',
  index: 0,
  inputStyle: {'flex': 1},
  ruleForm: {
    'name': '',
    'id': '',
    'price': '',
    'code': '',
    'image': '',
    'description': '',
    'dishFlavors': [],
    'status': true,
    categoryId: ''
  },
  mak: false
})

const ruleForm = ref(null)
const upload = ref(null)

const rules = computed(() => ({
  'name': [
    {'required': true, 'message': '请填写菜品名称', 'trigger': 'blur'}
  ],
  'categoryId': [
    {'required': true, 'message': '请选择菜品分类', 'trigger': 'change'}
  ],
  'price': [
    {
      'required': true,
      // 'message': '请填写菜品价格',
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
      'trigger': 'blur'
    }
  ],
}))

onMounted(() => {
  getDishList()
  // 口味临时数据
  getFlavorListHand()
  data.id = requestUrlParam('id')
  data.actionType = data.id ? 'edit' : 'add'
  if (data.id) {
    init()
  }
})

const init = async () => {
  queryDishById(data.id).then(res => {
    console.log(res)
    if (String(res.code) === '1') {
      data.ruleForm = {...res.data}
      data.ruleForm.price = String(res.data.price / 100)
      data.ruleForm.status = res.data.status === '1'
      data.dishFlavors = res.data.flavors && res.data.flavors.map(obj => ({
        ...obj,
        value: JSON.parse(obj.value),
        showOption: false
      }))
      console.log('data.dishFlavors', data.dishFlavors)
      // data.ruleForm.id = res.data.data.categoryId
      // data.imageUrl = res.data.data.image
      data.imageUrl = `/common/download?name=${res.data.image}`
    } else {
      $message.error(res.msg || '操作失败')
    }
  })
};
// 按钮 - 添加口味
const addFlavored = () => {
  data.dishFlavors.push({'name': '', 'value': [], showOption: false}) // JSON.parse(JSON.stringify(data.dishFlavorsData))
};

// 按钮 - 删除口味
const delFlavor = ind => {
  data.dishFlavors.splice(ind, 1)
};

// 按钮 - 删除口味标签
const delFlavorLabel = (index, ind) => {
  data.dishFlavors[index].value.splice(ind, 1)
};

//口味位置记录
const flavorPosition = index => {
  data.index = index
};

// 添加口味标签
const keyDownHandle = (val, index) => {
  console.log('keyDownHandle----val', val)
  console.log('keyDownHandle----index', index)
  console.log('keyDownHandle----data.dishFlavors', data.dishFlavors)
  if (event) {
    event.cancelBubble = true
    event.preventDefault()
    event.stopPropagation()
  }

  if (val.target.innerText.trim() !== '') {
    data.dishFlavors[index].value.push(val.target.innerText)
    val.target.innerText = ''
  }
};

// 获取菜品分类
const getDishList = () => {
  getCategoryList({'type': 1}).then(res => {
    if (res.code === 1) {
      data.dishList = res.data
    } else {
      $message.error(res.msg || '操作失败')
    }
  })
};

// 获取口味列表
const getFlavorListHand = () => {
  // flavor flavorData
  data.dishFlavorsData = [
    {'name': '甜味', 'value': ['无糖', '少糖', '半糖', '多糖', '全糖']},
    {'name': '温度', 'value': ['热饮', '常温', '去冰', '少冰', '多冰']},
    {'name': '忌口', 'value': ['不要葱', '不要蒜', '不要香菜', '不要辣']},
    {'name': '辣度', 'value': ['不辣', '微辣', '中辣', '重辣']}
  ]
};

const selectFlavor = (st, index) => {
  console.log('st', st)
  console.log('index', index)
  console.log('data.dishFlavors', data.dishFlavors)
  const obj = JSON.parse(JSON.stringify(data.dishFlavors[index]))
  obj.showOption = st
  data.dishFlavors.splice(index, 1, obj)
  // data.dishFlavors[index].showOption = st
};

const outSelect = (st, index) => {
  setTimeout(() => {
    const obj = JSON.parse(JSON.stringify(data.dishFlavors[index]))
    obj.showOption = st
    data.dishFlavors.splice(index, 1, obj)
  }, 200)
};

const inputHandle = (val, index) => {
  // data.selectFlavor(false,index)
};

const checkOption = (val, ind, index) => {
  selectHandle(val.name, index, ind)
  data.dishFlavors[index].name = val.name
};

const selectHandle = (val, key, ind) => {
  const arrDate = [...data.dishFlavors]
  arrDate[key] = JSON.parse(JSON.stringify(data.dishFlavorsData[ind]))
  data.dishFlavors = arrDate
};

function submitForm(formName, st) {
  ruleForm.value.validate((valid) => {
    if (valid) {
      let params = {...data.ruleForm}
      // params.flavors = data.dishFlavors
      params.status = data.ruleForm ? 1 : 0
      params.price *= 100
      params.categoryId = data.ruleForm.categoryId
      params.flavors = data.dishFlavors.map(obj => ({...obj, value: JSON.stringify(obj.value)}))
      delete params.dishFlavors
      if (!data.imageUrl) {
        $message.error('请上传菜品图片')
        return
      }
      if (data.actionType === 'add') {
        delete params.id
        addDish(params).then(res => {
          if (res.code === 1) {
            $message.success('菜品添加成功！')
            if (!st) {
              goBack()
            } else {
              data.dishFlavors = []
              // data.dishFlavorsData = []
              data.imageUrl = ''
              data.ruleForm = {
                'name': '',
                'id': '',
                'price': '',
                'code': '',
                'image': '',
                'description': '',
                'dishFlavors': [],
                'status': true,
                categoryId: ''
              }
            }
          } else {
            $message.error(res.msg || '操作失败')
          }
        }).catch(err => {
          $message.error('请求出错了：' + err)
        })
      } else {
        delete params.updateTime
        editDish(params).then(res => {
          if (res.code === 1) {
            $message.success('菜品修改成功！')
            goBack()
          } else {
            $message.error(res.msg || '操作失败')
          }
        }).catch(err => {
          $message.error('请求出错了：' + err)
        })
      }
    } else {
      return false
    }
  })
}

function handleAvatarSuccess(response, file, fileList) {
  // 拼接down接口预览
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
  window.parent.menuHandle({
    id: '4',
    path: '/backend/food/list',
    name: '菜品管理'
  }, false)
}
</script>

<template>
  <div id="food-add-app" class="addBrand-container">
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
          <el-form-item
              label="菜品名称:"
              prop="name"
          >
            <el-input
                v-model="data.ruleForm.name"
                maxlength="20"
                placeholder="请填写菜品名称"
            />
          </el-form-item>
          <el-form-item
              label="菜品分类:"
              prop="categoryId"
          >
            <el-select
                v-model="data.ruleForm.categoryId"
                placeholder="请选择菜品分类"
            >
              <el-option v-for="(item,index) in data.dishList" :key="index" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item
              label="菜品价格:"
              prop="price"
          >
            <el-input
                v-model="data.ruleForm.price"
                placeholder="请设置菜品价格"
            />
          </el-form-item>
        </div>
        <el-form-item label="口味做法配置:">
          <el-form-item>
            <div class="flavorBox">
              <span
                  v-if="data.dishFlavors.length === 0"
                  class="addBut"
                  @click="addFlavored"
              > + 添加口味</span>
              <div
                  v-if="data.dishFlavors.length !== 0"
                  class="flavor"
              >
                <div class="title">
                  <span>口味名（3个字内）</span><span>口味标签（输入标签回车添加）</span>
                </div>
                <div class="cont">
                  <div
                      v-for="(item, index) in data.dishFlavors"
                      :key="index"
                      class="items"
                  >
                    <div class="itTit">
                      <!-- <SelectInput
                        :dish-flavors-data="dishFlavorsData"
                        :index="index"
                        :value="item.name"
                        @select="selectHandle"
                      /> -->
                      <div class="selectInput">
                        <div>
                          <el-input
                              v-model="item.name"
                              placeholder="请输入口味"
                              style="width: 100%"
                              type="text"
                              @blur="outSelect(false,index)"
                              @focus="selectFlavor(true,index)"
                              @input="inputHandle(index)"
                          />
                        </div>
                        <div v-show="item.showOption" class="flavorSelect">
                          <span
                              v-for="(it, ind) in data.dishFlavorsData"
                              :key="ind"
                              class="items"
                              @click="checkOption(it,ind,index)"
                          >{{ it.name }}</span>
                          <span
                              v-if="data.dishFlavorsData === []"
                              class="none"
                          >无数据</span>
                        </div>
                      </div>
                    </div>
                    <div
                        class="labItems"
                        style="display: flex"
                    >
                      <span
                          v-for="(it, ind) in item.value"
                          :key="ind"
                      >{{ it }} <i @click="delFlavorLabel(index, ind)">X</i></span>
                      <div
                          :style="data.inputStyle"
                          class="inputBox"
                          contenteditable="true"
                          @focus="flavorPosition(index)"
                          @keydown.enter="(val)=>keyDownHandle(val,index)"
                      ></div>
                    </div>
                    <span
                        class="delFlavor delBut non"
                        @click="delFlavor(index)"
                    >删除</span>
                  </div>
                </div>
                <div
                    class="addBut"
                    @click="addFlavored"
                >
                  添加口味
                </div>
              </div>
            </div>
          </el-form-item>
        </el-form-item>
        <div>
        </div>
        <div>
          <el-form-item
              class="uploadImg"
              label="菜品图片:"
              prop="region"
          >
            <el-upload
                ref="upload"
                :on-change="onChange"
                :on-success="handleAvatarSuccess"
                :show-file-list="false"
                action="/common/upload"
                class="avatar-uploader"
            >
              <img
                  v-if="data.imageUrl"
                  :src="data.imageUrl"
                  alt="avatar"
                  class="avatar"
              />
              <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
              ></i>
            </el-upload>
          </el-form-item>
        </div>
        <div class="address">
          <el-form-item
              label="菜品描述:"
              prop="region"
          >
            <el-input
                v-model="data.ruleForm.description"
                :rows="3"
                maxlength="200"
                placeholder="菜品描述，最长200字"
                type="textarea"
            />
          </el-form-item>
        </div>
        <div class="subBox address">
          <el-form-item>
            <el-button @click="goBack()">
              取消
            </el-button>
            <el-button
                type="primary"
                @click="submitForm('ruleForm')"
            >
              保存
            </el-button>
            <el-button
                v-if="data.actionType === 'add'"
                class="continue"
                type="primary"
                @click="submitForm('ruleForm','goAnd')"
            >
              保存并继续添加菜品
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.selectInput {
  position: relative;
  width: 100%;
  min-width: 100px;
}

.selectInput .flavorSelect {
  position: absolute;
  width: 100%;
  padding: 0 10px;
  border-radius: 3px;
  border: solid 1px #FF903D;
  line-height: 30px;
  text-align: center;
  background: #fff;
  top: 50px;
  z-index: 99;
}

.selectInput .flavorSelect .items {
  cursor: pointer;
  display: inline-block;
  width: 100%;
  line-height: 35px;
  border-bottom: solid 1px #f4f4f4;
  color: #666;
}

.selectInput .flavorSelect .none {
  font-size: 14px;
}

#food-add-app .uploadImg .el-form-item__label::before {
  content: '*';
  color: #F56C6C;
  margin-right: 4px;
}

</style>