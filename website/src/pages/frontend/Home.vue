<!--
  - Copyright © 2023 Enaium <enaium@outlook.com>
  -
  - This work is free. You can redistribute it and/or modify it under the
  - terms of the Do What The Fuck You Want To Public License, Version 2,
  - as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
  -->

<script setup>
import {computed, onMounted, reactive} from "vue";
import {
  addCartApi,
  cartListApi,
  categoryListApi,
  clearCartApi,
  dishListApi,
  setMealDishDetailsApi,
  setmealListApi,
  updateCartApi
} from "@/api/frontend/main.js";
import {imgPath} from "@/js/frontend/common.js";
import {Dialog, Popup} from 'vant';
import {useRouter} from "vue-router";
import {base} from "@/js/frontend/base.js";

const router = useRouter();

const data = reactive({
  //左边菜品类别index
  activeType: 0,
  categoryList: [],
  categoryId: undefined,
  dishList: [],
  cartData: [],
  dialogFlavor: {
    name: '',
    flavors: [],
    dishId: undefined,
    price: undefined,
    show: false,
    image: ''
  },
  cartDialogShow: false,
  detailsDialog: {
    show: false,
    item: {image: ''}
  },
  setMealDialog: {
    show: false,
    item: {}
  }
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
  base()
  initData()
})

function initData() {
  Promise.all([categoryListApi(), cartListApi({})]).then(res => {
    //获取分类数据
    if (res[0].code === 1) {
      data.categoryList = res[0].data
      if (Array.isArray(res[0].data) && res[0].data.length > 0) {
        data.categoryId = res[0].data[0].id
        if (res[0].data[0].type === 1) {
          getDishList()
        } else {
          getSetmealData()
        }
      }
    } else {
      $notify({type: 'warning', message: res[0].msg});
    }
    //获取菜品数据
    if (res[1].code === 1) {
      data.cartData = res[1].data
    } else {
      $notify({type: 'warning', message: res[1].msg});
    }
  })
}

//分类点击
function categoryClick(index, id, type) {
  data.activeType = index
  data.categoryId = id
  if (type === 1) {//菜品
    getDishList()
  } else {
    getSetmealData()
  }
}

//获取菜品数据
async function getDishList() {
  if (!data.categoryId) {
    return
  }
  const res = await dishListApi({categoryId: data.categoryId, status: 1})
  if (res.code === 1) {
    let dishList = res.data
    const cartData = data.cartData
    if (dishList.length > 0 && cartData.length > 0) {
      dishList.forEach(dish => {
        cartData.forEach(cart => {
          if (dish.id === cart.dishId) {
            dish.number = cart.number
          }
        })
      })
    }
    data.dishList = dishList
  } else {
    $notify({type: 'warning', message: res.msg});
  }
}

//获取套餐数据setmealId
async function getSetmealData() {
  if (!data.categoryId) {
    return
  }
  const res = await setmealListApi({categoryId: data.categoryId, status: 1})
  if (res.code === 1) {
    let dishList = res.data
    const cartData = data.cartData
    if (dishList.length > 0 && cartData.length > 0) {
      dishList.forEach(dish => {
        cartData.forEach(cart => {
          if (dish.id === cart.setmealId) {
            dish.number = cart.number
          }
        })
      })
    }
    data.dishList = dishList
  } else {
    $notify({type: 'warning', message: res.msg});
  }
}

//获取购物车数据
async function getCartData() {
  const res = await cartListApi({})
  if (res.code === 1) {
    data.cartData = res.data
  } else {
    $notify({type: 'warning', message: res.msg});
  }
}

//菜单中往购物车中添加商品
async function addCart(item) {
  let params = {
    amount: item.price / 100,//金额
    dishFlavor: item.dishFlavor,//口味  如果没有传undefined
    dishId: undefined,//菜品id
    setmealId: undefined,//套餐id
    name: item.name,
    image: item.image
  }
  if (Array.isArray(item.flavors)) {//表示是菜品
    params.dishId = item.id
  } else {//表示套餐 套餐没有口味
    params.setmealId = item.id
  }
  const res = await addCartApi(params)
  if (res.code === 1) {
    data.dishList.forEach(dish => {
      if (dish.id === item.id) {
        dish.number = res.data.number
      }
    })
    if (data.setMealDialog.show) {
      item.number = res.data.number
    }
    await getCartData()
  } else {
    $notify({type: 'warning', message: res.msg});
  }
}

//菜单中减少选中的商品
async function subtractCart(item) {
  let params = {
    dishId: item.id,
  }
  if (!Array.isArray(item.flavors)) {
    params = {
      setmealId: item.id,
    }
  }
  const res = await updateCartApi(params)
  if (res.code === 1) {
    data.dishList.forEach(dish => {
      if (dish.id === item.id) {
        dish.number = (res.data.number === 0 ? undefined : res.data.number)
      }
    })
    if (data.setMealDialog.show) {
      item.number = (res.data.number === 0 ? undefined : res.data.number)
    }
    await getCartData()
  } else {
    $notify({type: 'warning', message: res.msg});
  }
}

//展开购物车
function openCart() {
  if (data.cartData.length > 0) {
    data.cartDialogShow = true
  }
}

//购物车中增加商品数量
async function cartNumAdd(item) {
  let params = {
    amount: item.amount,//金额
    dishFlavor: item.dishFlavor,//口味  如果没有传undefined
    dishId: item.dishId,//菜品id
    setmealId: item.setmealId,//套餐id
    name: item.name,
    image: item.image
  }
  const res = await addCartApi(params)
  if (res.code === 1) {
    data.dishList.forEach(dish => {
      if (dish.id === (item.dishId || item.setmealId)) {
        dish.number = res.data.number
      }
    })
    console.log(data.dishList)
    await getCartData()
  } else {
    $notify({type: 'warning', message: res.msg});
  }
}

//购物车中减少商品数量
async function cartNumberSubtract(item) {
  let params = {
    dishId: item.dishId,
    setmealId: item.setmealId,
  }
  const res = await updateCartApi(params)
  if (res.code === 1) {
    data.dishList.forEach(dish => {
      if (dish.id === (item.dishId || item.setmealId)) {
        dish.number = (res.data.number === 0 ? undefined : res.data.number)
      }
    })
    await getCartData()
  } else {
    $notify({type: 'warning', message: res.msg});
  }
}

//修改商品列表中的数据number
function changeDishList(item) {
  for (let ele of data.dishList) {
    if (ele.id === (item.setmealId || item.dishId)) {
      ele.number = item.number
    }
  }
}

//清空购物车
async function clearCart() {
  const res = await clearCartApi()
  if (res.code === 1) {
    for (let ele of data.dishList) {
      ele.number = undefined
    }
    data.cartData = []
    data.cartDialogShow = false
  } else {
    $notify({type: 'warning', message: res.msg});
  }
}

//点击选择规格
function chooseFlavorClick(item) {
  data.dialogFlavor = {
    name: '',
    flavors: [],
    dishId: undefined,
    price: undefined,
    show: false
  }
  data.dialogFlavor = {
    name: item.name,
    flavors: item.flavors,
    dishId: item.id,
    price: item.price,
    show: true,
    image: item.image
  }
}

function flavorClick(flavor, item) {
  flavor.dishFlavor = item
  //强制刷新dialog的dom
  data.dialogFlavor.show = false
  data.dialogFlavor.show = true
}

//选择规格加入购物车
function dialogFlavorAddCart() {
  const dialogFlavor = data.dialogFlavor
  let flag = true
  let dishFlavor = []
  dialogFlavor.flavors.forEach(item => {
    if (item.dishFlavor) {
      dishFlavor.push(item.dishFlavor)
    } else {
      flag = false
      $notify({type: 'warning', message: '请选择' + item.name});
    }
  })
  if (flag) {
    addCart({
      price: dialogFlavor.price,
      dishFlavor: dishFlavor.join(","),
      id: dialogFlavor.dishId,
      flavors: [],
      image: dialogFlavor.image,
      name: dialogFlavor.name
    })
    data.dialogFlavor.show = false
  }

}

//网络图片路径转换
function imgPathConvert(path) {
  return imgPath(path)
}

//跳转到去结算界面
function toAddOrderPage() {
  if (data.cartData.length > 0) {
    router.push({path: "/frontend/add-order"})
  }
}

function toUserPage() {
  router.push({path: "/frontend/user"})
}

async function dishDetails(item) {
  //先清除对象数据，如果不行的话dialog使用v-if
  data.detailsDialog.item = {}
  data.setMealDialog.item = {}
  if (Array.isArray(item.flavors)) {
    data.detailsDialog.item = item
    data.detailsDialog.show = true
  } else {
    //显示套餐的数据
    const res = await setMealDishDetailsApi(item.id)
    if (res.code === 1) {
      data.setMealDialog.item = {...item, list: res.data}
      data.setMealDialog.show = true
    } else {
      $notify({type: 'warning', message: res.msg});
    }
  }

}
</script>

<template>
  <div id="main" class="app">
    <div class="divHead">
      <img alt="" src="@/assets/frontend/user.png" @click="toUserPage"/>
    </div>
    <div class="divTitle">
      <div class="divStatic">
        <img alt="" class="logo" src="@/assets/frontend/logo.png"/>
        <div class="divDesc">
          <div class="divName">菩提阁餐厅</div>
          <div class="divSend">
            <span><img alt="" src="@/assets/frontend/time.png"/> 距离1.5km</span>
            <span><img alt="" src="@/assets/frontend/money.png"/> 配送费6元</span>
            <span><img alt="" src="@/assets/frontend/location.png"/> 预计时长12min</span>
          </div>
        </div>
      </div>
      <div class="divDesc">
        简介: 菩提阁中餐厅是菩提阁点餐的独立的品牌，定位“大众 化的美食外送餐饮”，旨为顾客打造专业美食。
      </div>
    </div>
    <div class="divBody">
      <div class="divType">
        <ul>
          <li v-for="(item,index) in data.categoryList" :key="index" :class="{active:data.activeType === index}"
              @click="categoryClick(index,item.id,item.type)">{{ item.name }}
          </li>
        </ul>
      </div>
      <div class="divMenu">
        <div>
          <div v-for="(item,index) in data.dishList" :key="index" class="divItem" @click="dishDetails(item)">
            <el-image :src="imgPathConvert(item.image)">
              <div slot="error" class="image-slot">
                <img src="@/assets/frontend/noImg.png"/>
              </div>
            </el-image>
            <div>
              <div class="divName">{{ item.name }}</div>
              <div class="divDesc">{{ item.description }}</div>
              <div class="divDesc">{{ '月销' + (item.saleNum ? item.saleNum : 0) }}</div>
              <div class="divBottom"><span>￥</span><span>{{ item.price / 100 }}</span></div>
              <div class="divNum">
                <div v-if="item.number > 0" class="divSubtract">
                  <img src="@/assets/frontend/subtract.png" @click.prevent.stop="subtractCart(item)"/>
                </div>
                <div class="divDishNum">{{ item.number }}</div>
                <div v-if="item.flavors && item.flavors.length > 0 && !item.number " class="divTypes"
                     @click.prevent.stop="chooseFlavorClick(item)">选择规格
                </div>
                <div v-else class="divAdd">
                  <img src="@/assets/frontend/add.png" @click.prevent.stop="addCart(item)"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="divLayer">
      <div class="divLayerLeft"></div>
      <div class="divLayerRight"></div>
    </div>
    <div v-if="data.categoryList.length > 0" class="divCart">
      <div
          :class="{imgCartActive: data.cartData && data.cartData.length > 0, imgCart:!data.cartData || data.cartData.length<1}"
          @click="openCart"></div>
      <div v-if="data.cartData && data.cartData.length > 0"
           :class="{divGoodsNum:1===1, moreGoods:data.cartData && data.cartData.length > 99}">{{ goodsNum }}
      </div>
      <div class="divNum">
        <span>￥</span>
        <span>{{ goodsPrice }}</span>
      </div>
      <div class="divPrice"></div>
      <div
          :class="{btnSubmitActive: data.cartData && data.cartData.length > 0, btnSubmit:!data.cartData || data.cartData.length<1}"
          @click="toAddOrderPage">去结算
      </div>
    </div>
    <Dialog ref="flavorDialog" v-model="data.dialogFlavor.show" :show-confirm-button="false" class="dialogFlavor">
      <div class="dialogTitle">{{ data.dialogFlavor.name }}</div>
      <div class="divContent">
        <div v-for="flavor in data.dialogFlavor.flavors" :key="flavor.id">
          <div class="divFlavorTitle">{{ flavor.name }}</div>
          <span v-for="item in JSON.parse(flavor.value)"
                :key="item"
                :class="{spanActive:flavor.dishFlavor === item}"
                @click="flavorClick(flavor,item)"
          >{{ item }}</span>
        </div>
      </div>
      <div class="divBottom">
        <div><span class="spanMoney">￥</span>{{ data.dialogFlavor.price / 100 }}</div>
        <div @click="dialogFlavorAddCart">加入购物车</div>
      </div>
      <div class="divFlavorClose" @click="data.dialogFlavor.show = false">
        <img src="@/assets/frontend/close.png"/>
      </div>
    </Dialog>
    <Popup v-model="data.cartDialogShow" :style="{ height: '50%' }" class="dialogCart" position="bottom">
      <div class="divCartTitle">
        <div class="title">购物车</div>
        <div class="clear" @click="clearCart">
          <i class="el-icon-delete"></i> 清空
        </div>
      </div>
      <div class="divCartContent">
        <div v-for="item in data.cartData" :key="item.id" class="divCartItem">
          <el-image :src="imgPathConvert(item.image)">
            <div slot="error" class="image-slot">
              <img src="@/assets/frontend/noImg.png"/>
            </div>
          </el-image>
          <div class="divDesc">
            <div class="name">{{ item.name }}</div>
            <div class="price">
              <span class="spanMoney">￥</span>{{ item.amount }}
            </div>
          </div>
          <div class="divNum">
            <div class="divSubtract">
              <img src="@/assets/frontend/subtract.png" @click="cartNumberSubtract(item)"/>
            </div>
            <div class="divDishNum">{{ item.number }}</div>
            <div class="divAdd">
              <img src="@/assets/frontend/add.png" @click="cartNumAdd(item)"/>
            </div>
          </div>
          <div class="divSplit"></div>
        </div>
      </div>
    </Popup>
    <Dialog v-if="data.detailsDialog.show"
            ref="detailsDialog"
            v-model="data.detailsDialog.show"
            :show-confirm-button="false"
            class="detailsDialog"
    >
      <div class="divContainer">
        <el-image :src="imgPathConvert(data.detailsDialog.item.image)">
          <div slot="error" class="image-slot">
            <img src="@/assets/frontend/noImg.png"/>
          </div>
        </el-image>
        <div class="title">{{ data.detailsDialog.item.name }}</div>
        <div class="content">{{ data.detailsDialog.item.description }}</div>
      </div>
      <div class="divNum">
        <div class="left">
          <span>￥</span><span>{{ data.detailsDialog.item.price / 100 }}</span>
        </div>
        <div class="right">
          <div v-if="data.detailsDialog.item.number > 0" class="divSubtract">
            <img src="@/assets/frontend/subtract.png" @click="subtractCart(data.detailsDialog.item)"/>
          </div>
          <div class="divDishNum">{{ data.detailsDialog.item.number }}</div>
          <div
              v-if="data.detailsDialog.item.flavors && data.detailsDialog.item.flavors.length > 0 && !data.detailsDialog.item.number "
              class="divTypes"
              @click="chooseFlavorClick(data.detailsDialog.item)">选择规格
          </div>
          <div v-else class="divAdd">
            <img src="@/assets/frontend/add.png" @click="addCart(data.detailsDialog.item)"/>
          </div>
        </div>
      </div>
      <div class="detailsDialogClose" @click="data.detailsDialog.show = false">
        <img src="@/assets/frontend/close.png"/>
      </div>
    </Dialog>
    <Dialog v-if="data.setMealDialog.show"
            ref="setMealDetailsDialogd"
            v-model="data.setMealDialog.show"
            :show-confirm-button="false"
            class="setMealDetailsDialog"
    >
      <div class="divContainer">
        <div class="title">{{ data.setMealDialog.item.name }}</div>
        <div v-for="(item,index) in data.setMealDialog.item.list" :key="index" class="item">
          <el-image :src="imgPathConvert(item.image)">
            <div slot="error" class="image-slot">
              <img src="@/assets/frontend/noImg.png"/>
            </div>
          </el-image>
          <div class="divSubTitle">{{ item.name + '(' + item.copies + '份)' }}
            <div class="divPrice">
              <span>￥</span><span>{{ item.price / 100 }}</span>
            </div>
          </div>
          <div class="content">{{ item.description }}</div>
        </div>
      </div>
      <div class="divNum">
        <div class="left">
          <span>￥</span><span>{{ data.setMealDialog.item.price / 100 }}</span>
        </div>
        <div class="right">
          <div v-if="data.setMealDialog.item.number > 0" class="divSubtract">
            <img src="@/assets/frontend/subtract.png" @click="subtractCart(data.setMealDialog.item)"/>
          </div>
          <div class="divDishNum">{{ data.setMealDialog.item.number }}</div>
          <div v-if="data.setMealDialog.item.number" class="divAdd">
            <img src="@/assets/frontend/add.png" @click="addCart(data.setMealDialog.item)"/>
          </div>
          <div v-if="!data.setMealDialog.item.number" class="addCart" @click="addCart(data.setMealDialog.item)">
            加入购物车
          </div>
        </div>
      </div>
      <div class="detailsDialogClose" @click="data.setMealDialog.show = false">
        <img src="@/assets/frontend/close.png"/>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>

</style>