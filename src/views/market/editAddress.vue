<template>
    <div class='hundred addAddress-layout' style="overflow-x: hidden;">
      <ul>
        <li>
          <p>收货人</p>
          <el-input v-model="receiver" onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')" onpaste="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')" oncontextmenu = "value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')" placeholder="请输入收货人名字"></el-input>
        </li>
        <li>
          <p>手机号</p>
          <el-input size="mini" v-model="phone" placeholder="请输入手机号"></el-input>
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
        <div @click="confirm">确认</div>
      </div>
    </div>
</template>
<script>

export default {
  data () {
    return {
      receiver: '',
      phone: '',
      id: '',
      addrDetail: '',
      addrDefault: 0,
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
      areaName: ''
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.receiver = this.$route.query.receiver
    this.phone = this.$route.query.phone
    this.id = this.$route.query.id
    this.addrDetail = this.$route.query.addrDetail
    this.addrDefault = this.$route.query.addrDefault
    this.provinceName = this.$route.query.province
    this.cityName = this.$route.query.city
    this.areaName = this.$route.query.district
    let vm = this
    let parmas = {
      '0': '0700',
      '3': '999999',
      '43': 0,
      '59': vm.version
    }
    let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
    vm.$http.get(`request.app${url}`)
      .then(res => {
        if (res.data[39] === '00') {
          this.$set(this, 'provinceArr', JSON.parse(res.data[57]))
          this.provinceArr.forEach(item => {
            if (item.divisionName === this.provinceName) {
              this.provinceId = item.id
            }
          })
          parmas = {
            '0': '0700',
            '3': '999999',
            '43': this.provinceId,
            '59': vm.version
          }
          let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
          vm.$http.get(`request.app${url}`)
            .then(res => {
              if (res.data[39] === '00') {
                this.$set(this, 'cityArr', JSON.parse(res.data[57]))
                this.cityArr.forEach(item => {
                  if (item.divisionName === this.cityName) {
                    this.cityId = item.id
                  }
                })
                parmas = {
                  '0': '0700',
                  '3': '999999',
                  '43': this.cityId,
                  '59': vm.version
                }
                let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
                vm.$http.get(`request.app${url}`)
                  .then(res => {
                    if (res.data[39] === '00') {
                      this.$set(this, 'areaArr', JSON.parse(res.data[57]))
                      this.areaArr.forEach(item => {
                        if (item.divisionName === this.areaName) {
                          this.areaId = item.id
                        }
                      })
                    }
                  })
                  .catch(err => {
                    console.log(err)
                  })
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    confirm () {
      let vm = this
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
      let parmas = {
        '0': '0700',
        '3': '680001',
        '40': vm.id,
        '41': 2,
        '42': vm.merchantNo,
        '43': vm.provinceName,
        '44': vm.cityName,
        '45': vm.areaName,
        '46': vm.addrDetail,
        '47': vm.addrDefault,
        '48': vm.receiver,
        '49': vm.phone,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
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
