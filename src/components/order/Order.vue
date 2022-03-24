<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表数据 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send">
          <template slot-scope="scope">
            <template>
              {{scope.row.is_send}}
            </template>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
              <!-- 修改地址 -->
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
            <!-- 物流进度 -->
            <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" 
      @current-change="handleCurrentChange" 
      :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15]" 
      :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" 
      :total="total">
      </el-pagination>
    </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" 
    width="50%" @close="addressDialogClosed">
      <el-form :model="addressForm" :rules="addressFormRules" 
      ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" 
          v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline>
          <!-- 遍历进度信息，时间线内信息 -->
        <el-timeline-item v-for="(activity, index) in progressInfo" 
        :key="index" :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
// 导入城市数据
import cityData from './citydata.js'

export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderlist: [],
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
       progressInfo: [],

      res: {
      data: [
     {
      time: "2018-05-10 09:39:00",
      ftime: "2018-05-10 09:39:00",
      context: "已签收,感谢使用顺丰,期待再次为您服务",
      location: ""
      },
      {
      time: "2018-05-10 08:23:00",
      ftime: "2018-05-10 08:23:00",
      context: "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
      location: ""
      },
      {
      time: "2018-05-10 07:32:00",
      ftime: "2018-05-10 07:32:00",
      context: "快件到达 [北京海淀育新小区营业点]",
      location: ""
       },
        {
      time: "2018-05-10 02:03:00",
      ftime: "2018-05-10 02:03:00",
      context: "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
      location: ""
      },
       {
      time: "2018-05-09 23:05:00",
      ftime: "2018-05-09 23:05:00",
      context: "快件到达 [北京顺义集散中心]",
      location: ""
      },
      {
      time: "2018-05-09 21:21:00",
      ftime: "2018-05-09 21:21:00",
      context: "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
      location: ""
      },
      {
      time: "2018-05-09 13:07:00",
      ftime: "2018-05-09 13:07:00",
      context: "顺丰速运 已收取快件",
      location: ""
      },
      {
      time: "2018-05-09 12:25:03",
      ftime: "2018-05-09 12:25:03",
      context: "卖家发货",
      location: ""
      },
      {
      time: "2018-05-09 12:22:24",
      ftime: "2018-05-09 12:22:24",
      context: "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
      location: ""
      },
      {
      time: "2018-05-08 21:36:04",
      ftime: "2018-05-08 21:36:04",
      context: "商品已经下单",
      location: ""
      }
  ],},
  
    //   重名简写
      cityData,
      progressVisible: false,
     
    }
    
  
},
 created(){
     this.getOrderList()
 },
 
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败！')
      }

      console.log(res)
      this.total = res.data.total
      this.orderlist = res.data.goods
    }, 
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 展示修改地址的对话框
    showBox() {
      this.addressVisible = true
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },

    // 物流进度
    async showProgressBox() {
        // 接口数据失效，把data写死
    //   const { data: res } = await this.$http.get('/kuaidi/1106975712662')

    //   if (res.meta.status !== 200) {
    //     return this.$message.error('获取物流进度失败！')
    //   }

      this.progressInfo = this.res.data
      this.progressVisible = true
      console.log(this.progressInfo)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';

.el-cascader {
  width: 100%;
}
</style>
