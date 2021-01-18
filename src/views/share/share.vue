<template>
  <div>
    <div class='sharePadd'>
      <div class='share'>
        <p class='shareTitle'>
          推广服务
        </p>
        <p>
          自用省钱，推广赚钱
        </p>
        <div class='allFlex'>
            <router-link :to="{name: 'reg'}" tag='div' class='half textCenter'>
                <img src='../../assets/share/reg.png'  class='imageTwo' />
                <p>面对面注册</p>
            </router-link>
            <router-link :to="{name: 'shareimg'}" tag='div' class='half textCenter'>
                <img src='../../assets/share/code.png'  class='imageTwo' />
                <p>分享二维码</p>
            </router-link>
            <router-link :to="{name: 'upgrade'}" v-if="showLogo['10G']" tag='div' class='half textCenter'>
                <img src='../../assets/share/upgrade.png'  class='imageTwo' />
                <p>我要升级</p>
            </router-link>
            <router-link :to="{name: 'cool'}" v-if="showLogo['10T']" tag='div' class='half textCenter'>
                <img src='../../assets/share/copywriting.png'  class='imageTwo' />
                <p>{{showLogo['10T']}}</p>
            </router-link>
        </div>
      </div>
    </div>
    <div class='homeTutorial noMarp'>
        <div>
          <div class='tutorialImg'>
              <img src='../../assets/share/banner.png'>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      version: '',
      agentNo: '',
      merchantNo: '',
      showLogo: {}
    }
  },
  components: {
  },
  watch: {
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.message()
  },
  mounted () {
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
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.showLogo = JSON.parse(res.data[15])
            console.log(vm.showLogo)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
