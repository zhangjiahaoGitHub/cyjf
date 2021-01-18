<template>
  <div class='jyj-feudalpage jyj-bidecord'>
    <div v-if="$route.meta.bidrecord" class="leftRouter leftwihteRouter">
      <img src="../../assets/leftArrow.png" v-if="$route.meta.bidrecord"  class="leftArrow" @click="goTop()"/>
      {{$route.meta.title}}
      <span v-if="$route.meta.bidrecord" class='retreat rightcolor' id="trigger4">月份</span>
    </div>
    <div class="top-top-height"></div>
    <div class="feudal-list" v-for="(item,index) in rejestlist" :key="index">
      <div class="select-time">{{item.createTime}}</div>
      <div class="left-adress">
        <div class="icon-font">
          <i class="el-icon-location-outline"></i>
        </div>
        <div class="shi-qu">
          <div v-if="list[index].city.length!=0" class="shi-font">
            <vue-seamless-scroll v-if="list[index].city.length>3" :data="item.city" :class-option="optionLeft" class="seamless-warp2">
              <ul class="item">
                <li v-text="item.city[0]"></li>
              </ul>
            </vue-seamless-scroll>
            <div v-if="list[index].city.length<=3" class="gundong">
              <p>{{item.city}}</p>
            </div>
          </div>
          <div  v-if="list[index].area.length!=0" class="shi-font select-qu">
            <vue-seamless-scroll v-if="list[index].area.length>3" :data="item.area" :class-option="optionLefttwo" class="seamless-warp3">
              <ul class="item">
                <li v-text="item.area[0]"></li>
              </ul>
            </vue-seamless-scroll>
            <div v-if="list[index].area.length<=3" class="gundong qu-font">
              <p>{{item.area}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="bidrecord-right">
        <div class="zhong-price">
          <span>中标领主: {{item.merchant_Name}}</span>
          <span class="clo">报价: {{item.total_Money}}</span>
        </div>
        <div>有效期: {{item.start_Time}}至{{item.end_Time}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import PickerExtend from 'picker-extend'
export default {
  data () {
    return {
      activeName: 'first',
      setint: null,
      setinttwo: null,
      merchantid: '',
      list: [],
      rejestlist: [],
      expiration: ''
    }
  },
  components: {
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.merchantid = JSON.parse(this.$stact.state.token)[0].id
    this.message('')
  },
  computed: {
    optionLeft () {
      return {
        direction: 2,
        limitMoveNum: 2,
        step: 0.4,
        singleWidth: 147,
        waitTime: 1500
      }
    },
    optionLefttwo () {
      return {
        direction: 2,
        limitMoveNum: 2,
        step: 0.4,
        singleWidth: 120,
        waitTime: 1500
      }
    }
  },
  mounted () {
    this.$inputLen.inputJs()
    let timedata = []
    let vm = this
    for (let i = 1; i <= 200; i++) {
      timedata.push({
        id: i,
        value: 1900 + i,
        childs: [
          { id: '1', value: '1月' },
          { id: '2', value: '2月' },
          { id: '3', value: '3月' },
          { id: '4', value: '4月' },
          { id: '5', value: '5月' },
          { id: '6', value: '6月' },
          { id: '7', value: '7月' },
          { id: '8', value: '8月' },
          { id: '9', value: '9月' },
          { id: '10', value: '10月' },
          { id: '11', value: '11月' },
          { id: '12', value: '12月' }
        ]
      })
    }
    let year = new Date().getFullYear()
    let month = new Date().getMonth()
    let mobileSelect4 = new PickerExtend({
      trigger: '#trigger4',
      title: '选择时间',
      wheels: [
        { data: timedata }
      ],
      position: [year - 1900 - 1, month],
      callback: function (indexArr, data) {
        let nian = String(data[0].value)
        let yue = data[1].id
        if (yue < 10) {
          yue = '0' + yue
        }
        vm.expiration = nian + '-' + yue
        vm.message(vm.expiration)
      }
    })
  },
  methods: {
    goTop () {
      this.$router.go(-1)
    },
    // 滚动公告
    startMove () {
      // eslint-disable-next-line
      let timer = setInterval(() => {
        if (this.scroll.number === this.scroll.textArr.length - 1) {
          this.scroll.number = 0
        } else {
          this.scroll.number += 1
        }
      }, 5000) // 滚动不需要停顿则将2000改成动画持续时间
    },
    message (time) {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '393005',
        '35': time,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.list = JSON.parse(res.data[57])
            vm.rejestlist = JSON.parse(res.data[57])
            for (let i in vm.rejestlist) {
              if (vm.rejestlist[i].city.length > 3) {
                let city = vm.rejestlist[i].city
                vm.rejestlist[i].city = []
                vm.rejestlist[i].city.push(city)
                vm.rejestlist[i].city.push(city)
              }
              if (vm.rejestlist[i].area.length > 3) {
                let area = vm.rejestlist[i].area
                vm.rejestlist[i].area = []
                vm.rejestlist[i].area.push(area)
                vm.rejestlist[i].area.push(area)
              }
            }
            console.log(vm.rejestlist)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  destroyed () {
    if (this.setint) {
      clearInterval(this.setint)
    }
    if (this.setinttwo) {
      clearInterval(this.setinttwo)
    }
  }
}
</script>
