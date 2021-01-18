<template>
  <div class='jyj-myfeudal'>
    <div class="head-person">
      <div class="img-name">
        <div class="title-img">
          <img :src="headurl" alt="">
        </div>
        <div>
          <div class="name">{{mername ? mername : '姓名'}}</div>
          <div>等级：{{lordlevel ? lordlevel : '无'}}</div>
        </div>
      </div>
      <div class="price-box">
        <div class="price">余额：{{yueprice}}</div>
        <router-link tag="div" :to="{name:'feuwithdraw',query :{price: yueprice}}" class="sub-tixian">提现</router-link>
      </div>
    </div>
    <div class="list-box">
      <div class="list-row" v-for="(item,index) in list" :key="index">
        <div class="time">{{item.createTime}}</div>
        <div>
          <div class="font-style">{{item.merchantCnName}}</div>
          <div class="gray">{{item.createTime}}</div>
        </div>
        <div class="right-detail">
          <div>
            <div class="red-clo">{{item.money}}</div>
            <div class="gray">交易详情</div>
          </div>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
      <!-- <div class="list-row">
        <div>
          <div class="font-style">王晓明分润</div>
          <div class="gray">2019-07-26 14:03</div>
        </div>
        <div class="right-detail">
          <div>
            <div class="red-clo">100.00</div>
            <div class="gray">交易详情</div>
          </div>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
      <div class="list-row">
        <div>
          <div class="font-style">王晓明分润</div>
          <div class="gray">2019-07-26 14:03</div>
        </div>
        <div class="right-detail">
          <div>
            <div class="red-clo">100.00</div>
            <div class="gray">交易详情</div>
          </div>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
      <div class="list-row">
        <div>
          <div class="font-style">王晓明分润</div>
          <div class="gray">2019-07-26 14:03</div>
        </div>
        <div class="right-detail">
          <div>
            <div class="red-clo">100.00</div>
            <div class="gray">交易详情</div>
          </div>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      merchantid: '',
      version: '',
      agentNo: '',
      merchantNo: '',
      list: [],
      mername: '',
      yueprice: '',
      headurl: '',
      lordlevel: ''
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
  },
  methods: {
    message () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '393006',
        '42': vm.merchantNo,
        '43': '1',
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.list = JSON.parse(res.data[57])
            vm.mername = res.data[36]
            vm.yueprice = res.data[37]
            vm.headurl = res.data[33]
            vm.lordlevel = res.data[35]
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
