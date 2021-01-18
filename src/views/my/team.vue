<template>
    <div class='hundred'>
        <div class='teamBack'>
            <div>
                <p class='teamPeople'>
                    团队总人数
                </p>
                <p class='teamNum'>
                    {{teamList[32] || 0}}
                </p>
            </div>
        </div>
        <div class='pushNum teamMargin'>
            <router-link :to="{name: 'straight'}" tag='div' class='allFlex teamFlex'>
                <div class='half teamBold allFlex'>
                    <div class='teamMy'>我的直推</div>
                    <span class='blueColor'>{{teamList[28] || 0}}</span>
                </div>
                <div class='half teamRight allFlex'>
                    <div>今日<br />新增</div>
                    <div class='blueColor teamNew'>{{teamList[29] || 0}}</div>
                    <img src='../../assets/right.png' class='teamNext'/>
                </div>
            </router-link>
            <router-link :to="{name: 'between'}" tag='div' class='allFlex teamFlex'>
                <div class='half teamBold allFlex'>
                    <div class='teamMy'>我的间推</div>
                    <span class='blueColor'>{{teamList[30] || 0}}</span>
                </div>
                <div class='half teamRight allFlex'>
                    <div>今日<br />新增</div>
                    <div class='blueColor teamNew'>{{teamList[31] || 0}}</div>
                    <img src='../../assets/right.png' class='teamNext'/>
                </div>
            </router-link>
            <router-link :to="{name: 'unnamed'}" tag='div' class='allFlex teamFlex border'>
                <div class='half teamBold allFlex'>
                    <div class='teamMy'>未实名</div>
                    <span class='blueColor'>{{teamList[33] || 0}}</span>
                </div>
                <div class='half teamRight allFlex'>
                    <div>今日<br />新增</div>
                    <div class='blueColor teamNew'>{{teamList[34] || 0}}</div>
                    <img src='../../assets/right.png' class='teamNext'/>
                </div>
            </router-link>
        </div>
        <div class='pushNum allFlex teamMargin'>
            <div class='teamWidxx allFlex teamFlex borderRight' v-show='vip >= 1'>
                <div class='half'>{{level[1] || 0}}</div>
                <div class='half rightColor minHalf'>
                    <span>{{teamList[35] || 0}}</span>
                </div>
            </div>
            <div class='teamWidxx allFlex teamFlex' v-show='vip >= 2'>
                <div class='half'>
                    <span class='paddingTeam'>
                        {{level[2] || 0}}
                    </span>
                </div>
                <div class='half rightColor minHalf'>
                    <span>{{teamList[36] || 0}}</span>
                </div>
            </div>
        </div>
        <div class='pushNum allFlex'>
            <div class='teamWidxx allFlex teamFlex borderRight' v-show='vip >= 3'>
                <div class='half'>{{level[3] || 0}}</div>
                <div class='half rightColor minHalf'>
                    <span>{{teamList[37] || 0}}</span>
                </div>
            </div>
            <div class='teamWidxx allFlex teamFlex' v-show='vip >= 4'>
                <div class='half'>
                    <span class='paddingTeam'>
                        {{level[4] || 0}}
                    </span>
                </div>
                <div class='teamWidxx rightColor minHalf'>
                    <span>{{teamList[38] || 0}}</span>
                </div>
            </div>
        </div>
        <div class='pushNum allFlex'>
            <div class='teamWidxx allFlex teamFlex borderRight' v-show='vip >= 5'>
                <div class='half'>{{level[5] || 0}}</div>
                <div class='half rightColor minHalf'>
                    <span>{{teamList[40] || 0}}</span>
                </div>
            </div>
            <div class='teamWidxx allFlex teamFlex' v-show='vip >= 6'>
                <div class='half'>
                    <span class='paddingTeam'>
                        {{level[6] || 0}}
                    </span>
                </div>
                <div class='half rightColor minHalf'>
                    <span>{{teamList[41] || 0}}</span>
                </div>
            </div>
        </div>
        <div class='bottomLong'></div>
    </div>
</template>
<script>

export default {
  data () {
    return {
      phone: '',
      version: '',
      agentNo: '',
      teamList: {},
      level: {},
      vip: 0
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.phone = JSON.parse(this.$stact.state.token)[0].phone
    this.vip = JSON.parse(this.$stact.state.token)[0].level
    this.level = this.$stact.state.level
    this.list()
  },
  methods: {
    list () {
      let vm = this
      let parmas = {
        '0': '0700',
        '1': vm.phone,
        '3': '190114',
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            this.teamList = res.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
