<template>
    <div class='hundred addAddress-layout' style="overflow-x: hidden;">
      <ul>
        <li>
          <p>收货人</p>
          <el-input size="mini" v-model="receiver" onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')" onpaste="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')" placeholder="请输入收货人名字"></el-input>
        </li>
        <li>
          <p>手机号</p>
          <el-input size="mini" v-model="phone" placeholder="请输入手机号" oninput="this.value=this.value.replace(/[^\d]/g,'')" onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"></el-input>
        </li>
        <li>
          <p>省</p>
          <el-select @change="provinceChange" size="mini" v-model="provinceId" placeholder="请选择省">
              <el-option
                v-for="item in provinceArr"
                :key="item.id"
                :label="item.divisionName"
                :value="item.id">
              </el-option>
            </el-select>
        </li>
        <li>
          <p>市</p>
          <el-select @change="cityChange" size="mini" v-model="cityId" placeholder="请选择市">
              <el-option
                v-for="item in cityArr"
                :key="item.id"
                :label="item.divisionName"
                :value="item.id">
              </el-option>
            </el-select>
        </li>
        <li>
          <p>区</p>
          <el-select @change="areaChange" size="mini" v-model="areaId" placeholder="请选择区">
              <el-option
                v-for="item in areaArr"
                :key="item.id"
                :label="item.divisionName"
                :value="item.id">
              </el-option>
            </el-select>
        </li>
        <li>
          <p>详细地址</p>
          <el-input size="mini" v-model="addrDetail" onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')" onpaste="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')" placeholder="请输入详细收件地址"></el-input>
        </li>
      </ul>
      <div class="btnDiv">
        <div @click="confirm" element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>确认</div>
      </div>
    </div>
</template>
<script>

export default {
  data () {
    return {
      receiver: '',
      phone: '',
      addrDetail: '',
      provinceArr: [],
      cityArr: [],
      areaArr: [],
      // 省
      provinceId: '',
      provinceName: '',
      // 市
      cityId: '',
      cityName: '',
      // 区
      areaId: '',
      areaName: '',
      fullscreenLoading: false
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.type = this.$route.query.type
    this.getProvince(0, 'provinceArr')
  },
  methods: {
    confirm () {
      if (this.receiver.match(/^[ ]*$/)) {
        this.$message({
          message: '请填写收货人',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (this.phone.match(/^[ ]*$/)) {
        this.$message({
          message: '请填写手机号',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (!(/^1[1-9]\d{9}$/.test(this.phone))) {
        this.$message({
          message: '手机号码有误，请重填',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (this.provinceName.match(/^[ ]*$/)) {
        this.$message({
          message: '请选择省份',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (this.cityName.match(/^[ ]*$/)) {
        this.$message({
          message: '请选择市',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (this.areaName.match(/^[ ]*$/)) {
        this.$message({
          message: '请选择区',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (this.addrDetail.match(/^[ ]*$/)) {
        this.$message({
          message: '请填写详细地址',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '680001',
        '40': '',
        '41': 1,
        '42': vm.merchantNo,
        '43': vm.provinceName,
        '44': vm.cityName,
        '45': vm.areaName,
        '46': vm.addrDetail,
        '47': 2,
        '48': vm.receiver,
        '49': vm.phone,
        '59': vm.version
      }
      let url = vm.$mdata.mdGet(parmas)
      vm.fullscreenLoading = true
      vm.$http.post(`request.app`, url)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            this.$router.go(-1)
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
    // 选择省
    provinceChange () {
      this.cityId = ''
      this.cityName = ''
      this.areaId = ''
      this.areaName = ''
      this.getProvince(this.provinceId, 'cityArr')
      this.provinceArr.forEach(item => {
        if (item.id === this.provinceId) {
          this.provinceName = item.divisionName
        }
      })
    },
    // 选择市
    cityChange () {
      this.areaId = ''
      this.areaName = ''
      this.getProvince(this.cityId, 'areaArr')
      this.cityArr.forEach(item => {
        if (item.id === this.cityId) {
          this.cityName = item.divisionName
        }
      })
    },
    // 选择区
    areaChange () {
      this.areaArr.forEach(item => {
        if (item.id === this.areaId) {
          this.areaName = item.divisionName
        }
      })
    },
    // id:0省份，其他是省id或者市id，type为查询什么：传下拉框绑定数组
    getProvince (id, type) {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '999999',
        '43': id,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            this.$set(this, type, JSON.parse(res.data[57]))
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
