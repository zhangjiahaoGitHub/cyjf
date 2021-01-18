<template>
  <div class='hundred'>
    <div style='height:1px'></div>
    <div>
        <div class='bankgroud noPadding'>
            <div class='allFlex planBack'>
                <div>
                    <img :src="banks[cardList.BANK_NAME]?require(`../../assets/bank/white/${banks[cardList.BANK_NAME]}.png`):require('../../assets/bank/white/yl.png')" class='bankLogo' />
                    <span class='bankRight fourFont'>
                        {{cardList.short_cn_name}}
                    </span>
                </div>
                <div class='textRight'>
                    <div>
                      <span class='repayPadding garyChoose whiteColor repayFont'>尾号{{cardList.BANK_ACCOUNT.substring(cardList.BANK_ACCOUNT.length-4, cardList.BANK_ACCOUNT.length)}}</span>
                    </div>
                </div>
            </div>
            <div class='allFlex choose border planBackx'>
                <div class='garyChoose smallFont half textCenter'>
                    <p class='whiteColor'>{{cardList.BILL_DAY}}</p>
                    <p>账单日</p>
                </div>
                <div class='garyChoose smallFont half textCenter leftRight'>
                    <p class='whiteColor'>{{cardList.REPAYMENT_DAY}}</p>
                    <p>还款日</p>
                </div>
                <div class='garyChoose smallFont half textCenter'>
                    <p class='whiteColor'>{{cardList.LIMIT_MONEY}}</p>
                    <p>额度</p>
                </div>
            </div>
            <div class='leftRaduis'></div>
            <div class='rightRaduis'></div>
        </div>
        <div class='planContent'>
          <div class='loginInput regInput border noMargin' style='width: 100%'>
            <input type="text" placeholder='请输入金额' v-model='money' @input='IsMoney(money, 1)'/>
          </div>
          <div class='gary makePadding'>
            注：还款金额不能低于500,不能超过{{tong !== 'QYK' ? '200000': '100000'}}
          </div>
          <div class='loginInput regInput border' style='width: 100%' v-if='lazyPeople'>
            <input type="text" placeholder='请输入预留金额' v-model='lostMoney' @input='IsMoney(lostMoney, 2)'/>
          </div>
          <el-date-picker
            type="dates"
            v-model="dates"
            value-format='yyyy-MM-dd'
            :picker-options="pickerOptions"
            class="dateInput"
            placeholder="请选择日期">
          </el-date-picker>
          <div class='gary makePadding'>
            注：计划还款周期不能超过25日
          </div>
          <el-select class='selectEle makeSelect' v-if='!lazyPeople'  v-model="value" placeholder="请选择每天笔数">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
          <div class='gary makePadding' v-if="!(tong == 'QYK' || lazyPeople)">
            注：想要减少或增加周转金，请相应调整还款天数或每日还款笔数或还款总额
          </div>
          <el-select class='selectEle makeSelect' v-if="!(tong == 'QYK' || lazyPeople)" v-model="valuex" placeholder="请选择还款方式">
            <el-option
                v-for="item in optionx"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
          <div>
            <div class="block allFlex">
            <div class='makeWidth'>请选择商户： </div>
            <el-cascader class='makeMax'
              v-loading='loading'
              separator=" - "
              v-model="children"
              :options="cityList"
              @expand-change="handleChange">
            </el-cascader>
            </div>
          </div>
          <div class='loginTo makeTo'>
            <div class='blue' @click="tong != 'QYK'?calculation():calcSmall()">
              {{ tong!='QYK' ? '计算周转金':'计算手续费'}}
            </div>
          </div>
          <ul v-if='showCalc'>
            <li  v-if="tong != 'QYK'" class='allFlex justifyBetween flexPadding'>
              <div class='gary'>还款天数</div>
              <div>{{calcList[13]}}天</div>
            </li>
            <li  v-if="tong != 'QYK'" class='allFlex justifyBetween flexPadding'>
              <div class='gary'>周转金</div>
              <div>{{calcList[40]}}</div>
            </li>
            <li class='allFlex justifyBetween flexPadding'>
              <div class='gary'>还款手续费</div>
              <div>{{calcList[9]}}</div>
            </li>
            <li class='allFlex justifyBetween flexPadding borderMake'>
              <div class='gary'>还款笔数费</div>
              <div>{{calcList[7]}}</div>
            </li>
            <li class='allFlex justifyBetween flexPadding'>
              <div class='gary'>{{tong != 'QYK' ? '周转金总额' : '手续费总额'}}</div>
              <div>{{tong != 'QYK' ? Math.floor(Number(calcList[40])*100+Number(calcList[9])*100+Number(calcList[7])*100)/100 : Math.floor(Number(calcList[9])*100+Number(calcList[7])*100)/100 }}</div>
            </li>
          </ul>
          <div class='gary makePadding' v-if='!showCalc'>
            注: 点击计算周转金
          </div>
          <div class='loginTo makeTo'>
            <div class='blue' :class="refer||'garyMake'" @click="refer?sumbitRefer():''" element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
              下一步
            </div>
          </div>
      </div>
    </div>
    <div class='timeBack'  v-show='show'>
      <div @click='showTime(0)' class='stopBack'></div>
        <el-calendar v-model="timeValue" class='timeDack'>
            <template
            slot="dateCell"
            slot-scope="{date, data}">
              <p :class="data.isSelected ? 'is-selected' : ''" @click='getTime()'>
                  {{ data.day.split('-').slice(2).join('-') }}
              </p>
            </template>
        </el-calendar>
    </div>
    <el-dialog
      :visible.sync="centerDialogVisible"
      width="80%"
      :show-close='false'
      class='popup'
      center>
      <div>
        <div class='popupTitle'>升级提示</div>
        <div class='popupContent'>升级后，手续费将减少{{calcList[44]}}元,一年将剩下{{calcList[45]}}元，是否前往升级</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="next(1)">下一步</el-button>
        <el-button type="primary" @click="next(2)">前往升级</el-button>
      </span>
    </el-dialog>
    <div class='bottomLong'></div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      version: '',
      agentNo: '',
      merchantNo: '',
      usermerchantNo: '',
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
      money: '',
      lostMoney: '',
      timeValue: new Date(),
      timeTwo: new Date(),
      searchTime: '点击选择年月日',
      endTime: '点击选择年月日',
      show: 0,
      showCalc: 0,
      value: '',
      options: [],
      valuex: '',
      optionx: [{
        value: '1',
        label: '一消一还'
      }
      //, {
      //   value: '2',
      //   label: '两消一还'
      // }
      ],
      children: [],
      cityList: [],
      calcList: [],
      dateList: [],
      fullscreenLoading: false,
      future: '',
      centerDialogVisible: false,
      refer: 0,
      planItem: [],
      tradeList: [],
      changeNum: 0,
      planTure: 1,
      tong: '',
      addout: 0,
      newem: 0,
      lazyPeople: false,
      loading: false,
      multi: false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        }
      },
      dates: [],
      checkList: '',
      textAlise: ''
    }
  },
  watch: {
    '$route' (to, from) {
      this.tong = this.$route.query.tong
      if (this.$route.query.item) {
        this.cardList = JSON.parse(this.$route.query.item)
      }
      this.lazyPeople = this.$route.query.lazyPeople
      this.checkList = this.$route.query.checkList
      this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
      this.usermerchantNo = ''
      this.usermerchantNo = this.$route.query.merchantNo
      this.multi = this.$route.query.multi
      this.tong !== 'QYK' ? this.options = [{ value: '1', label: '每日还款1笔' }, { value: '2', label: '每日还款2笔' }, { value: '3', label: '每日还款3笔' }] : this.options = [{ value: '1', label: '每日还款1笔' }, { value: '2', label: '每日还款2笔' }, { value: '3', label: '每日还款3笔' }, { value: '4', label: '每日还款4笔' }, { value: '5', label: '每日还款5笔' }]
      if (this.usermerchantNo) {
        this.merchantNo = this.usermerchantNo
      }
      if (this.tong === 'QYK') {
        this.newem = this.$stact.state.newem
      } else {
        this.newem = 0
      }
      this.planTure = 1
      this.city(0)
      if (from.name === 'make') {
      } else if (from.name === 'preview' || from.name === 'submit') {} else {
        if (Number(this.$route.query.keep) !== 1) {
          this.money = ''
          // this.searchTime = '点击选择年月日'
          // this.endTime = '点击选择年月日'
          this.dates = []
          this.value = ''
          this.valuex = ''
          this.children = []
          this.showCalc = 0
          this.refer = 0
          this.lostMoney = ''
        }
      }
    },
    money (n, o) {
      if (Number(this.$route.query.keep) === 1) { // 重新计算周转金 changeNum和 refer 重复了 但我就不改 任性
        this.changeNum = 1
      }
      this.refer = 0
    },
    lostMoney (n, o) {
      if (Number(this.$route.query.keep) === 1) { // 重新计算周转金 changeNum和 refer 重复了 但我就不改 任性
        this.changeNum = 1
      }
      this.refer = 0
    },
    dates (n, o) {
      if (Number(this.$route.query.keep) === 1) {
        this.changeNum = 1
      }
      this.refer = 0
    },
    value (n, o) {
      if (Number(this.$route.query.keep) === 1) {
        this.changeNum = 1
      }
      this.refer = 0
    },
    valuex (n, o) {
      if (Number(this.$route.query.keep) === 1) {
        this.changeNum = 1
      }
      this.refer = 0
    },
    children (n, o) {
      if (Number(this.$route.query.keep) === 1) {
        this.changeNum = 1
      }
      this.refer = 0
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.cardList = JSON.parse(this.$route.query.item)
    this.usermerchantNo = this.$route.query.merchantNo
    this.lazyPeople = this.$route.query.lazyPeople
    this.multi = this.$route.query.multi
    this.checkList = this.$route.query.checkList
    if (this.usermerchantNo) {
      this.merchantNo = this.usermerchantNo
    }
    this.tong = this.$route.query.tong
    this.tong !== 'QYK' ? this.options = [{ value: '1', label: '每日还款1笔' }, { value: '2', label: '每日还款2笔' }, { value: '3', label: '每日还款3笔' }] : this.options = [{ value: '1', label: '每日还款1笔' }, { value: '2', label: '每日还款2笔' }, { value: '3', label: '每日还款3笔' }, { value: '4', label: '每日还款4笔' }, { value: '5', label: '每日还款5笔' }]
    if (this.tong === 'QYK') {
      this.newem = this.$stact.state.newem
    } else {
      this.newem = 0
    }
    this.city(0)
  },
  mounted () {
    this.$inputLen.inputJs()
  },
  methods: {
    IsMoney (money, type) { // 限制
      let vm = this
      let value = money
      value = value.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
      value = value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
      value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      value = value.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
      if (value.indexOf('.') < 0 && value !== '') { // 以上已经过滤,此处控制的是如果没有小数点,首位不能为类似于 01、02的金额
        value = parseFloat(value)
      }
      switch (type) {
        case 1:
          vm.money = value.toString()
          break
        case 2:
          vm.lostMoney = value.toString()
          break
      }
    },
    showTime (type) {
      this.show = type
      this.type = type
    },
    getTime () {
      let vm = this
      vm.show = 0
    },
    city (type) {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '490004',
        '41': type,
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.loading = false
          if (res.data[39] === '00') {
            if (type === 0) {
              JSON.parse(res.data[38]).map((x, i) => {
                vm.cityList.push({
                  value: x.id,
                  label: x.divisionName,
                  children: []
                })
              })
            } else {
              vm.cityList.map((c, z) => {
                if (c.value === type) {
                  c.children = []
                  JSON.parse(res.data[38]).map((y, w) => {
                    c.children.push({
                      value: y.id,
                      label: y.divisionName
                    })
                  })
                }
              })
            }
          }
        })
        .catch(err => {
          vm.loading = false
          console.log(err)
        })
    },
    merchantList (type) {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '490006',
        '30': vm.cardList.bankId,
        '31': vm.children[0],
        '32': type,
        '33': vm.$route.query.acqcode,
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.tradeList = JSON.parse(res.data[38])
            vm.addout = 0
            vm.bSort(vm.dates)
          } else {
            vm.addout = 1
            vm.$message({
              message: '该地区暂无商户，请重新选择',
              center: true,
              offset: 30,
              duration: 2500,
              type: 'warning'
            })
            vm.refer = 0
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    bSort (arr) {
      let vm = this
      let len = arr.length
      for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
          console.log(Date.parse(arr[j].replace(/-/g, '/')))
          console.log(Date.parse(arr[j + 1].replace(/-/g, '/')))
          if (Date.parse(arr[j].replace(/-/g, '/')) > Date.parse(arr[j + 1].replace(/-/g, '/'))) {
            let temp = arr[j]
            arr[j] = arr[j + 1]
            arr[j + 1] = temp
          }
        }
      }
      vm.dateList = arr
      vm.searchTime = vm.dateList[0]
      vm.endTime = vm.dateList[arr.length - 1]
      if (vm.tong === 'QYK') {
        vm.calcoffSmall()
      } else {
        vm.calcoff()
      }
    },
    // async todo (begin, end) { // 日期范围之内
    //   let vm = this
    //   var arr = []
    //   var ab = begin.split('-')
    //   var ae = end.split('-')
    //   var db = new Date()
    //   db.setUTCFullYear(ab[0], ab[1] - 1, ab[2])
    //   var de = new Date()
    //   de.setUTCFullYear(ae[0], ae[1] - 1, ae[2])
    //   var unixDb = db.getTime() - 24 * 60 * 60 * 1000
    //   var unixDe = de.getTime() - 24 * 60 * 60 * 1000
    //   for (var k = unixDb; k <= unixDe;) {
    //     k = k + 24 * 60 * 60 * 1000
    //     arr.push(vm.$moment(new Date(parseInt(k))).format('YYYY-MM-DD'))
    //   }
    //   vm.dateList = arr
    //   if (vm.tong === 'QYK') {
    //     vm.calcoffSmall()
    //   } else {
    //     vm.calcoff()
    //   }
    // },
    calcoff () {
      let vm = this
      vm.fullscreenLoading = true
      if (vm.usermerchantNo) {
        vm.merchantNo = vm.usermerchantNo
      }
      let parmas = {
        '0': '0700',
        '3': '193000',
        '7': vm.lazyPeople ? '' : vm.value,
        '8': vm.money,
        '9': vm.lazyPeople ? 0 : vm.valuex,
        '10': vm.dateList.toString(),
        '11': vm.cardList.BANK_ACCOUNT,
        '12': vm.cardList.bankId,
        '13': vm.multi ? 3 : vm.lazyPeople ? 4 : '',
        '23': vm.lostMoney,
        '35': vm.multi ? vm.children[1] : '',
        '36': vm.multi ? vm.children[0] : '',
        '42': vm.merchantNo,
        '43': vm.multi ? vm.checkList : vm.$route.query.acqcode,
        '44': vm.multi ? '10B' : '',
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            vm.showCalc = 1
            vm.refer = 1
            vm.planTure = 1
            vm.calcList = res.data
            vm.planItem = JSON.parse(vm.calcList[57])
            vm.textAlise = vm.calcList[25]
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
    },
    calcoffSmall () {
      let vm = this
      vm.fullscreenLoading = true
      if (vm.usermerchantNo) {
        vm.merchantNo = vm.usermerchantNo
      }
      let parmas = {
        '0': '0700',
        '3': '390048',
        '7': vm.value,
        '8': vm.money,
        '10': vm.dateList.toString(),
        '11': vm.cardList.BANK_ACCOUNT,
        '12': vm.cardList.bankId,
        '42': vm.merchantNo,
        '43': vm.$route.query.acqcode,
        '44': vm.$stact.state.newem ? vm.$stact.state.newem : '',
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.fullscreenLoading = true
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            vm.showCalc = 1
            vm.refer = 1
            vm.planTure = 1
            vm.calcList = res.data
            vm.planItem = JSON.parse(vm.calcList[57])
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
    },
    async calculation () {
      let vm = this
      if (vm.money.match(/^[ ]*$/)) {
        vm.$message({
          message: '金额必须填写',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (!(Number(vm.money) <= 200000 && Number(vm.money) >= 500)) {
        vm.$message({
          message: '还款金额不能低于500,不能超过200000',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.lostMoney.match(/^[ ]*$/) && vm.lazyPeople) {
        vm.$message({
          message: '预留金额必须填写',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.dates.length < 1) {
        vm.$message({
          message: '必须选择日期',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.dates.length > 25) {
        vm.$message({
          message: '还款天数不能超过25天',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.value.match(/^[ ]*$/) && !vm.lazyPeople) {
        vm.$message({
          message: '必须选择每天笔数',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.valuex.match(/^[ ]*$/) && !vm.lazyPeople) {
        vm.$message({
          message: '必须选择还款方式',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.children.length === 0) {
        vm.$message({
          message: '必须选择商户地区',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      vm.changeNum = 0
      vm.multi ? await vm.bSort(vm.dates) : vm.merchantList(vm.children[1])
    },
    async sumbitRefer () {
      let vm = this
      if (vm.changeNum === 1 && Number(vm.$route.query.keep) === 1) {
        vm.$message({
          message: '请重新计算周转金',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.planTure === 1) {
        vm.planItem.map((x, i) => {
          if (x.bindID) {
            x.time = Date.parse(x.time.replace(/-/g, '/'))
            if (!vm.multi) {
              x.toCard = x.cardNo
              x.toBindId = x.bindID
              x.toMoney = x.money
              x.customizecity = x.bindID
              x.payFee = null
              x.cityindustry = vm.tradeList[0].acqMerchantNo
              x.cityindustryName = vm.tradeList[0].acqMerchantName
            }
            x.customizecity = document.querySelector('.makeMax .el-input__inner').value.replace(/\s*/g, '')
            if (i === vm.planItem.length - 1) {
              vm.planItem = JSON.parse(JSON.stringify(vm.planItem).replace(/time/g, 'planTime').replace(/bindID/g, 'fromBindId').replace(/money/g, 'fromMoney').replace(/cardNo/g, 'fromCard'))
              vm.planTure = 2
              vm.$stact.commit('SET_PLAN', vm.planItem)
              vm.$stact.commit('SET_SB', { calcList: vm.calcList, children: vm.children, cardList: vm.cardList, value: vm.value, valuex: vm.valuex, acqcode: vm.$route.query.acqcode, rate: vm.$route.query.rate, planItem: vm.planItem, searchTime: vm.searchTime, endTime: vm.endTime, money: vm.money, area: document.querySelector('.makeMax .el-input__inner').value.replace(/\s*/g, ''), tong: vm.tong, merchantNo: vm.usermerchantNo, textAlise: vm.textAlise, checkList: vm.checkList })
              vm.$router.push({ name: 'submit', query: { children: vm.children, value: vm.value, valuex: vm.valuex, acqcode: vm.$route.query.acqcode, rate: vm.$route.query.rate, searchTime: vm.searchTime, endTime: vm.endTime, money: vm.money, area: document.querySelector('.makeMax .el-input__inner').value.replace(/\s*/g, ''), tong: vm.tong, merchantNo: vm.usermerchantNo, lazyPeople: vm.lazyPeople, multi: vm.multi } }).catch(err => { console.log(err) })
            }
          } else {
            vm.planTure = 2
            vm.$stact.commit('SET_PLAN', vm.planItem)
            vm.$stact.commit('SET_SB', { calcList: vm.calcList, children: vm.children, cardList: vm.cardList, value: vm.value, valuex: vm.valuex, acqcode: vm.$route.query.acqcode, rate: vm.$route.query.rate, planItem: vm.planItem, searchTime: vm.searchTime, endTime: vm.endTime, money: vm.money, area: document.querySelector('.makeMax .el-input__inner').value.replace(/\s*/g, ''), tong: vm.tong, merchantNo: vm.usermerchantNo, textAlise: vm.textAlise, checkList: vm.checkList })
            vm.$router.push({ name: 'submit', query: { children: vm.children, value: vm.value, valuex: vm.valuex, acqcode: vm.$route.query.acqcode, rate: vm.$route.query.rate, searchTime: vm.searchTime, endTime: vm.endTime, money: vm.money, area: document.querySelector('.makeMax .el-input__inner').value.replace(/\s*/g, ''), tong: vm.tong, merchantNo: vm.usermerchantNo, lazyPeople: vm.lazyPeople, multi: vm.multi } }).catch(err => { console.log(err) })
          }
        })
      }
      vm.centerDialogVisible = false
    },
    async calcSmall () {
      let vm = this
      if (vm.money.match(/^[ ]*$/)) {
        vm.$message({
          message: '金额必须填写',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (!(Number(vm.money) <= 100000 && Number(vm.money) >= 500)) {
        vm.$message({
          message: '还款金额不能低于500,不能超过100000',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.dates.length < 1) {
        vm.$message({
          message: '必须选择日期',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.dates.length > 25) {
        vm.$message({
          message: '还款天数不能超过25天',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.value.match(/^[ ]*$/)) {
        vm.$message({
          message: '必须选择每天笔数',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (vm.children.length === 0) {
        vm.$message({
          message: '必须选择商户地区',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      vm.changeNum = 0
      await vm.merchantList(vm.children[1])
    },
    handleChange (value, label) {
      if (document.querySelector('.el-cascader__dropdown')) {
        document.querySelector('.el-cascader__dropdown').style.display = 'block'
      }
      this.loading = true
      this.city(value[0])
    },
    next (type) {
      let vm = this
      vm.centerDialogVisible = false
      switch (type) {
        case 1:
          // vm.showCalc = 1
          // vm.refer = 1
          vm.$router.push({ name: 'submit', query: { calcList: JSON.stringify(vm.calcList), children: vm.children, cardList: JSON.stringify(vm.cardList), value: vm.value, valuex: vm.valuex, acqcode: vm.$route.query.acqcode, rate: vm.$route.query.rate, planItem: JSON.stringify(vm.planItem), searchTime: vm.searchTime, endTime: vm.endTime, money: vm.money, area: document.querySelector('.makeMax .el-input__inner').value.replace(/\s*/g, ''), merchantNo: vm.usermerchantNo } })
          break
        case 2:
          vm.$router.push({ name: 'upgrade' })
          break
      }
    }
  }
}
</script>
