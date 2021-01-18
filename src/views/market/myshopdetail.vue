<template>
  <div class="hundred xykb-shopdetail yh-oreder" element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
    <div class="top-head-top"></div>
    <ul class='allFlex peopleFlex'>
      <li>
         <span :class="type === 1 ? 'peopleCheck': ''" @click='setType(1)'>
          全部
        </span>
      </li>
      <li>
        <span :class="type === '10B' ? 'peopleCheck': ''" @click="setType('10B')">
            已付款
        </span>
      </li>
      <li>
        <span :class="type === '10D' ? 'peopleCheck': ''" @click="setType('10D')">
            已发货
        </span>
      </li>
    </ul>
    <div class="shezhigaodu" v-infinite-scroll='load' infinite-scroll-disabled='disabled' infinite-scroll-delay='1000' style="overflow:auto">
      <div class="order-detail" v-for="(item,index) in danlist" :key="index">
        <div class="time-status">
          <span>{{item.postName}}</span>
          <span>{{status[item.status]}}</span>
        </div>
        <div class="top-shopdetail">
          <div class="img-left">
            <img :src="item.url" alt="">
          </div>
          <div class="detail-con">
            <div class="price-num">
              <div>
                <div>{{item.goodsName}}</div>
                <div class='redColor fontSmall'>￥{{item.goodsPrice}}{{item.goodsPoint ? ` + ${item.goodsPoint}积分` : ''}}</div>
              </div>
              <div class="t-yue">x {{item.goodsCount}}</div>
            </div>
          </div>
        </div>
        <div class="shop-num-price">
        <span>邮费:{{item.goodsFreight}}元</span>
        <div class="heji">
          <div>合计:<span class='redColor'>{{parseInt((item.goodsPrice + item.goodsFreight)*100)/100}}元</span></div>
          <div class='allFlex'>
            <div v-if='$route.query.shop' class="bbtnx" @click='info(item)'>订单信息</div>
            <div v-if='$route.query.shop && item.status == 0' @click='toOrder(item)' class="bbtnx bbMarign">立即发货</div>
          </div>
        </div>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="centerDialogVisible"
      width="13rem"
       title="订单信息"
      :show-close='false'
      :before-close='rewardShow'
      class='shopDia'
      center>
      <div class='shopBack'>
        <div class='popupContent allFlex'>
          <div class='widthShop'>商品名称</div>
          <div class='gary'>{{all.goods_name}}</div>
        </div>
        <div class='popupContent allFlex'>
          <div class='widthShop'>订购数量</div>
          <div class='gary'>{{all.count}}</div>
        </div>
        <div class='popupContent allFlex'>
          <div class='widthShop'>收货人</div>
          <div class='gary'>{{all.name}}</div>
        </div>
        <div class='popupContent allFlex'>
          <div class='widthShop'>联系人</div>
          <div class='gary'>{{all.phone}}</div>
        </div>
        <div class='popupContent allFlex'>
          <div class='widthShop'>收货地址</div>
          <div class='gary'>{{all.address}}</div>
        </div>
        <div class='popupContent allFlex'>
          <div class='widthShop'>订单状态</div>
          <div class='gary'>{{status[all.status]}}</div>
        </div>
      </div>
      <div class='popupContent allFlex justifyBetween'>
          <div class='widthShop'>结算金额</div>
          <div>{{all.price}}</div>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisible"
      width="13rem"
       title="订单信息"
      :show-close='false'
      :before-close='rewardShow'
      class='shopDia'
      center>
      <div class='shopBack whiteShop'>
        <div class='popupContent allFlex'>
          <div class='widthShop'>快递公司</div>
          <input v-model="company" type="text" class='inputShop' placeholder="">
        </div>
        <div class='popupContent allFlex'>
          <div class='widthShop'>物流单号</div>
          <input v-model="order" type="text" class='inputShop' placeholder="">
        </div>
      </div>
      <span slot="footer" class="dialog-footer allFlex justifyBetween">
        <el-button class='org' type="primary" @click="rewardShow()">取消</el-button>
        <el-button class='org' type="primary" @click="getOrder()">立即发货</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import router from '../../router'
export default {
  data () {
    return {
      version: '',
      merchantNo: '',
      parentphone: '',
      shapflag: false,
      company: '',
      order: '',
      danlist: [],
      paytype: {
        '10A': '支付宝支付',
        '10B': '微信支付',
        '10C': '余额支付'
      },
      status: {
        '10A': '待支付',
        '10B': '已支付',
        '10C': '待发货',
        '10D': '已发货',
        '10E': '已签收',
        '10F': '已取消',
        '70A': '支付失败'
      },
      callphone: '',
      type: 1,
      centerDialogVisible: false,
      dialogVisible: false,
      all: {},
      loading: false,
      page: -1,
      count: 10,
      setTime: '',
      fullscreenLoading: false
    }
  },
  components: {
  },
  watch: {
  },
  beforeCreate () {
  },
  created () {
    this.version = this.$stact.state.version
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.parentphone = JSON.parse(this.$stact.state.token)[0].parentPhone
    this.merchantid = JSON.parse(this.$stact.state.token)[0].id
  },
  computed: {
    noMore () {
      return this.count < 10
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  methods: {
    rewardShow () {
      this.centerDialogVisible = false
      this.dialogVisible = false
    },
    info (item) {
      this.centerDialogVisible = true
      this.all = item
      console.log(this.all)
    },
    toOrder (item) {
      this.dialogVisible = true
      this.all = item
    },
    setType (type) {
      this.fullscreenLoading = true
      this.type = type
      clearTimeout(this.setTime)
      this.danlist = []
      this.page = -1
      this.count = 10
      this.load()
    },
    load () { // 拉下加载
      let vm = this
      vm.loading = true
      vm.fullscreenLoading = true
      vm.setTime = setTimeout(async () => {
        vm.loading = false
        vm.page++
        await vm.message()
      }, 1000)
    },
    openphone () {
      this.shapflag = true
    },
    closephone () {
      this.shapflag = false
    },
    sureorder (id) {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '790027',
        '41': id,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            this.$message({
              message: '收货成功',
              center: true,
              offset: 30,
              duration: 2500,
              type: 'success'
            })
            this.message()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    message () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': vm.$route.query.shop ? '520122' : '680005',
        '5': vm.page,
        '6': 10,
        '7': vm.type === 1 ? '' : vm.type,
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            if (res.data[45]) {
              vm.danlist = vm.danlist.concat(JSON.parse(res.data[45]))
              vm.count = JSON.parse(res.data[45]).length
            }
          } else {
            if (vm.$route.query.shop) {
              vm.$message({
                message: res.data[39],
                center: true,
                offset: 30,
                duration: 2500,
                type: 'success'
              })
            }
          }
        })
        .catch(err => {
          vm.fullscreenLoading = false
          console.log(err)
        })
    },
    getOrder () {
      let vm = this
      if (vm.company.match(/^[ ]*$/)) {
        vm.$message({
          message: '快递公司必须填写',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.order.match(/^[ ]*$/)) {
        vm.$message({
          message: '物流单号必须填写',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      let parmas = {
        '0': '0700',
        '3': '520125',
        '42': vm.merchantNo,
        '43': vm.all.id,
        '44': vm.company,
        '45': vm.order,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.dialogVisible = false
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  destroyed () {
    clearTimeout(this.setTime)
  }
}
</script>
