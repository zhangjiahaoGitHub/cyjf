<template>
  <div>
    <div style='height:1px'></div>
    <div class="emptybond" @click="todeductionrecord">
      <div>个人空卡保证金</div>
      <div>剩余：1000元 <i class="el-icon-arrow-right"></i></div>
    </div>
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
                <div @click='toAisle(item)' class='garyChoose whiteColor smallFont'>
                    <img src='../assets/repay/setcard.png'  class='immediately'/>
                </div>
            </div>
            <div class='allFlex choose borderTop'>
                <router-link tag="div" :to="{name:'matter',query: { item: JSON.stringify(item), type: 'QYK'} }" class='garyChoose smallFont whiteColor'>
                    <img src='../assets/repay/data.png' class='repayLogo'>
                    查看资料
                </router-link>
                <router-link tag="div" :to="{name:'exhaustive',query: { item: JSON.stringify(item)} }" class='garyChoose smallFont whiteColor'>
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
          <router-link tag="div" :to="{ name:'addcard' }">
            <img src='../assets/repay/addcard.png'/>
          </router-link>
        </div>
    </div>
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
      fullscreenLoading: false
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.list()
    this.message()
  },
  methods: {
    todeductionrecord() {
      this.$router.push({name: 'deductionrecord'})
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
      vm.fullscreenLoading = true
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
    toAisle (item) {
      let vm = this
      if (item.plancount <= 0) {
        this.$router.push({ name: 'aisle', query: { item: JSON.stringify(item), aisle: 'QYK' } })
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
    message () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '190112',
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.$stact.dispatch('SetToken', res.data[57]) // 存token
            vm.$stact.dispatch('SetNewem', res.data[53]) // 存token
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    showOver (i) {
      this.now === i ? this.now = -1 : this.now = i
    },
    de (card) {
      let vm = this
      this.$confirm('是否删除信用卡？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let parmas = {
          '0': '0700', // 固定传惨
          '3': '190520', // 根据数字判断接口
          '8': card,
          '42': vm.merchantNo,
          '59': vm.version // 固定传惨
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
