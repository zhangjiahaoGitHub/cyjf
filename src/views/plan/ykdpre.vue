<template>
  <div class='hundred'>
    <div style='height:1px'></div>
    <div v-for='(item, index) in planItem' :key='index'>
      <div class='bankgroud noPadding'>
        <div class='allFlex planBack'>
          <div>
            <img :src="banks[item.bankCode]?require(`../../assets/bank/white/${banks[item.bankCode]}.png`):require('../../assets/bank/white/yl.png')" class='bankLogo' />
            <span class='bankRight fourFont'>
                {{item.bankAccountName}}
            </span>
          </div>
          <div class='textRight'>
            <div>
                <span class='repayPadding garyChoose whiteColor repayFont'>尾号{{item.bankAccount.substring(item.bankAccount.length-4, item.bankAccount.length)}}</span>
            </div>
          </div>
        </div>
        <div class='allFlex choose border planBackx'>
          <div class='garyChoose smallFont half textCenter'>
            <p class='whiteColor'>{{item.billDay}}</p>
            <p>账单日</p>
          </div>
          <div class='garyChoose smallFont half textCenter leftRight'>
            <p class='whiteColor'>{{item.repaymentDay}}</p>
            <p>还款日</p>
          </div>
          <div class='garyChoose smallFont half textCenter'>
            <p class='whiteColor'>{{item.limitMoney}}</p>
            <p>额度</p>
          </div>
        </div>
      </div>
      <div class='planContent exhaustiveContent'>
          <div class='allFlex justifyBetween borderBottom' v-if='index == 0'>
              <div>
                <p class='fontWeight kdhMar'>{{setAll[13]}}</p>
                <p class='gary'>还款总额</p>
              </div>
              <div class='textRight gary'>
                <p>卡内预留金：<span class='kdhmw'>{{setAll[11]}}元</span></p>
                <p>手续费小计：<span class='kdhmw'>{{Math.floor(Number(setAll[9])*100+Number(setAll[7])*100)/100}}元</span></p>
                <p>还款时间：{{$moment(setAll[14]).format('YYYY-MM-DD')}}至{{$moment(setAll[15]).format('YYYY-MM-DD')}}</p>
              </div>
          </div>
          <div v-if="contentIndex.indexOf(index+1) !=-1">
            <ul class='partHeight' :class="item.type === 'sale' ? '' : 'partMin'" v-for='(row, roi) in item.planItemList' :key='roi'>
                <li class='allFlex justifyBetween flexPadding'>
                    <div>
                        <span class='partWidth'><a class='partStatus' :class="row.type === 'sale' ? '' : row.type==='payment' ? 'partBlue' :'partRed'">{{yk[row.type]}}</a></span>
                        <span class='partFont'>日期：{{row.time}}</span>
                    </div>
                    <div>
                        <span class='partFont'>{{row.money}}</span>
                    </div>
                </li>
                <li class='allFlex  flexPadding'  v-if="row.type === 'sale'">
                    <div class='half'>
                        <span class='gary'>
                            地址：{{row.cityName}}
                        </span>
                    </div>
                    <div class='half'>
                        <span class='gary'>
                            商铺：{{row.industryName}}
                        </span>
                    </div>
                </li>
            </ul>
          </div>
          <div class='paddUnfold' @click="getShow(index+1)"><i class='topUnfold' :class="contentIndex.indexOf(index+1) !=-1 ? 'el-icon-top' : 'el-icon-bottom'"></i>{{contentIndex.indexOf(index+1) != -1 ? '收回详情' : '展开详情'}}</div>
      </div>
    </div>
    <div class='loginTo makeTo'>
        <div class='blue' @click="next()"  element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
          提交计划
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
      contentIndex: [],
      status: {
        '10A': '未执行',
        '10B': '执行中',
        '10C': '暂停',
        '10D': '失败',
        '10E': '完成'
      },
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
      usermeichantNo: '',
      fullscreenLoading: false,
      planItem: [],
      setAll: {}
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.planItem = this.$stact.state.planItem
    this.setAll = this.$stact.state.allSb
    console.log(this.planItem)
  },
  methods: {
    getShow (i) {
      this.contentIndex.indexOf(i) === -1 ? this.contentIndex.push(i) : this.contentIndex = this.contentIndex.filter((x) => {
        return x !== i
      })
      console.log(this.contentIndex)
    },
    next () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '190210',
        '8': vm.setAll[13],
        '9': Math.floor(Number(vm.setAll[9]) * 100 + Number(vm.setAll[7]) * 100 + Number(vm.setAll[11]) * 100) / 100,
        '10': vm.$moment(vm.setAll[14]).format('YYYY-MM-DD'),
        '11': vm.$moment(vm.setAll[15]).format('YYYY-MM-DD'),
        '12': vm.setAll[9],
        '13': vm.setAll[7],
        '14': '1',
        '16': '2',
        '23': '1',
        '42': vm.merchantNo,
        '43': vm.$route.query.acqcode,
        '57': JSON.stringify(vm.planItem),
        '59': vm.version
      }
      let url = vm.$mdata.mdGet(parmas)
      vm.fullscreenLoading = true
      vm.$http.post('request.app', url)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            vm.$message({
              message: '提交成功',
              center: true,
              offset: 30,
              duration: 2500,
              type: 'success'
            })
            vm.$router.push({ name: 'repayment' })
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
          vm.fullscreenLoading = false
          console.log(err)
        })
    }
  }
}
</script>
