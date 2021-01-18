<template>
  <div class='npm install --save picker-extend'>
    <div v-if="$route.meta.application" class="leftRouter leftwihteRouter">
      <img src="../../assets/leftArrow.png" v-if="$route.meta.application"  class="leftArrow" @click="goTop()"/>
      {{$route.meta.title}}
    </div>
    <div v-if="$route.meta.application" class="top-top-height"></div>
    <div class="level">
      <div class="left-col">等级</div>
      <div class="inp-box">
        <input v-if="!itemlist" id="trigger4" v-model="loardlevel" type="text" readonly placeholder="市/区领主">
        <input v-if="itemlist" v-model="loardlevel" type="text" readonly>
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
    <div class="level">
      <div class="left-col">城市</div>
      <div class="inp-box">
        <input v-if="!itemlist"  @click="selectshi" type="text" v-model="loardcity" readonly placeholder="请选择城市">
        <input v-if="itemlist" type="text" v-model="loardcity" readonly placeholder="请选择城市">
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
    <div class="level">
      <div class="left-col">地区</div>
      <div class="inp-box">
        <input v-if="!itemlist"  @click="selectarea" type="text" v-model="loardarea" readonly :placeholder="loardlevel == '市领主' ? '不可选' : '请选择地区'">
        <input v-if="itemlist" type="text" v-model="loardarea" readonly :placeholder="loardlevel == '市领主' ? '不可选' : '请选择地区'">
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
    <div class="level">
      <div class="left-col">当前报价</div>
      <div class="inp-box red-clo">
        {{needprice ? needprice : '待定'}}
      </div>
    </div>
    <div class="select-type-title">请选择支付方式</div>
    <div class="select-type">
      <div class="type-img">
        <img src="../../assets/bank/yl.png" alt="">
        <span>银行卡支付</span>
      </div>
      <div :class="payradio == '1' ? 'radio-btn select' : 'radio-btn'" @click="paytype('1')">
        <i class="el-icon-success"></i>
      </div>
    </div>
    <div class="select-type">
      <div class="type-img payyue">
        <img src="../../assets/payyue.png" alt="">
        <span>余额支付</span>
      </div>
      <div :class="payradio == '2' ? 'radio-btn select' : 'radio-btn'" @click="paytype('2')">
        <i class="el-icon-success"></i>
      </div>
    </div>
    <div class="select-pirce">
      <div class="title-baojia">报价金额</div>
      <div class="price-box">
        <i class="el-icon-arrow-left" @click="leftjian"></i>
        <div class="price-select">{{payprice ? payprice : '待定'}}</div>
        <i class="el-icon-arrow-right" @click="rightjia"></i>
      </div>
    </div>
    <div class="red-clo notic-box">申请领主需缴纳对应金额的保证金，直到下一个出价更高的申请人出现</div>
    <div class="shenqing" @click="apply">我要申请</div>
  </div>
</template>

<script>
import PickerExtend from 'picker-extend'
export default {
  data () {
    return {
      activeName: 'first',
      setint: null,
      setinttwo: null,
      merchantid: '',
      payradio: '1',
      loardlevel: '',
      loardcity: '',
      loardarea: '',
      needprice: '',
      payprice: '',
      sessionmessage: '',
      itemlist: '',
      qu: '区领主',
      shi: '市领主',
      queryareaid: ''
    }
  },
  components: {
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.merchantid = JSON.parse(this.$stact.state.token)[0].id
    if (this.$route.query.item) {
      this.itemlist = JSON.parse(this.$route.query.item)
      if (this.itemlist.city) {
        this.loardlevel = '区领主'
        this.loardcity = this.itemlist.city
        this.loardarea = this.itemlist.area
      } else {
        this.loardlevel = '市领主'
        this.loardcity = this.itemlist.area
      }
      this.needprice = this.itemlist.price
      this.payprice = this.needprice
      this.queryareaid = this.itemlist.id
    }
    this.sessionmessage = sessionStorage.getItem('citystay')
    if (sessionStorage.getItem('sellevel')) {
      this.loardlevel = sessionStorage.getItem('sellevel')
    }
    if (this.sessionmessage) {
      let citymessage = JSON.parse(this.sessionmessage)
      this.loardcity = citymessage[1].divisionName + '-' + citymessage[2].divisionName
      this.needprice = citymessage[1].price
      this.payprice = citymessage[1].price
      if (this.loardlevel === '区领主') {
        this.loardarea = citymessage[3].divisionName
      }
    }
    // this.message()
  },
  mounted () {
    this.$inputLen.inputJs()
    let vm = this
    if (this.$route.query.item) {
      return
    }
    let mobileSelect4 = new PickerExtend({
      trigger: '#trigger4',
      title: '',
      wheels: [
        {
          data:
          [
            {
              id: '1',
              value: '市领主'
            },
            {
              id: '2',
              value: '区领主'
            }
          ]
        }
      ],
      callback: function (indexArr, data) {
        vm.loardlevel = data[0].value
        if (vm.loardlevel === '市领主') {
          vm.loardarea = ''
        }
        sessionStorage.setItem('sellevel', vm.loardlevel)
      }
    })
  },
  methods: {
    goTop () {
      sessionStorage.clear('sellevel')
      sessionStorage.clear('citystay')
      sessionStorage.clear('city')
      this.$router.push({ name: 'feudalpage' })
    },
    paytype (type) {
      if (type === '1') {
        this.payradio = '1'
      }
      if (type === '2') {
        this.payradio = '2'
      }
    },
    apply () {
      let vm = this
      if (vm.payprice <= vm.needprice) {
        vm.$message({
          message: '报价金额要大于' + vm.needprice,
          center: true,
          offset: 30,
          duration: 2500,
          type: 'success'
        })
        return
      }
      let areaid = ''
      if (vm.queryareaid === '') {
        if (vm.loardlevel === '市领主') {
          areaid = JSON.parse(vm.sessionmessage)[2].id
        }
        if (vm.loardlevel === '区领主') {
          areaid = JSON.parse(vm.sessionmessage)[3].id
        }
      } else {
        areaid = vm.queryareaid
      }
      if (this.payradio === '1') {
        this.$router.push({ name: 'choosecard', query: { price: vm.payprice, areaid: areaid } })
      }
      if (this.payradio === '2') {
        vm.payfeudal(areaid)
      }
    },
    payfeudal (areaid) {
      let vm = this
      if (vm.queryareaid !== '') {
        areaid = vm.queryareaid
      }
      let parmas = {
        '0': '0700',
        '3': '393003',
        '35': vm.payprice, // 金额
        '42': vm.merchantNo,
        '43': areaid, // 地区 id
        '45': '10A', // 支付方式
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.$message({
              message: '申请成功',
              center: true,
              offset: 30,
              duration: 2500,
              type: 'warning'
            })
          } else {
            vm.$message({
              message: res.data[39],
              center: true,
              offset: 30,
              duration: 2500,
              type: 'warning'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    leftjian () {
      let vm = this
      if (vm.loardlevel === '') {
        vm.$message({
          message: '请先选择等级',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'success'
        })
        return
      }
      if (vm.loardcity === '') {
        vm.$message({
          message: '请先选择城市',
          type: 'success'
        })
        return
      }
      if (vm.loardlevel !== '市领主' && vm.loardarea === '') {
        vm.$message({
          message: '请先选择地区',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'success'
        })
        return
      }
      if (vm.payprice <= vm.needprice) {
        return
      }
      vm.payprice = Number(vm.payprice) - 300
    },
    rightjia () {
      let vm = this
      if (vm.loardlevel === '') {
        vm.$message({
          message: '请先选择等级',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'success'
        })
        return
      }
      if (vm.loardcity === '') {
        vm.$message({
          message: '请先选择城市',
          type: 'success'
        })
        return
      }
      if (vm.loardlevel !== '市领主' && vm.loardarea === '') {
        vm.$message({
          message: '请先选择地区',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'success'
        })
        return
      }
      vm.payprice = Number(vm.payprice) + 300
    },
    selectshi () {
      let vm = this
      if (vm.loardlevel === '') {
        vm.$message({
          message: '请先选择等级',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'success'
        })
        return
      }
      vm.$router.push({ name: 'selcity', query: { selectlevel: vm.loardlevel } })
    },
    selectarea () {
      let vm = this
      if (vm.loardlevel === '市领主') {
        return
      }
      if (vm.loardlevel === '') {
        vm.$message({
          message: '请先选择等级',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'success'
        })
        return
      }
      if (vm.loardcity === '') {
        vm.$message({
          message: '请先选择城市',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'success'
        })
        return
      }
      vm.$router.push({ name: 'selarea', query: { cityid: JSON.parse(vm.sessionmessage)[2].id } })
    },
    message () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '393001',
        '35': vm.merchantid,
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
