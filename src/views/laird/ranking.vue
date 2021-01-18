<template>
  <div class='jyj-feudalpage jyj-ranking'>
    <div class="feudal-list" v-for="(item,index) in rejestlist" :key="index">
      <div class="left-adress clear-padd">
        <div v-if="index <= 2" class="qiang-img">
          <img v-if="index == 0" src="../../assets/feudallord/one.png" alt="">
          <img v-if="index == 1" src="../../assets/feudallord/two.png" alt="">
          <img v-if="index == 2" src="../../assets/feudallord/three.png" alt="">
        </div>
        <div v-if="index > 2" class="number-list">
          {{index+1}}
        </div>
        <div class="icon-font">
          <i class="el-icon-location-outline"></i>
        </div>
        <div class="shi-qu">
          <div class="shi-font">
            <vue-seamless-scroll v-if="list[index].city.length>3" :data="item.city" :class-option="optionLeft" class="seamless-warp2">
              <ul class="item">
                <li v-text="item.city[0]"></li>
              </ul>
            </vue-seamless-scroll>
            <div v-if="list[index].city.length<=3" class="gundong">
              <p>{{item.city}}</p>
            </div>
          </div>
          <div class="shi-font select-qu">
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
      <div class="right-message">
        <div class="shouyi">
          <div>领主</div>
          <div>收益: {{item.totalMoney}}</div>
        </div>
        <div class="center-time">
          <div>到期时间</div>
          <div>{{item.endTime}}</div>
        </div>
        <!-- <div class="qiang-img">
          <img src="../../assets/feudallord/qiang.png" alt="">
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'first',
      setint: null,
      setinttwo: null,
      merchantid: '',
      list: [],
      rejestlist: []
    }
  },
  components: {
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.merchantid = JSON.parse(this.$stact.state.token)[0].id
    this.message()
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
  methods: {
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
    message () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '393001',
        '35': vm.merchantid,
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
