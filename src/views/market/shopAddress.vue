<template>
    <div class='hundred shopAddress-layout' style="overflow-x: hidden;">
      <i @click="()=>{this.$router.push({name:'addAddress'})}" class="el-icon-plus addAddress">添加地址</i>
      <ul>
        <li v-for="(item,i) in addressList" :key="i">
          <div class='flbwe'>
            <div @click="selectaddress(i)">
              <p><span>{{item.name}}</span><span>{{item.phone}}</span></p>
              <p>{{item.address.replace(/--/g,'')}}</p>
            </div>
          </div>
          <div class='allFlex justifyBetween padtop'>
            <div>
              <el-radio  @change='settype(item.name,item.province,item.phone,item.id,item.address)' v-model="radio" :label="item.id"></el-radio>
              <span @click='settype(item.name,item.province,item.phone,item.id,item.address)'>设为默认收货地址</span>
            </div>
            <div>
              <span class='redColor' @click='de(item.id)'>删除</span>
              <span  @click="editAddress(item.name,item.provinceName,item.phone,item.id,item.address,item.status)" class='lfetpac'>编辑</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
</template>
<script>

export default {
  data () {
    return {
      addressList: [],
      radio: ''
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.type = this.$route.query.type
    this.getAddresslist()
  },
  methods: {
    de (id) {
      let vm = this
      this.$confirm('是否删除地址？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let parmas = {
          '0': '0700',
          '3': '680002',
          '42': id,
          '59': vm.version
        }
        let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
        vm.$http.get(`request.app${url}`)
          .then(res => {
            if (res.data[39] === '00') {
              vm.$message({
                type: 'success',
                message: '删除成功!',
                center: true,
                offset: 30,
                duration: 2500
              })
              vm.getAddresslist()
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
      }).catch(() => {
      })
    },
    editAddress (receiver, province, phone, id, address, addrDefault) {
      address = address.split('--')
      this.$router.push({
        name: 'editAddress',
        query: {
          receiver,
          province: address[0],
          phone,
          id,
          district: address[2],
          city: address[1],
          addrDetail: address[3],
          addrDefault
        }
      })
    },
    selectaddress (i) {
      if (this.$route.query.my) {
        this.$router.go(-1)
        return
      }
      this.$router.replace({ name: 'ordersure', query: { addresstype: i, selecttype: true, id: this.$route.query.id } })
    },
    settype (receiver, province, phone, id, address) {
      address = address.split('--')
      console.log(address)
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '680001',
        '40': id,
        '41': 2,
        '42': vm.merchantNo,
        '43': address[0],
        '44': address[1],
        '45': address[2],
        '46': address[3],
        '47': 1,
        '48': receiver,
        '49': phone,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.getAddresslist()
        })
        .catch(err => {
          console.log(err)
        })
    },
    getAddresslist () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '680003',
        '42': vm.merchantNo,
        '59': this.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.addressList = JSON.parse(res.data[45]) // 收货地址
            let ralist = JSON.parse(res.data[45]).filter((x, i) => {
              return Number(x.status) === 1
            })
            if (ralist.length > 0) {
              vm.radio = ralist[0].id
            } else {
              vm.radio = ''
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    end () {
      clearTimeout(this.loop) // 清空定时器，防止重复注册定时器
    }
  }
}
</script>
