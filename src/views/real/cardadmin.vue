<template>
  <div>
    <div style='height:1px'></div>
    <div class="realname">
        <div class="demo-input-suffix clear-mar">
            <el-input
                placeholder="请输入账单日"
                prefix-icon="el-icon-search"
                v-model="input"
                @change="selectchange()"
                @input="space()">
            </el-input>
        </div>
        <div class='bankgroud' v-for='(item, index) in cardList' :key='index'>
            <div class='allFlex justifyBetween'>
                <div>
                  <img :src="banks[item.BANK_NAME]?require(`../../assets/bank/white/${banks[item.BANK_NAME]}.png`):require('../../assets/bank/white/yl.png')" class='bankLogo' />
                  <span class='bankRight fourFont'>
                      {{item.short_cn_name}}
                  </span>
                  <span class='fourFont bankRight '>{{item.BANK_ACCOUNT_NAME}}</span>
                </div>
                <i class='el-icon-delete fontWeight' @click.stop='de(item.BANK_ACCOUNT, item.MERCHANT_NO)'></i>
            </div>
            <div class='allFlex choose'>
                <div class='garyChoose'>****</div>
                <div class='garyChoose'>****</div>
                <div class='garyChoose'>****</div>
                <div class='garyChoose whiteColor'>{{item.BANK_ACCOUNT.substring(item.BANK_ACCOUNT.length-4, item.BANK_ACCOUNT.length)}}</div>
            </div>
            <div class='allFlex choose border'>
                <div class='garyChoose smallFont'>
                    <p>{{item.BILL_DAY}}</p>
                    <p>账单日</p>
                </div>
                <div class='garyChoose smallFont'>
                    <p>{{item.REPAYMENT_DAY}}</p>
                    <p>还款日</p>
                </div>
                <div class='garyChoose smallFont'>
                    <p>{{item.LIMIT_MONEY}}</p>
                    <p>额度</p>
                </div>
                <div @click='openselect(item)' class='garyChoose whiteColor smallFont'>
                    <img src='../../assets/repay/setcard.png'  class='immediately'/>
                </div>
            </div>
        </div>
        <div class='repayMax' v-show="false">
          <router-link tag="div" :to="{ name:'addcard' }">
            <img src='../../assets/repay/addcard.png'/>
          </router-link>
        </div>
    </div>
    <el-dialog
      :visible.sync="centerDialogVisible"
      width="13.2rem"
      :show-close='false'
      :before-close='rewardShow'
      class='popup'
      center>
      <div>
        <div class='popupTitle'>请选择还款方式</div>
        <div class='popupContent'></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div>
          <div><el-button type="primary" @click='toNext("YK","zn")'>智能还款</el-button></div>
          <div><el-button type="primary" @click='toNext("YK","js")'>极速空卡</el-button></div>
          <div><el-button type="primary" @click='toNext("QYK","kk")'>空卡还款</el-button></div>
        </div>
      </div>
    </el-dialog>
    <div class='bottomLong' element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'></div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      version: '',
      input: '',
      agentNo: '',
      merchantNo: '',
      cardList: [],
      clearsettimeout: null,
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
      now: -1,
      usermerchantNo: '',
      carditem: {},
      centerDialogVisible: false,
      fullscreenLoading: false,
      type: '0' // 这是判断是不是中介用户登陆进来的,0 是根据账户查找卡片 1是根据中介查找全部卡片
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.type = this.$route.query.type
    this.fullscreenLoading = true
    this.list()
  },
  methods: {
    rewardShow () {
      this.centerDialogVisible = false
    },
    openselect(item) {
      console.log(item)
      this.carditem = item
      this.centerDialogVisible = true
    },
    list () {
      let vm = this
      if (vm.type !== '0' && vm.type !== '1') {
        vm.type = '0'
      }
      // 43域 0 是根据账户查找卡片 1是根据中介查找全部卡片   44域是账单日搜索
      let parmas = {
        '0': '0700',
        '3': '190932',
        '42': vm.merchantNo,
        '43': vm.type,
        '44': vm.input,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            vm.cardList = JSON.parse(res.data[57])
          }
        })
        .catch(err => {
          vm.fullscreenLoading = false
          console.log(err)
        })
    },
    selectchange () {
      let vm = this
      vm.list()
    },
    space () {
      let vm = this
      clearTimeout(vm.clearsettimeout)
      if (vm.input === '') {
        vm.clearsettimeout = setTimeout(() => {
          vm.fullscreenLoading = true
          vm.list()
        }, 1000)
      }
    },
    toNext (aisle,type) {
      let vm = this
      this.centerDialogVisible = false
      if (vm.carditem.plancount <= 0) {
        this.$router.push({ name: 'aisle', query: { item: JSON.stringify(vm.carditem), aisle: aisle, merchantNo: vm.carditem.MERCHANT_NO, merchantId: vm.merchantId,plantype: type,jshk: (type == 'js' ? true : false) } })
      } else {
        vm.$message({
          type: 'warning',
          message: '有正在执行中的计划!',
          center: true,
          offset: 30,
          duration: 2500
        })
      }
    },
    de (card, merchantNo) {
      let vm = this
      this.$confirm('是否删除信用卡？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let parmas = {
          '0': '0700',
          '3': '190520',
          '8': card,
          '42': merchantNo,
          '59': vm.version
        }
        let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
        vm.$http.get(`request.app${url}`)
          .then(res => {
            if (res.data[39] === '00') {
              vm.$message({
                type: 'success',
                message: '删除成功!',
                center: true,
                offset: 30,
                duration: 2500
              })
              vm.list()
            } else {
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
      }).catch(() => {
      })
    }
  }
}
</script>
