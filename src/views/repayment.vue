<template>
  <div>
    <div style='height:1px'></div>
    <div>
        <div class='bankgroud' :class="index === now ?'': 'overflow'" @click='showOver(index)' v-for='(item, index) in cardList' :key='index'>
            <div class='allFlex'>
                <div class='half'>
                    <img :src="banks[item.BANK_NAME]?require(`../assets/bank/white/${banks[item.BANK_NAME]}.png`):require('../assets/bank/white/yl.png')" class='bankLogo' />
                    <span class='bankRight fourFont'>
                        {{item.short_cn_name}}
                    </span>
                </div>
                <div class='half textRight'>
                    <div>
                        <span class='garyChoose repayFont'>****</span>
                        <span class='repayPadding garyChoose whiteColor repayFont'>{{item.BANK_ACCOUNT.substring(item.BANK_ACCOUNT.length-4, item.BANK_ACCOUNT.length)}}</span>
                    </div>
                </div>
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
                <div @click.stop='darw(item)' class='garyChoose whiteColor smallFont'>
                    <img src='../assets/repay/setcard.png'  class='immediately'/>
                </div>
            </div>
            <div class='allFlex choose borderTop'>
                <router-link tag="div" :to="{name:'matter',query: { item: JSON.stringify(item), merchantNo: usermerchantNo, type: 'YK' } }" class='garyChoose smallFont whiteColor'>
                    <img src='../assets/repay/data.png' class='repayLogo'>
                    查看资料
                </router-link>
                <router-link tag="div" :to="{name:'exhaustive',query: { item: JSON.stringify(item), merchantNo: usermerchantNo} }" class='garyChoose smallFont whiteColor'>
                    <img src='../assets/repay/plan.png' class='repayLogo'>
                    查看计划
                </router-link>
                <div class='garyChoose smallFont whiteColor' @click.stop='de(item.BANK_ACCOUNT)'>
                    <img src='../assets/repay/lift.png' class='repayLogo'>
                    解绑卡片
                </div>
            </div>
        </div>
        <div class='repayMax'>
          <div @click='addCtrue()'>
            <img src='../assets/repay/addcard.png'/>
          </div>
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
          <div><el-button v-if="showLogo['10B']" type="primary" @click='toAisle(1)'>{{showLogo['10B']}}</el-button></div>
          <div><el-button v-if="showLogo['10P']" type="primary" @click='toAisle(3)'>{{showLogo['10P']}}</el-button></div>
          <div><el-button v-if="showLogo['10O']" type="primary" @click='toAisle(2)'>{{showLogo['10O']}}</el-button></div>
          <div><el-button v-if="showLogo['10Q']" type="primary" @click='toAisle(4)'>{{showLogo['10Q']}}</el-button></div>
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
      agentNo: '',
      merchantNo: '',
      cardList: [],
      showLogo: {},
      centerDialogVisible: false,
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
      freezeStatus: '',
      usermerchantNo: '',
      fullscreenLoading: false,
      type: '0' // 这是判断是不是中介用户登陆进来的,0 是根据账户查找卡片 1是根据中介查找全部卡片
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.usermerchantNo = this.$route.query.merchantNo
    this.type = this.$route.query.type
    this.message()
  },
  methods: {
    rewardShow () {
      this.centerDialogVisible = false
    },
    message () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '190112',
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.fullscreenLoading = true
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.$stact.dispatch('SetToken', res.data[57]) // 存token
            vm.showLogo = JSON.parse(res.data[15])
            vm.freezeStatus = JSON.parse(this.$stact.state.token)[0].freezeStatus
            vm.list()
          }
        })
        .catch(err => {
          vm.fullscreenLoading = false
          console.log(err)
        })
    },
    toAisle (type) {
      let vm = this
      if (vm.item.plancount <= 0) {
        switch (type) {
          case 1:
            this.$router.push({ name: 'aisle', query: { item: JSON.stringify(vm.item), aisle: 'YK', merchantNo: vm.usermerchantNo } })
            break
          case 2:
            vm.$router.push({ name: 'aisle', query: { item: JSON.stringify(vm.item), aisle: 'YK', ykdhFlag: true } })
            break
          case 3:
            vm.$router.push({ name: 'aisle', query: { item: JSON.stringify(vm.item), aisle: 'YK', merchantNo: vm.usermerchantNo, lazyPeople: true } })
            break
          case 4:
            vm.$router.push({ name: 'aisle', query: { item: JSON.stringify(vm.item), aisle: 'YK', merchantNo: vm.usermerchantNo, multi: true } })
            break
        }
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
    darw (item) {
      this.item = item
      this.centerDialogVisible = true
    },
    list () {
      let vm = this
      if (this.usermerchantNo) {
        vm.merchantNo = vm.usermerchantNo
      }
      if (vm.type !== '0' && vm.type !== '1') {
        vm.type = '0'
      }
      // 43域 0 是根据账户查找卡片 1是根据中介查找全部卡片   44域是账单日搜索
      let parmas = {
        '0': '0700',
        '3': '190932',
        '42': vm.merchantNo,
        '43': vm.type,
        '44': '',
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.fullscreenLoading = false
            vm.cardList = JSON.parse(res.data[57])
          }
        })
        .catch(err => {
          vm.fullscreenLoading = false
          console.log(err)
        })
    },
    showOver (i) {
      this.now === i ? this.now = -1 : this.now = i
    },
    addCtrue () {
      let vm = this
      if (vm.freezeStatus !== '10B') {
        vm.$confirm('尚未实名请先实名？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          vm.$router.push({ name: 'real' })
        }).catch(() => {
        })
        return
      }
      vm.$router.push({ name: 'addcard' })
    },
    de (card) {
      let vm = this
      if (this.usermerchantNo) {
        vm.merchantNo = vm.usermerchantNo
      }
      this.$confirm('是否删除信用卡？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let parmas = {
          '0': '0700',
          '3': '190520',
          '8': card,
          '42': vm.merchantNo,
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
