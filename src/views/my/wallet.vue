<template>
    <div class='hundred'>
        <div class='walletBlue'>
            <p class='teamPeople'>
                可提现金额
            </p>
            <p class='teamNum'>
                {{withdraw}}
            </p>
        </div>
        <router-link :to="{name: 'retreat'}" tag='div' class='myBorder myMargin littleMargin'>
            立即提现
        </router-link>
        <div class='pushNum teamMargin'>
            <div class='allFlex teamFlex'>
                <div class='half'>
                    今日收益 <img @click="show('T')" :src="Number(todaySwitch) ? require('../../assets/my/nolook.png') : require('../../assets/my/look.png')" class='look marginLeft'/>
                </div>
                <div class='half teamRight allFlex' @click='toNext(1)'>
                    <div class='blueColor fontWeight'>{{Number(todaySwitch)?'***':todayMoney}}</div> <img src='../../assets/right.png' class='teamNext marginLeft'/>
                </div>
            </div>
        </div>
        <div class='pushNum'>
            <div class='allFlex teamFlex'>
                <div class='half'>
                    当月收益 <img @click="show('M')" :src="Number(monthSwitch) ? require('../../assets/my/nolook.png') : require('../../assets/my/look.png')" class='look marginLeft'/>
                </div>
                <div class='half teamRight allFlex' @click='toNext(2)'>
                    <div class='blueColor fontWeight'>{{Number(monthSwitch)?'***':mouthMoney}}</div> <img src='../../assets/right.png' class='teamNext marginLeft'/>
                </div>
            </div>
        </div>
        <div class='pushNum'>
            <div class='allFlex teamFlex border'>
                <div class='half'>
                    累积收益 <img @click="show('L')" :src="Number(accumulativeSwitch) ? require('../../assets/my/nolook.png') : require('../../assets/my/look.png')" class='look marginLeft'/>
                </div>
                <div class='half teamRight allFlex' @click='toNext(3)'>
                    <div class='blueColor fontWeight'>{{Number(accumulativeSwitch)?'***':sunMoney}}</div> <img src='../../assets/right.png' class='teamNext marginLeft'/>
                </div>
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
      withdraw: 0,
      todaySwitch: 0,
      monthSwitch: 0,
      accumulativeSwitch: 0,
      todayMoney: 0,
      mouthMoney: 0,
      sunMoney: 0,
      isSwitch: 0,
      fullscreenLoading: false
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.message()
  },
  methods: {
    message () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '190112',
        '42': vm.merchantNo,
        '59': vm.version
      }
      vm.fullscreenLoading = true
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            vm.$stact.dispatch('SetToken', res.data[57]) // 存token
            console.log(JSON.parse(res.data[57]))
            vm.withdraw = res.data[6]
            vm.todayMoney = res.data[44]
            vm.mouthMoney = res.data[49]
            vm.sunMoney = res.data[46]
            vm.todaySwitch = JSON.parse(vm.$stact.state.token)[0].todaySwitch
            vm.monthSwitch = JSON.parse(vm.$stact.state.token)[0].monthSwitch
            vm.accumulativeSwitch = JSON.parse(vm.$stact.state.token)[0].accumulativeSwitch
          }
        })
        .catch(err => {
          vm.fullscreenLoading = false
          console.log(err)
        })
    },
    show (type) {
      let vm = this
      switch (type) {
        case 'T':
          Number(vm.todaySwitch) === 1 ? vm.todaySwitch = 0 : vm.todaySwitch = 1
          vm.isSwitch = vm.todaySwitch
          break
        case 'M':
          Number(vm.monthSwitch) === 1 ? vm.monthSwitch = 0 : vm.monthSwitch = 1
          vm.isSwitch = vm.monthSwitch
          break
        case 'L':
          Number(vm.accumulativeSwitch) === 1 ? vm.accumulativeSwitch = 0 : vm.accumulativeSwitch = 1
          vm.isSwitch = vm.accumulativeSwitch
          break
      }
      let parmas = {
        '0': '0700',
        '3': '790009',
        '42': vm.merchantNo,
        '43': type,
        '44': vm.isSwitch,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            console.log(res)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    toNext (type) {
      let vm = this
      switch (type) {
        case 1:
          vm.$router.push({ name: 'today', query: { type: type } })
          break
        case 2:
          vm.$router.push({ name: 'mouth', query: { type: type } })
          break
        case 3:
          vm.$router.push({ name: 'cumulative', query: { type: type } })
          break
      }
    }
  }
}
</script>
