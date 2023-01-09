<!--
  - Copyright © 2023 Enaium <enaium@outlook.com>
  -
  - This work is free. You can redistribute it and/or modify it under the
  - terms of the Do What The Fuck You Want To Public License, Version 2,
  - as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
  -->

<script setup>
import {onMounted, reactive} from "vue";
import {editOrderDetail, getOrderDetailPage} from "@/api/backend/order.js";

const data = reactive({
  input: '',
  orderTime: '',
  beginTime: '',
  endTime: '',
  counts: 0,
  page: 1,
  pageSize: 10,
  tableData: [],
  dialogVisible: false,
  diaForm: {},
  loading: false
})

onMounted(() => {
  init()
})

const init = () => {
  getOrderDetailPage({
    page: data.page,
    pageSize: data.pageSize,
    number: data.input || undefined,
    beginTime: data.beginTime || undefined,
    endTime: data.endTime || undefined
  }).then(res => {
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
};

const getOrderType = row => {
  let str = ''
  switch (row.status) {
    case 1:
      str = '待付款'
      break;
    case 2:
      str = '正在派送'
      break;
    case 3:
      str = '已派送'
      break;
    case 4:
      str = '已完成'
      break;
    case 5:
      str = '已取消'
      break;

  }
  return str
};

// 查看详情
const goDetail = (row) => {
  data.diaForm = {}
  data.dialogVisible = true
  data.diaForm = {...row}
};

// 取消，派送，完成
function cancelOrDeliveryOrComplete(status, id) {
  editOrderDetail(params).then(res => {
    if (res.code === 1) {
      $message.success(status === 3 ? '订单已派送' : '订单已完成')
      init()
    } else {
      $message.error(res.msg || '操作失败')
    }
  }).catch(err => {
    $message.error('请求出错了：' + err)
  })
  const params = {
    status,
    id
  }
}

const handleClose = () => {
  data.dialogVisible = false
};

const handleSizeChange = (val) => {
  data.pageSize = val
  init()
};

const handleCurrentChange = (val) => {
  data.page = val
  init()
};
</script>

<template>
  <div id="order-app" v-loading="data.loading" class="dashboard-container">
    <div class="container">
      <!-- 搜索项 -->
      <div class="tableBar">
        <el-input v-model="data.input" placeholder="请输入订单号" style="width: 250px">
          <i slot="prefix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="init"></i>
        </el-input>
        <el-date-picker v-model="data.orderTime"
                        :default-time="['00:00:00', '23:59:59']"
                        clearable
                        end-placeholder="结束日期"
                        placeholder="选择日期"
                        range-separator="至"
                        start-placeholder="开始日期"
                        style="width: 400px;margin-left: 20px;"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
        <el-button class="search-btn" type="primary" @click="init">查询</el-button>
      </div>
      <el-table :data="data.tableData" class="tableBox" stripe>
        <el-table-column label="订单号" min-width="110" prop="number"></el-table-column>
        <el-table-column label="订单状态" prop="订单状态">
          <template #default="{ row }">
            <span>{{ getOrderType(row) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户" prop="userName"></el-table-column>
        <el-table-column label="手机号" prop="phone"></el-table-column>
        <el-table-column label="地址" prop="address" show-overflow-tooltip></el-table-column>
        <el-table-column label="下单时间" min-width="100" prop="orderTime"></el-table-column>
        <el-table-column label="实收金额" prop="amount">
          <template #default="{ row }">
            <span>￥{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="btn">
          <template #default="{ row }">
            <el-button class="blueBug" type="text" @click="goDetail(row)">
              查看
            </el-button>
            <el-divider v-if="row.status === 2" direction="vertical"></el-divider>
            <el-button v-if="row.status === 2" class="blueBug" type="text"
                       @click="cancelOrDeliveryOrComplete(3, row.id)">
              派送
            </el-button>
            <el-divider v-if="row.status === 3" direction="vertical"></el-divider>
            <el-button v-if="row.status === 3" class="blueBug" type="text"
                       @click="cancelOrDeliveryOrComplete(4, row.id)">
              完成
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          :current-page.sync="data.page"
          :page-size="data.pageSize"
          :page-sizes="[10, 20, 30, 40]"
          :total="data.counts"
          class="pageList"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      ></el-pagination>
    </div>

    <!-- 查看弹框部分 -->
    <el-dialog
        :before-close="handleClose"
        v-model="data.dialogVisible"
        title="订单信息"
        width="30%"
    >
      <div class="info-box">
        <div class="item-box">
          <span class="label">订单号：</span>
          <span class="des">{{ data.diaForm.number }}</span>
        </div>
        <div class="item-box">
          <span class="label">订单状态：</span>
          <span class="des">{{ getOrderType(data.diaForm) }}</span>
        </div>
        <div class="item-box">
          <span class="label">收货人：</span>
          <span class="des">{{ data.diaForm.consignee }}</span>
        </div>
        <div class="item-box">
          <span class="label">联系电话：</span>
          <span class="des">{{ data.diaForm.phone }}</span>
        </div>
        <div class="item-box">
          <span class="label">地址：</span>
          <span class="des">{{ data.diaForm.address }}</span>
        </div>
        <div class="item-box">
          <span class="label">支付金额：</span>
          <span class="des">{{ data.diaForm.amount }}</span>
        </div>
        <div class="item-box">
          <span class="label">下单时间：</span>
          <span class="des">{{ data.diaForm.orderTime }}</span>
        </div>
      </div>
      <!-- <el-form ref="diaForm" :model="diaForm" class="dia-form">
        <el-form-item label="订单号">
          <span>{{ diaForm.number }}</span>
        </el-form-item>
        <el-form-item label="订单状态">
          <span>{{ getOrderType(diaForm) }}</span>
        </el-form-item>
        <el-form-item label="收货人">
          <span>{{ diaForm.consignee }}</span>
        </el-form-item>
        <el-form-item label="联系电话">
          <span>{{ diaForm.phone }}</span>
        </el-form-item>
        <el-form-item label="地址">
          <span>{{ diaForm.address }}</span>
        </el-form-item>
        <el-form-item label="支付金额">
          <span>{{ diaForm.amount }}</span>
        </el-form-item>
        <el-form-item label="下单时间">
          <span>{{ diaForm.orderTime }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<style scoped>
.search-btn {
  margin-left: 20px;
}

.tableBar {
  justify-content: flex-start !important;
}

.info-box {
  margin: -15px -44px 20px;
}

.info-box .item-box {
  display: flex;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #666666;
  text-align: left;
  margin-bottom: 14px;
}

.info-box .item-box:last-child {
  margin-bottom: 0;
}

.info-box .item-box .label {
  width: 96px;
}

.info-box .item-box .des {
  flex: 1;
  color: #333333;
}
</style>