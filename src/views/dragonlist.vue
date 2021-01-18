<template>
  <div class='jyj-uprage'>
      <div>
        <div>
          <div class="numberone" v-if='Object.keys(pnumberone).length'>
            <div class="left-number">
              <img class="img-size-l" src="../assets/jinpail.png" alt="">
            </div>
            <div class="right-message">
              <div class="img-size-r">
                <div class="img-title">
                  <img :src="pnumberone.HEAD_URL ? pnumberone.HEAD_URL : require('../assets/head.png')" alt="">
                </div>
              </div>
              <p class="phone-top">{{pnumberone.phone ? pnumberone.phone : ''}}</p>
              <p>直推<span class="clor">{{pnumberone.count}}</span>人</p>
            </div>
          </div>
          <div class="numbertwo" v-if='Object.keys(pnumbertwo).length'>
            <div class="left-number">
              <img class="img-size-l" src="../assets/yinpai.png" alt="">
            </div>
            <div class="right-message-two">
              <div class="title-box">
                <div class="position-box">
                  <div class="border-radius-box">
                    <img :src="pnumbertwo.HEAD_URL ? pnumbertwo.HEAD_URL : require('../assets/head.png')" alt="">
                  </div>
                  <div class="bg-two"></div>
                </div>
              </div>
              <div class="right-con">
                <div>{{pnumbertwo.phone ? pnumbertwo.phone : ''}}</div>
                <div>直推<span class="clor">{{pnumbertwo.count}}</span>人</div>
              </div>
            </div>
          </div>
          <div class="numbertwo" v-if='Object.keys(pnumberthree).length'>
            <div class="left-number">
              <img class="img-size-l" src="../assets/tongpai.png" alt="">
            </div>
            <div class="right-message-two">
              <div class="title-box">
                <div class="position-box">
                  <div class="border-radius-box">
                    <img :src="pnumberthree.HEAD_URL ? pnumberthree.HEAD_URL : require('../assets/head.png')" alt="">
                  </div>
                  <div class="bg-three"></div>
                </div>
              </div>
              <div class="right-con">
                <div>{{pnumberthree.phone ? pnumberthree.phone : ''}}</div>
                <div>直推<span class="clor">{{pnumberthree.count}}</span>人</div>
              </div>
            </div>
          </div>
          <div class="number-list" v-for="(item, index) in numberlist" :key="index">
            <div class="number-num">
              NO.{{index+4}}
            </div>
            <div class="right-box">
              <div class="img-title">
                <img :src="item.HEAD_URL ? item.HEAD_URL : require('../assets/head.png')" alt="">
              </div>
              <div class="right-con">
                <div>{{item.phone}}</div>
                <div>直推<span class="clor">{{item.count}}</span>人</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    <div class="set-bottom"></div>
    <div class="my-uprage">
      <div class="my-level">
        <div class="top-mar">NO.{{paihang || 1}}</div>
        <div>我的排名</div>
      </div>
      <div class="my-tit-img">
        <img :src="mylist.HEAD_URL ? mylist.HEAD_URL : require('../assets/head.png')" alt="">
      </div>
      <div class="my-message">
        <div class="top-mar">{{mylist.phone || '暂无'}}</div>
        <div>直推<span class="clor">{{mylist.count  || 0}}</span>人</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'first',
      level: '',
      type: '10A',
      price: '',
      uplevel: '2',
      list: [],
      copylist: [],
      pnumberone: {},
      pnumbertwo: {},
      pnumberthree: {},
      numberlist: [],
      mylist: [],
      paihang: 0
    }
  },
  components: {
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.level = JSON.parse(this.$stact.state.token)[0].level
    this.listmessage()
  },
  methods: {
    listmessage () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '790015',
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.list = JSON.parse(res.data[57])
            vm.mylist = JSON.parse(res.data[43])
            vm.paihang = JSON.parse(res.data[44])
            vm.mylist.phone = vm.mylist.phone.substring(0, 3) + '****' + vm.mylist.phone.substring(7, 11)
            for (let i in vm.list) {
              if (vm.list[i].phone) {
                vm.list[i].phone = vm.list[i].phone.substring(0, 3) + '****' + vm.list[i].phone.substring(7, 11)
              } else {
                vm.list[i].phone = '无电话'
              }
              if (i > 2) {
                vm.numberlist.push(vm.list[i])
              }
            }
            if (vm.list.length >= 1) {
              vm.pnumberone = vm.list[0]
            }
            if (vm.list.length >= 2) {
              vm.pnumbertwo = vm.list[1]
            }
            if (vm.list.length >= 3) {
              vm.pnumberthree = vm.list[2]
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
