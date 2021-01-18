<template>
  <div class="realname" element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
    <div class="checkplan">
      <el-tabs v-model="activeName" @tab-click="handleClick" :stretch="true" class="checkplan-bg">
          <!-- 进行中计划 -->
          <el-tab-pane :label="item.title" :name="item.name"  v-for='(item, index) in type' :key='index' class="infinite-list-wrapper" style="overflow:auto;height:82vh">
            <div class="flex-height" v-infinite-scroll="load" infinite-scroll-disabled="disabled" infinite-scroll-immediate="false">
              <div class="checklist" @click.stop="toparticular(item)" v-for="(item, i) in checkplanListdata" :key="i">
                <div class="checklist-top">
                  <div class="head-title">
                    <span>{{item.bank_name}}</span>
                    <span class="mar-left">尾号&nbsp;{{ item.BANK_ACCOUNT !== null ? (item.BANK_ACCOUNT.substring(item.BANK_ACCOUNT.length-4, item.BANK_ACCOUNT.length)) : '' }}</span>
                    <span class="mar-right">{{item.MERCHANT_CN_NAME}}</span>
                  </div>
                  <div class="center-title">
                    <div class='textCenter'>
                      <p>已消费金额</p>
                      <p>{{item.saled}}</p>
                    </div>
                    <div class='textCenter'>
                      <p>还款金额</p>
                      <p>{{item.payed}}</p>
                    </div>
                    <div class='textCenter'>
                      <p>还款笔数</p>
                      <p>{{parseInt(item.PAY_FREE / item.PRO)}}</p>
                    </div>
                    <div class='textCenter'>
                      <p>状态</p>
                      <p>{{status[item.STATUS]}}</p>
                   </div>
                  </div>
                  <div class="bottom-title">
                    <span>开始时间：{{item.START_TIME.time | formatDate}}</span>
                    <span>结束时间：{{item.END_TIME.time | formatDate}}</span>
                  </div>
                </div>
                <div class="checklist-bottom">
                  <div class="price-bottom">
                    <div class="price-t">本期账单</div>
                    <div class="price-c">{{item.PLAN_AMT}}</div>
                  </div>
                  <div class="price-bottom">
                    <div class="price-t">周转金总额</div>
                    <div class="price-c">{{item.CB_AMT}}</div>
                  </div>
                </div>
              </div>
              <p class="loading" v-if="loading">加载中...</p>
              <p class="loading" v-if="noMore">没有更多了</p>
            </div>
          </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      input: '',
      checkplanList: [], // 定义一个空数组接收计划数据列表vm.searchTime = vm.$moment(n).format('YYYY-MM-DD')
      plantype: '10A', // 初始值为进行中计划
      activeName: 'third',
      serviceprice: '', // 手续费 = 费率 + 手续费   SALE_FREE + PAY_FREE
      cardLista: '',
      usemerchantNo: '', // 获得对应用户的mechantNo
      yema: 0,
      yeshu: 10,
      checkplanListdata: [], // 这是上拉加载的数据
      loading: false,
      status: {
        '10A': '未执行',
        '10B': '执行中',
        '10C': '暂停',
        '10D': '失败',
        '10E': '完成'
      },
      type: [
        {
          'name': 'third',
          'title': '未执行计划'
        },
        {
          'name': 'first',
          'title': '进行中计划'
        },
        {
          'name': 'second',
          'title': '成功计划'
        },
        {
          'name': 'fourth',
          'title': '暂停计划'
        }
      ],
      setTime: '',
      fullscreenLoading: false
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    console.log(sessionStorage.getItem('plantype'))
    if (sessionStorage.getItem('plantype')) {
      this.plantype = sessionStorage.getItem('plantype')
      this.activeName = sessionStorage.getItem('activeName')
    }
    this.reallist()
  },
  beforeRouteLeave (to, from, next) {
    sessionStorage.setItem('plantype', this.plantype)
    sessionStorage.setItem('activeName', this.activeName)
    next()
  },
  computed: {
    noMore () {
      return this.checkplanList.length < this.yeshu
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  methods: {
    load () {
      this.loading = true
      this.fullscreenLoading = true
      this.setTime = setTimeout(() => {
        this.yema += 1
        this.reallist()
        this.loading = false
      }, 2000)
    },
    handleClick (tab, event) {
      let vm = this
      vm.yema = 0
      vm.yeshu = 10
      vm.input = ''
      vm.checkplanList = [] // 定义一个空数组接收计划数据列表vm.searchTime = vm.$moment(n).format('YYYY-MM-DD')
      vm.endtime = ''
      vm.serviceprice = '' // 手续费 = 费率 + 手续费   SALE_FREE + PAY_FREE
      vm.cardLista = ''
      vm.usemerchantNo = '' // 获得对应用户的mechantNo
      vm.yema = 0
      vm.yeshu = 10
      vm.checkplanListdata = [] // 这是上拉加载的数据
      vm.loading = false
      this.fullscreenLoading = true
      clearTimeout(this.setTime)
      if (tab.name === 'first') {
        vm.plantype = '10B' // 计划进行中
        this.reallist()
      } else if (tab.name === 'second') {
        vm.plantype = '10E' // 成功计划
        this.reallist()
      } else if (tab.name === 'third') {
        vm.plantype = '10A' // 未执行计划
        this.reallist()
      } else if (tab.name === 'fourth') {
        vm.plantype = '10C' // 暂停计划
        this.reallist()
      }
    },
    reallist () {
      let vm = this
      vm.isloading = 0
      vm.checkplanList = [] // 每次调用要清空上一次的列表，重新渲染
      let parmas = {
        '0': '0700',
        '3': '390014',
        '5': vm.yema,
        '6': vm.yeshu,
        '42': vm.merchantNo,
        '43': vm.plantype,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            // 57域是返回的数据
            vm.checkplanList = JSON.parse(res.data[57])
            for (var i in vm.checkplanList) {
              vm.checkplanListdata.push(vm.checkplanList[i])
            }
          }
        })
    },
    toparticular (itema) {
      let vm = this
      this.$router.push({ name: 'particular', query: { item: JSON.stringify(itema), cardList: JSON.stringify({ short_cn_name: itema.bank_name, BANK_ACCOUNT: itema.BANK_ACCOUNT }) } })
    }
  },
  filters: {
    formatDate: function (value) {
      let date = new Date(value)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d
    }
  }
}
</script>
