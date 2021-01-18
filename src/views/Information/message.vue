<template>
  <div class='hundred'>
    <div style='height:1px'></div>
    <div class='homeTutorial messAll' v-for='(item, index) in itemList' :key='index' @click="tosystemnotice(index, item.id)">
      <div class='allFlex justifyBetween'>
        <div>{{item.title}}</div>
        <div>{{$moment(item.effectiveFromTime.time).format('YYYY-MM-DD HH:mm:ss')}}</div>
      </div>
      <div class='gary aisleJust messPadding'>
        {{item.content}}
      </div>
    </div>
    <div class='bottomLong'></div>
  </div>
</template>
<script>
import copy from 'copy-to-clipboard'

export default {
  data () {
    return {
      agentNo: '',
      version: '',
      merchantNo: '',
      itemList: []
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.list()
  },
  mounted () {
  },
  methods: {
    tosystemnotice (i, id) {
      this.$router.push({ name: 'systemnotice', query: { index: i, itemid: id } })
    },
    list () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '190103',
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.itemList = JSON.parse(res.data[60])
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
