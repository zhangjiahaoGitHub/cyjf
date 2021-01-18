<template>
  <div class='hundred'>
    <div style='height:1px'></div>
    <div class='planContent exhaustiveContent'>
        <ul>
            <li class='allFlex justifyBetween flexPadding'>
                <div>
                <span class='gary'>
                  还款银行：
                </span>
                {{cardList.short_cn_name}} {{cardList.BANK_ACCOUNT && cardList.BANK_ACCOUNT.substring(cardList.BANK_ACCOUNT.length-4, cardList.BANK_ACCOUNT.length)}}
                </div>
                <div>
                <span class='blueColor'>
                    进度：{{parseInt((itemList.payed/itemList.PLAN_AMT)*100)>100? 100 : parseInt((itemList.payed/itemList.PLAN_AMT)*100)}}%
                </span>
                </div>
            </li>
            <li class='allFlex justifyBetween flexPadding'>
                <div>
                  <span class='gary'>
                      订单编号：
                  </span>
                  <span>{{number}}</span>
                </div>
            </li>
            <li class='allFlex justifyBetween flexPadding'>
                <div>
                <span class='gary'>
                    还款周期：
                </span>
                    {{$moment(itemList.START_TIME.time).format('YYYY-MM-DD')}}至{{$moment(itemList.END_TIME.time).format('YYYY-MM-DD')}}
                </div>
            </li>
            <li class='allFlex flexPadding'>
                <div class='half' v-if="!(itemList.TYPE === '10C' || itemList.TYPE === '10F')">
                    <span class='gary'>
                        还款形式：
                    </span>
                    {{itemList.EVERY_NUM}}笔/日
                </div>
                <div class='half'>
                    <span class='gary'>
                        订单状态：
                    </span>
                    {{status[itemList.STATUS]}}
                </div>
            </li>
        </ul>
        <div class='widthExhaustive widthParticular'></div>
        <div class='allFlex choose particularTop'>
            <div class='garyChoose smallFont half textCenter rightBorder'>
                <p class='gary'>预还款金额</p>
                <p class='black'>{{itemList.PLAN_AMT}}</p>
            </div>
            <div class='garyChoose smallFont half textCenter'>
                <p class='gary'>{{itemList.TYPE === '10C' || itemList.TYPE === '10F' ? '手续费总额' : '周转金总额'}}</p>
                <p class='black'>{{itemList.TYPE === '10C' || itemList.TYPE === '10F' ? itemList.THAW_TRX : itemList.CB_AMT}}</p>
            </div>
        </div>
    </div>
    <div class='planContent exhaustiveContent'>
        <ul class='partHeight' :class="item.type === 'sale' ? '' : 'partMin'" v-for='item in listMore' :key='item.id'>
            <li class='allFlex justifyBetween flexPadding'>
                <div>
                    <span class='partWidth'><a class='partStatus' :class="item.type === 'sale' ? '' : item.type==='payment' ? 'partBlue' :'partRed'">{{itemList.TYPE === '10C' ? newQyk[item.type] : itemList.TYPE === '10F' ? oldQyk[item.type] : yk[item.type]}}</a></span>
                    <span class='partFont'>日期：{{itemList.TYPE === '10C' || itemList.TYPE === '10F' ? $moment(item.planTime.time).format('YYYY-MM-DD') : $moment(item.planTime.time).format('YYYY-MM-DD HH:mm')}}</span>
                </div>
                <div>
                    <span class='partFont'>{{item.money}}</span>
                    <span class='repleni redColor' v-if="item.status === '10C'">
                      <i class="el-icon-circle-close"></i>
                    </span>
                    <span class='repleni yellow' v-if="item.status === '10D'|| item.status === '10A'">
                      <i class="el-icon-time"></i>
                    </span>
                    <span class='repleni blueColor' v-if="item.status === '10B' || item.status === '10Y'">
                      <i class="el-icon-circle-check"></i>
                    </span>
                </div>
            </li>
            <li class='allFlex justifyBetween gary jptxfd' v-if="itemList.TYPE === '10A'">
                <div>{{item.bankName}} : {{item.fromIncreaseId}}</div>
            </li>
            <li class='allFlex  flexPadding'  v-if="!(itemList.TYPE === '10C' || itemList.TYPE === '10F') ? item.type === 'sale' : item.type === 'sale' || item.type === 'pay'">
                <div class='half'>
                    <span class='gary'>
                        地址：{{item.customizeCity}}
                    </span>
                </div>
                <div class='half'>
                    <span class='gary'>
                        商铺：{{item.cityIndustry}}
                    </span>
                </div>
            </li>
        </ul>
    </div>
    <div class='partSubmit'>
        <div class='allFlex justifyBetween planMargin' :style="itemList.TYPE === '10C' || itemList.TYPE === '10F' ? {'justify-content': 'center'} : ''">
            <div class='submitPlan' @click='stop()'>{{itemList.STATUS === '10C' ? '开启计划': '暂停计划'}}</div>
            <div class='submitPlan' v-if="!(itemList.TYPE === '10C' || itemList.TYPE === '10F')" @click='de(itemList.STATUS)'>删除</div>
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
      number: '',
      status: {
        '10A': '未执行',
        '10B': '执行中',
        '10C': '暂停',
        '10D': '失败',
        '10E': '完成'
      },
      yk: {
        'sale': '消费',
        'payment': '还款'
      },
      oldQyk: {
        'sale': '手续费',
        'pay': '消费',
        'payment': '还款'
      },
      newQyk: {
        'sale': '手续费',
        'payment': '还款',
        'pay': '消费'
      },
      itemList: [],
      listMore: [],
      usermeichantNo: '',
      fullscreenLoading: false
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    if (this.$route.query.cardList) {
      this.cardList = JSON.parse(this.$route.query.cardList)
    }
    if (this.$route.query.item) {
      this.itemList = JSON.parse(this.$route.query.item)
      console.log(this.itemList.TYPE)
    }
    this.usermeichantNo = this.$route.query.merchantNo
    this.list()
  },
  methods: {
    list () {
      let vm = this
      if (vm.usermeichantNo) {
        vm.merchantNo = vm.usermeichantNo
      }
      vm.fullscreenLoading = true
      let parmas = {
        '0': '0700',
        '3': '190213',
        '8': vm.itemList.ID,
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            this.listMore = JSON.parse(res.data[57])
            this.number = res.data[8]
          }
        })
        .catch(err => {
          vm.fullscreenLoading = false
          console.log(err)
        })
    },
    stop () {
      let vm = this
      if (vm.itemList.TYPE === '10C' || vm.itemList.TYPE === '10F') {
        if (vm.itemList.STATUS === '10C') {
          vm.$message({
            type: 'warning',
            message: '全额还计划暂停后不能开启',
            center: true,
            offset: 30,
            duration: 2500
          })
          return
        }
      }
      this.$confirm(`${vm.itemList.STATUS === '10C' ? '是否开启计划？' : '是否暂停计划？'}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let parmas = {
          '0': '0700',
          '3': '190214',
          '7': vm.itemList.STATUS === '10C' ? 1 : 2,
          '8': vm.itemList.ID,
          '9': vm.cardList.BANK_ACCOUNT,
          '42': vm.merchantNo,
          '59': vm.version
        }
        let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
        vm.$http.get(`request.app${url}`)
          .then(res => {
            if (res.data[39] === '00') {
              vm.$message({
                type: 'success',
                message: vm.itemList.STATUS === '10C' ? '开启成功' : '暂停成功',
                center: true,
                offset: 30,
                duration: 2500
              })
              vm.$router.go(-1)
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
    },
    de (type) {
      let vm = this
      if (type === '10A') {
        vm.$message({
          type: 'success',
          message: '计划未执行!',
          center: true,
          offset: 30,
          duration: 2500
        })
        return
      }
      if (type === '10B') {
        vm.$message({
          type: 'success',
          message: '计划执行中!',
          center: true,
          offset: 30,
          duration: 2500
        })
        return
      }

      vm.$confirm('是否删除计划？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let parmas = {
          '0': '0700',
          '3': '390002',
          '8': vm.itemList.ID,
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
              vm.$router.go(-1)
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
