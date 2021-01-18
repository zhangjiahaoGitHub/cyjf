<template>
  <div class='jyj-feudalpage'>
    <div v-if="$route.meta.feudalpage" class="top-top-height"></div>
    <div class="banner-top">
      <img src="../../assets/feudallord/banner.png" alt="">
    </div>
    <div class="dx-homelist">
      <div class='allFlex homeList'>
        <!-- <div class='textCenter' @click="torepayment()">
            <img src='../assets/card.png' @click="torepayment()" class='imageOne' />
            <p>智能还款</p>
        </div> -->
        <router-link tag="div" :to="{name: 'application'}" class='textCenter'>
          <img src='../../assets/feudallord/shenqing.png'  class='imageOne' />
          <p>申请领主</p>
        </router-link>
        <router-link tag="div" :to="{name:'bidrecord'}" class='textCenter'>
          <img src='../../assets/feudallord/zhongbiao.png'  class='imageOne' />
          <p>中标记录</p>
        </router-link>
        <router-link tag="div" :to="{name: 'ranking'}" class='textCenter'>
          <img src='../../assets/feudallord/shouyi.png'  class='imageOne' />
          <p>收益排行</p>
        </router-link>
        <router-link tag="div" :to="{name : 'myfeudal'}" class='textCenter'>
          <img src='../../assets/feudallord/wode.png'  class='imageOne' />
          <p>我的</p>
        </router-link>
      </div>
    </div>
    <div class="feudal-list" v-for="(item,index) in rejestlist" :key="index" @click="toshenqing(item)">
      <div class="left-adress">
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
        <div>
          <div>领主</div>
          <div>收益: {{item.totalMoney}}</div>
        </div>
        <div class="center-time">
          <div>到期时间</div>
          <div>{{item.endTime}}</div>
        </div>
        <div class="qiang-img">
          <img src="../../assets/feudallord/qiang.png" alt="">
        </div>
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
    toshenqing (item) {
      this.$router.push({ name: 'application', query: { item: JSON.stringify(item) } })
    },
    message () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '393001',
        '35': vm.merchantid,
        '42': vm.merchantNo,
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
