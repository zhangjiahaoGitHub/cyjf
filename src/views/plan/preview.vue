<template>
  <div class='hundred'>
    <div style='height:1px'></div>
    <div class='bankgroud noPadding'>
        <div class='planBack'>
            <div v-if='multi'>
              {{$stact.state.allSb.textAlise}}
            </div>
            <div>
                订单编号：{{number}}
            </div>
            <div class='prePadding'>
                还款周期：{{searchTime}}至{{endTime}}
            </div>
        </div>
        <div class='leftRaduis'></div>
        <div class='rightRaduis'></div>
    </div>
    <div class='allFlex planContent textCenter'>
        <div class='half borderRight'>
            <p class='gary'>预还款金额</P>
            <p>{{money}}</p>
        </div>
        <div class='half'>
            <p class='gary'>{{tong != 'QYK' ? '周转金总额' : '手续费总额'}}</P>
            <p>{{tong != 'QYK' ? zhou : shou}}</p>
        </div>
    </div>
    <div class='planContent exhaustiveContent'>
        <ul class='preHeight' v-for='(item, index) in planItem' :key="index">
            <li class='allFlex justifyBetween flexPadding'>
                <div>
                    <a class='partStatus' :class="item.type === 'sale' ? '' : item.type==='payment' ? 'partBlue' :'partRed'">{{tong === 'QYK' ? Number($stact.state.newem) === 1 ? oldQyk[item.type] : Number($stact.state.newem) === 2 ? newQyk[item.type] : '' : yk[item.type]}}</a>
                    <span class='partFont'>日期：{{tong === 'QYK' ? $moment(item.planTime).format('YYYY-MM-DD') : $moment(item.planTime).format('YYYY-MM-DD HH:mm')}}</span>
                </div>
                <div>
                    <span class='partFont'>{{item.fromMoney}}</span>
                </div>
            </li>
            <li class='allFlex justifyBetween flexPadding' v-if="tong != 'QYK' ? item.type === 'sale' : item.type === 'sale' || item.type === 'pay'">
                <div class='half'>
                <el-cascader
                    separator=" - "
                    class='indexDom'
                    :placeholder="item.customizecity"
                    :data-myindex='index'
                    v-model="cityList[index].value"
                    :options="cityList[index].city"
                    @change="chdie(index)"
                    @expand-change="handleChange">
                </el-cascader>
                <!--<span class='gary'>
                    {{item.customizecity}}
                </span> -->
                </div>
                <div class='half gary'>
                  <el-select class='companyDom' :data-myindex='index' @change='changeno(index)' v-model="company[index].value">
                    <div class="loading-box" v-loading='loading'>
                      <el-option
                        v-for="item in company[index].company"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </div>
                  </el-select>
                </div>
            </li>
        </ul>
    </div>
    <div class='loginTo makeTo'>
        <div class='blue' @click="tong != 'QYK'?next():nextSmall()"  element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
            提交计划
        </div>
    </div>
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
      number: '',
      money: 0,
      calcList: 0,
      fullscreenLoading: false,
      planItem: [],
      cityList: [],
      company: [],
      now: 0,
      cnow: -1,
      cardList: [],
      children: [],
      zhou: 0,
      usermerchantNo: '',
      first: 0,
      loading: true,
      multi: false,
      zjHk: false,
      yk: {
        'sale': '消费',
        'payment': '还款 '
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
      }
    }
  },
  watch: {
    cnow (n, o) {
      if (this.cnow !== -1) {
        this.merchantList(this.cnow)
      }
    }
  },
  created () {
    let vm = this
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.number = Date.parse(new Date())
    this.searchTime = this.$route.query.searchTime
    this.endTime = this.$route.query.endTime
    this.money = this.$route.query.money
    this.calcList = this.$stact.state.allSb.calcList
    this.zhou = Math.floor(Number(this.calcList[40]) * 100 + Number(this.calcList[9]) * 100 + Number(this.calcList[7]) * 100) / 100
    this.shou = Math.floor(Number(this.calcList[9]) * 100 + Number(this.calcList[7]) * 100) / 100
    this.planItem = this.$stact.state.planItem
    this.cardList = this.$stact.state.allSb.cardList
    this.children = this.$route.query.children
    this.tong = this.$route.query.tong
    this.multi = this.$route.query.multi
    this.usermerchantNo = this.$route.query.merchantNo
    if (this.usermerchantNo) {
      this.zjHk = true
    }
    new Promise((resolve, reject) => {
      this.planItem.map((x, i) => {
        this.cityList.push({
          value: '',
          city: []
        })
        this.company.push({
          value: '',
          company: []
        })
        if (this.planItem.length - 1 === i) {
          this.city(0)
          vm.first = 1
          if (!vm.multi) {
            vm.merchantList(0)
          } else {
            vm.planItem.map((y, z) => {
              vm.company[z].value = y.industryName
              vm.company[z].no = y.cityIndustry
            })
          }
          resolve()
        }
      })
    }).then(r => {
    })
      .catch(error => console.log(error))
  },
  mounted () {
    let vm = this
    let oDiv = document.querySelectorAll('.indexDom')
    for (let i = 0; i < oDiv.length; i++) {
      (function (i) {
        oDiv[i].onclick = function () {
          vm.now = oDiv[i].dataset.myindex
        }
      })(i)
    }
    let cDiv = document.querySelectorAll('.companyDom')
    for (let i = 0; i < cDiv.length; i++) {
      (function (i) {
        cDiv[i].onclick = function () {
          // document.querySelectorAll('.el-select-dropdown__empty')[8].style.display = 'none'
          let nodeArr = document.querySelectorAll('.el-select-dropdown__empty')
          for (let j = 0; j < nodeArr.length; j++) {
            document.querySelectorAll('.el-select-dropdown__empty')[j].style.display = 'none'
          }
          vm.cnow = cDiv[i].dataset.myindex
          console.log(vm.cnow)
        }
      })(i)
    }
  },
  methods: {
    handleChange (value) {
      this.cnow = -1
      this.city(value[0])
    },
    chdie (i) {
      this.cnow = -1
      this.company[i].value = ''
    },
    changeno (i) {
      console.log(this.company[i])
      this.company[i].no = this.company[i].value
    },
    merchantList (type) {
      let vm = this
      vm.loading = true
      if (vm.usermerchantNo) {
        vm.merchantNo = vm.usermerchantNo
      }
      console.log(vm.planItem[type])
      let parmas = {
        '0': '0700',
        '3': '490006',
        '30': vm.cardList.bankId,
        '31': vm.cityList[type].value[0] ? vm.cityList[type].value[0] : this.children[0],
        '32': vm.cityList[type].value[1] ? vm.cityList[type].value[1] : this.children[1],
        '33': vm.multi ? vm.planItem[type].acqCode : vm.$route.query.acqcode,
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.company[type].company = []
            JSON.parse(res.data[38]).map((x, i) => {
              vm.company[type].company.push({
                value: x.acqMerchantNo,
                label: x.acqMerchantName
              })
              if (JSON.parse(res.data[38]).length - 1 === i && vm.first === 1 && !vm.multi) {
                let cityCray = {}
                vm.planItem.map((y, z) => {
                  cityCray = JSON.parse(res.data[38])[Math.floor(Math.random() * JSON.parse(res.data[38]).length)]
                  vm.company[z].value = cityCray.acqMerchantName
                  vm.company[z].no = cityCray.acqMerchantNo
                })
                vm.first = 0
              }
            })
            vm.loading = false
            console.log(vm.company[type].company)
          } else {
            vm.company[vm.cnow].company = []
            vm.loading = false
          }
        })
        .catch(err => {
          vm.loading = false
          console.log(err)
        })
    },
    next () {
      let vm = this
      let have = false
      document.querySelectorAll('.indexDom').forEach(function (item, index) {
        if (document.querySelectorAll('.indexDom .el-input__inner')[index].value) {
          vm.planItem[item.dataset.myindex].customizecity = document.querySelectorAll('.indexDom .el-input__inner')[index].value.replace(/\s*/g, '')
        }
        if (document.querySelectorAll('.companyDom .el-input__inner')[index].value) {
          vm.planItem[item.dataset.myindex].cityindustryName = document.querySelectorAll('.companyDom .el-input__inner')[index].value
          vm.planItem[item.dataset.myindex].cityindustry = vm.company[index].no
        } else {
          have = true
        }
      })
      if (have) {
        vm.$message({
          message: '请选择商户',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'success'
        })
        return
      }
      if (vm.usermerchantNo) {
        vm.merchantNo = vm.usermerchantNo
      }
      let parmas = {
        '0': '0700',
        '3': '190210',
        '8': vm.money,
        '9': vm.zhou,
        '10': Date.parse(vm.searchTime.replace(/-/g, '/')),
        '11': Date.parse(vm.endTime.replace(/-/g, '/')),
        '12': vm.calcList[9],
        '13': vm.calcList[7],
        '14': vm.$route.query.value ? vm.$route.query.value : '2',
        '16': '2',
        '23': vm.multi ? '3' : '2',
        '42': vm.merchantNo,
        '43': vm.multi ? this.$stact.state.allSb.checkList : vm.$route.query.acqcode,
        '57': JSON.stringify(vm.planItem),
        '59': vm.version
      }
      if (this.zjHk) {
        parmas['46'] = this.$route.query.rate
      }
      let url = vm.$mdata.mdGet(parmas)
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
            if (this.usermerchantNo) {
              vm.$router.push({ name: 'checkplan' })
            } else {
              vm.$router.push({ name: 'repayment' })
            }
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
    nextSmall () {
      let vm = this
      let have = false
      document.querySelectorAll('.indexDom').forEach(function (item, index) {
        if (document.querySelectorAll('.indexDom .el-input__inner')[index].value) {
          vm.planItem[item.dataset.myindex].customizecity = document.querySelectorAll('.indexDom .el-input__inner')[index].value.replace(/\s*/g, '')
        }
        if (document.querySelectorAll('.companyDom .el-input__inner')[index].value) {
          vm.planItem[item.dataset.myindex].cityindustryName = document.querySelectorAll('.companyDom .el-input__inner')[index].value
          vm.planItem[item.dataset.myindex].cityindustry = vm.company[index].no
        } else {
          have = true
        }
      })
      if (have) {
        vm.$message({
          message: '请选择商户',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'success'
        })
        return
      }
      if (vm.usermerchantNo) {
        vm.merchantNo = vm.usermerchantNo
      }
      let parmas = {
        '0': '0700',
        '3': '390049',
        '8': vm.money,
        '10': Date.parse(vm.searchTime.replace(/-/g, '/')),
        '11': Date.parse(vm.endTime.replace(/-/g, '/')),
        '12': vm.calcList[9],
        '13': vm.calcList[7],
        '42': vm.merchantNo,
        '43': vm.$route.query.acqcode,
        '44': vm.$stact.state.newem ? vm.$stact.state.newem : '',
        '57': JSON.stringify(vm.planItem),
        '59': vm.version
      }
      if (this.zjHk) {
        parmas['46'] = this.$route.query.rate
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
            vm.$router.push({ name: 'emptyrepayment' })
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
    city (type) {
      let vm = this
      if (vm.usermerchantNo) {
        vm.merchantNo = vm.usermerchantNo
      }
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
          if (res.data[39] === '00') {
            if (type === 0) {
              vm.cityList.map((y, z) => {
                JSON.parse(res.data[38]).map((x, i) => {
                  y.city.push({
                    value: x.id,
                    label: x.divisionName,
                    children: []
                  })
                })
              })
            } else {
              vm.cityList[vm.now].city.map((c, z) => {
                if (c.value === type) {
                  c.children = []
                  vm.company[vm.now].value = ''
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
          console.log(err)
        })
    }
    // handleCompany (is) {
    //   if (is === true) {
    //     this.$nextTick(() => {
    //       this.merchantList(this.cnow)
    //     })
    //   }
    // }
  }
}
</script>
