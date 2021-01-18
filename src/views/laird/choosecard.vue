<template>
  <div class="dx-select">
    <div style='height:1px'></div>
    <div>
        <div class='bankgroud' v-for='item in cardList' :key='item.ID'>
            <div class="bank-title">
                <img :src="banks[item.BANK_NAME]?require(`../../assets/bank/white/${banks[item.BANK_NAME]}.png`):require('../../assets/bank/white/yl.png')" class='bankLogo' />
                <span class='bankRight'>
                    {{item.short_cn_name}}
                </span>
                <span class="jiebang" @click="relievebox(item.BANK_ACCOUNT)">解绑</span>
            </div>
            <div class='allFlex choose setflex'>
                <div class='garyChoose whiteColor'>{{item.BANK_ACCOUNT.substring(0, 4)}}</div>
                <div class='garyChoose mar-both'>****</div>
                <div class='garyChoose mar-right'>****</div>
                <div class='garyChoose whiteColor'>{{item.BANK_ACCOUNT.substring(item.BANK_ACCOUNT.length-4, item.BANK_ACCOUNT.length)}}</div>
            </div>
            <div class='allFlex choose border bankbottom'>
              <div class='garyChoose smallFont'>
                    <p>额度</p>
                    <p class="clo">{{item.LIMIT_MONEY}}</p>
                </div>
                <div class='garyChoose smallFont'>
                    <p>账单日</p>
                    <p class="clo">{{item.BILL_DAY}}</p>
                </div>
                <div class='garyChoose smallFont'>
                    <p>还款日</p>
                    <p class="clo">{{item.REPAYMENT_DAY}}</p>
                </div>
                <div class='garyChoose whiteColor smallFont btn-dexin' @click="open(item.BANK_ACCOUNT)">
                    <!-- <img src='../../assets/immediately.png'  class='immediately'/> -->
                    立即付费
                </div>
            </div>
        </div>
    </div>
    <!-- <div @click="addcard" class="addbank">
      <i class="el-icon-plus"></i>添加信用卡
    </div> -->
    <div class="shadbg" v-show="shap">
      <div class="relicve-box">
        <div class="title">解绑信用卡</div>
        <div class="con">是否解绑信用卡</div>
        <div class="btn">
          <div class="mar-left" @click="relieve">解绑</div>
          <div @click="cencle">取消</div>
        </div>
      </div>
    </div>
    <div class="shap-bg" v-if="shapflag" @click.stop="closeshap()">
      <div class="tuijian-box" @click="jingzhi($event)">
        <div class="title">绑定推荐人</div>
        <div class="inp-box">
          <el-input prefix-icon="el-icon-user" size="small" v-model="input" placeholder="请输入推荐人手机号"></el-input>
        </div>
        <div class="col-red">该手机号将成为您的直属上级</div>
        <div class="sure-btn" @click.stop="sure">确认</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      version: '',
      agentNo: '',
      merchantNo: '',
      cardList: [],
      banks: {
        313003: 'bj',
        303: 'gd',
        306: 'gf',
        105: 'js',
        301: 'jt',
        305: 'ms',
        103: 'ny',
        307: 'pa',
        309: 'xy',
        310: 'pf',
        403: 'yz',
        308: 'zs',
        102: 'gs',
        104: 'zg',
        302: 'zx',
        313062: 'sh',
        304: 'hx'
      },
      shap: false,
      bankaccount: '',
      shapflag: false,
      input: '',
      payprice: '',
      areaid: ''
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.parentphone = JSON.parse(this.$stact.state.token)[0].parentPhone
    this.freezeStatus = JSON.parse(this.$stact.state.token)[0].freezeStatus
    this.payprice = this.$route.query.price
    this.areaid = this.$route.query.areaid
    if (this.parentphone && this.parentphone === '123' && this.freezeStatus === '10B') {
      this.shapflag = true
    } else {
      this.shapflag = false
    }
    this.list()
  },
  methods: {
    closeshap () {
      this.shapflag = false
    },
    jingzhi (event) {
      event.stopPropagation()
    },
    relievebox (bankaccount) {
      this.shap = true
      this.bankaccount = bankaccount
    },
    relieve () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '190520',
        '8': vm.bankaccount,
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.post(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.$message({
              message: '解绑成功',
              center: true,
              offset: 30,
              duration: 2500,
              type: 'success'
            })
          } else {
            vm.shap = false
            vm.$message({
              message: res.data[39],
              center: true,
              offset: 30,
              duration: 2500,
              type: 'success'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    cencle () {
      this.shap = false
    },
    list () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '190932',
        '42': vm.merchantNo,
        '43': '0',
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.cardList = JSON.parse(res.data[57])
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    open (cardnum) {
      this.$confirm('确认使用该卡支付?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.payfeudal(cardnum)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    payfeudal (cardnum) {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '393003',
        '35': vm.payprice, // 金额
        '42': vm.merchantNo,
        '43': vm.areaid, // 地区 id
        '44': cardnum, // 银行卡号
        '45': '10B', // 支付方式
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
            vm.$router.push({ name: 'feudalpage' })
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
    sure () {
      let vm = this
      if (!(/^1[1-9]\d{9}$/.test(vm.input))) {
        vm.$message({
          message: '手机号码有误，请重填',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      let parmas = {
        '0': '0700',
        '3': '190931',
        '42': vm.merchantNo,
        '43': vm.input,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            this.$message({
              message: '绑定成功',
              center: true,
              offset: 30,
              duration: 2500,
              type: 'warning'
            })
          } else {
            this.$message({
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
    }
  }
}
</script>
