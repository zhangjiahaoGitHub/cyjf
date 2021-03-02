import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    meta: {
      title: '登录',
      regLeft: true
    },
    component: (resolve : any) => require(['../views/login.vue'], resolve)
  },
  {
    path: '/registered',
    name: 'registered',
    meta: {
      title: '注册',
      left: true
    },
    component: (resolve : any) => require(['../views/registered.vue'], resolve)
  },
  {
    path: '/forget',
    name: 'forget',
    meta: {
      title: '忘记密码',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/forget.vue'], resolve)
  },
  {
    path: '/changepaw',
    name: 'changepaw',
    meta: {
      title: '修改密码',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/changepaw.vue'], resolve)
  },
  {
    path: '/home',
    name: 'home',
    meta: {
      title: '首页',
      home: true,
      navShow: true
    },
    component: (resolve : any) => require(['../views/home.vue'], resolve)
  },
  {
    path: '/surrender',
    name: 'surrender',
    meta: {
      title: '中介代还',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/surrender/surrender.vue'], resolve)
  },
  {
    path: '/upgrade',
    name: 'upgrade',
    meta: {
      title: '会员升级',
      backLeft: true
    },
    component: (resolve : any) => require(['../views/member/upgrade.vue'], resolve)
  },
  {
    path: '/pay',
    name: 'pay',
    meta: {
      title: '支付',
      backLeft: true
    },
    component: (resolve : any) => require(['../views/member/pay.vue'], resolve)
  },
  {
    path: '/paygetway',
    name: 'paygetway',
    meta: {
      title: '支付宝支付',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/member/paygetway.vue'], resolve)
  },
  {
    path: '/share',
    name: 'share',
    meta: {
      title: '邀请分享',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/share/share.vue'], resolve)
  },
  {
    path: '/shareimg',
    name: 'shareimg',
    meta: {
      title: '分享二维码',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/share/shareimg.vue'], resolve)
  },
  {
    path: '/reg',
    name: 'reg',
    meta: {
      title: '面对面注册',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/share/reg.vue'], resolve)
  },
  {
    path: '/my',
    name: 'my',
    meta: {
      title: '我的',
      noLeft: true,
      navShow: true
    },
    component: (resolve : any) => require(['../views/my/my.vue'], resolve)
  },
  {
    path: '/real',
    name: 'real',
    meta: {
      title: '实名认证',
      whiteLeft: true
    },
    component: () => import('../views/real/real.vue')
  },
  {
    path: '/deposit',
    name: 'deposit',
    meta: {
      title: '实名认证',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/real/deposit.vue'], resolve)
  },
  {
    path: '/team',
    name: 'team',
    meta: {
      title: '我的团队',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/my/team.vue'], resolve)
  },
  {
    path: '/straight',
    name: 'straight',
    meta: {
      title: '我的直推',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/my/straight.vue'], resolve)
  },
  {
    path: '/between',
    name: 'between',
    meta: {
      title: '我的间推',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/my/between.vue'], resolve)
  },
  {
    path: '/unnamed',
    name: 'unnamed',
    meta: {
      title: '未实名用户',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/my/unnamed.vue'], resolve)
  },
  {
    path: '/wallet',
    name: 'wallet',
    meta: {
      title: '我的钱包',
      left: true
    },
    component: (resolve : any) => require(['../views/my/wallet.vue'], resolve)
  },
  {
    path: '/today',
    name: 'today',
    meta: {
      title: '今日收入',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/my/today.vue'], resolve)
  },
  {
    path: '/mouth',
    name: 'mouth',
    meta: {
      title: '当月收益',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/my/mouth.vue'], resolve)
  },
  {
    path: '/details',
    name: 'details',
    meta: {
      title: '详情',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/my/details.vue'], resolve)
  },
  {
    path: '/cumulative',
    name: 'cumulative',
    meta: {
      title: '详情',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/my/cumulative.vue'], resolve)
  },
  {
    path: '/retreat',
    name: 'retreat',
    meta: {
      title: '立即提现',
      whiteLeft: true,
      withdraw: true
    },
    component: (resolve : any) => require(['../views/my/retreat.vue'], resolve)
  },
  {
    path: '/change',
    name: 'change',
    meta: {
      title: '更换储蓄卡',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/my/change.vue'], resolve)
  },
  {
    path: '/withdlist',
    name: 'withdlist',
    meta: {
      title: '提现记录',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/my/withdlist.vue'], resolve)
  },
  {
    path: '/alldetails',
    name: 'alldetails',
    meta: {
      title: '交易明细',
      left: true
    },
    component: (resolve : any) => require(['../views/my/alldetails.vue'], resolve)
  },
  {
    path: '/customer',
    name: 'customer',
    meta: {
      title: '联系客服',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/my/customer.vue'], resolve)
  },
  {
    path: '/setting',
    name: 'setting',
    meta: {
      title: '设置',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/my/setting.vue'], resolve)
  },
  {
    path: '/collection',
    name: 'collection',
    meta: {
      title: '收款',
      changeLeft: true,
      card: true,
      navShow: true
    },
    component: (resolve : any) => require(['../views/collection.vue'], resolve)
  },
  {
    path: '/withdraw',
    name: 'withdraw',
    meta: {
      title: '提现',
      changeLeft: true,
      withdraw: true
    },
    component: (resolve : any) => require(['../views/my/withdraw.vue'], resolve)
  },
  {
    path: '/select',
    name: 'select',
    meta: {
      title: '选择卡片',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/collection/select.vue'], resolve)
  },
  {
    path: '/aisle',
    name: 'aisle',
    meta: {
      title: '选择通道',
      aisleLeft: true
    },
    component: (resolve : any) => require(['../views/collection/aisle.vue'], resolve)
  },
  {
    path: '/hbAisle',
    name: 'hbAisle',
    meta: {
      title: '选择通道',
      aisleLeft: true
    },
    component: (resolve : any) => require(['../views/collection/hbAisle.vue'], resolve)
  },
  {
    path: '/cardadmin',
    name: 'cardadmin',
    meta: {
      title: '卡片管理',
      aisleLeft: true
    },
    component: (resolve : any) => require(['../views/real/cardadmin.vue'], resolve)
  },
  {
    path: '/selectcard',
    name: 'selectcard',
    meta: {
      title: '选择卡片',
      selectcard: true
    },
    component: (resolve : any) => require(['../views/real/selectcard.vue'], resolve)
  },
  {
    path: '/commerce',
    name: 'commerce',
    meta: {
      title: '商学院',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/Information/commerce.vue'], resolve)
  },
  {
    path: '/cool',
    name: 'cool',
    meta: {
      title: '酷友圈',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/Information/cool.vue'], resolve)
  },
  {
    path: '/ifarme',
    name: 'ifarme',
    meta: {
      title: '协议',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/ifarme.vue'], resolve)
  },
  {
    path: '/repayment',
    name: 'repayment',
    meta: {
      title: '还款',
      changeLeft: true,
      navShow: true
    },
    component: (resolve : any) => require(['../views/repayment.vue'], resolve)
  },
  {
    path: '/intermediaryagency',
    name: 'intermediaryagency',
    meta: {
      title: '中介代还',
      intermediaryagency: true
    },
    component: (resolve : any) => require(['../views/my/intermediaryagency.vue'], resolve)
  },
  {
    path: '/deductionrecord',
    name: 'deductionrecord',
    meta: {
      title: '扣费记录',
      left: true
    },
    component: (resolve : any) => require(['../views/emptybond/deductionrecord.vue'], resolve)
  },
  {
    path: '/withdrawbond',
    name: 'withdrawbond',
    meta: {
      title: '我要提现',
      left: true
    },
    component: (resolve : any) => require(['../views/emptybond/withdrawbond.vue'], resolve)
  },
  {
    path: '/wanttorecharge',
    name: 'wanttorecharge',
    meta: {
      title: '我要充值',
      left: true
    },
    component: (resolve : any) => require(['../views/emptybond/wanttorecharge.vue'], resolve)
  },
  {
    path: '/emptyrepayment',
    name: 'emptyrepayment',
    meta: {
      title: '空卡还款',
      emptyrepayment: true
    },
    component: (resolve : any) => require(['../views/emptyrepayment.vue'], resolve)
  },
  {
    path: '/make',
    name: 'make',
    meta: {
      title: '制定计划',
      whiteLeft: true,
      keepAlive: true
    },
    component: (resolve : any) => require(['../views/plan/make.vue'], resolve)
  },
  {
    path: '/ykdhMake',
    name: 'ykdhMake',
    meta: {
      title: '一卡多还',
      left: true,
      keepAlive: true
    },
    component: (resolve : any) => require(['../views/plan/ykdhMake.vue'], resolve)
  },
  {
    path: '/realname',
    name: 'realname',
    meta: {
      title: '实名认证',
      realname: true
    },
    component: (resolve : any) => require(['../views/real/realname.vue'], resolve)
  },
  {
    path: '/ykdpre',
    name: 'ykdpre',
    meta: {
      title: '确认订单',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/plan/ykdpre.vue'], resolve)
  },
  {
    path: '/submit',
    name: 'submit',
    meta: {
      title: '提交计划',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/plan/submit.vue'], resolve)
  },
  {
    path: '/exhaustive',
    name: 'exhaustive',
    meta: {
      title: '查看计划',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/plan/exhaustive.vue'], resolve)
  },
  {
    path: '/particular',
    name: 'particular',
    meta: {
      title: '详细计划',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/plan/particular.vue'], resolve)
  },
  {
    path: '/matter',
    name: 'matter',
    meta: {
      title: '查看资料',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/plan/matter.vue'], resolve)
  },
  {
    path: '/addcard',
    name: 'addcard',
    meta: {
      title: '信用卡认证',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/plan/addcard.vue'], resolve)
  },
  {
    path: '/adduser',
    name: 'adduser',
    meta: {
      title: '添加用户',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/real/adduser.vue'], resolve)
  },
  {
    path: '/adduserreal',
    name: 'adduserreal',
    meta: {
      title: '添加客户',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/real/adduserreal.vue'], resolve)
  },
  {
    path: '/makeplan',
    name: 'makeplan',
    meta: {
      title: '制定计划',
      makeplan: true
    },
    component: (resolve : any) => require(['../views/real/makeplan.vue'], resolve)
  },
  {
    path: '/checkplan',
    name: 'checkplan',
    meta: {
      title: '查看计划',
      checkplan: true
    },
    component: (resolve : any) => require(['../views/real/checkplan.vue'], resolve)
  },
  {
    path: '/addposition',
    name: 'addposition',
    meta: {
      title: '增加卡位',
      addposition: true
    },
    component: (resolve : any) => require(['../views/real/addposition.vue'], resolve)
  },
  {
    path: '/tiedcard',
    name: 'tiedcard',
    meta: {
      title: '通道绑卡',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/plan/tiedcard.vue'], resolve)
  },
  {
    path: '/code',
    name: 'code',
    meta: {
      title: '扫码支付',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/member/code.vue'], resolve)
  },
  {
    path: '/preview',
    name: 'preview',
    meta: {
      title: '详细计划',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/plan/preview.vue'], resolve)
  },
  {
    path: '/message',
    name: 'message',
    meta: {
      title: '消息通知',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/Information/message.vue'], resolve)
  },
  {
    path: '/renew',
    name: 'renew',
    meta: {
      title: '绑定信息',
      left: true
    },
    component: (resolve : any) => require(['../views/real/renew.vue'], resolve)
  },
  {
    path: '/systemnotice',
    name: 'systemnotice',
    meta: {
      title: '公告详情',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/Information/systemnotice.vue'], resolve)
  },
  {
    path: '/realcard',
    name: 'realcard',
    meta: {
      title: '实名认证',
      whiteLeft: true
    },
    component: (resolve : any) => require(['../views/real/realcard.vue'], resolve)
  },
  {
    path: '/changetheme',
    name: 'changetheme',
    meta: {
      title: '更换主题',
      left: true
    },
    component: (resolve : any) => require(['../views/my/changetheme.vue'], resolve)
  },
  {
    path: '/dragonlist',
    name: 'dragonlist',
    meta: {
      title: '排行榜',
      left: true
    },
    component: (resolve : any) => require(['../views/dragonlist.vue'], resolve)
  },
  {
    path: '/credence',
    name: 'credence',
    meta: {
      title: '大数据查询',
      left: true,
      credence: true
    },
    component: (resolve : any) => require(['../views/measure/credence.vue'], resolve)
  },
  {
    path: '/credit',
    name: 'credit',
    meta: {
      title: '信用卡测评',
      left: true,
      credit: true,
      keepAlive: true
    },
    component: (resolve : any) => require(['../views/measure/credit.vue'], resolve)
  },
  {
    path: '/creditlist',
    name: 'creditlist',
    meta: {
      title: '查询记录',
      left: true
    },
    component: (resolve : any) => require(['../views/measure/creditlist.vue'], resolve)
  },
  {
    path: '/credenlist',
    name: 'credenlist',
    meta: {
      title: '查询记录',
      left: true
    },
    component: (resolve : any) => require(['../views/measure/credenlist.vue'], resolve)
  },
  {
    path: '/paycopy',
    name: 'paycopy',
    meta: {
      title: '支付',
      left: true
    },
    component: (resolve : any) => require(['../views/member/paycopy.vue'], resolve)
  },
  {
    path: '/shoparea',
    name: 'shoparea',
    meta: {
      title: '购物区',
      left: true
    },
    component: (resolve : any) => require(['../views/market/shoparea.vue'], resolve)
  },
  {
    path: '/productdetails',
    name: 'productdetails',
    meta: {
      title: '商品详情',
      left: true
    },
    component: (resolve : any) => require(['../views/market/productdetails.vue'], resolve)
  },
  {
    path: '/server',
    name: 'server',
    meta: {
      title: '我的客服',
      left: true
    },
    component: (resolve : any) => require(['../views/market/server.vue'], resolve)
  },
  {
    path: '/ordersure',
    name: 'ordersure',
    meta: {
      title: '订单确认页',
      left: true
    },
    component: (resolve : any) => require(['../views/market/ordersure.vue'], resolve)
  },
  {
    path: '/shopAddress',
    name: 'shopAddress',
    meta: {
      title: '收货地址',
      left: true
    },
    component: (resolve : any) => require(['../views/market/shopAddress.vue'], resolve)
  },
  {
    path: '/addAddress',
    name: 'addAddress',
    meta: {
      title: '添加地址',
      left: true
    },
    component: (resolve : any) => require(['../views/market/addAddress.vue'], resolve)
  },
  {
    path: '/editAddress',
    name: 'editAddress',
    meta: {
      title: '修改地址',
      left: true
    },
    component: (resolve : any) => require(['../views/market/editAddress.vue'], resolve)
  },
  {
    path: '/myshopdetail',
    name: 'myshopdetail',
    meta: {
      title: '我的订单',
      left: true
    },
    component: (resolve : any) => require(['../views/market/myshopdetail.vue'], resolve)
  },
  {
    path: '/feudallord',
    name: 'feudallord',
    meta: {
      title: '领主',
      left: true
    },
    component: (resolve : any) => require(['../views/laird/feudallord.vue'], resolve)
  },
  {
    path: '/feudalpage',
    name: 'feudalpage',
    meta: {
      title: '领主',
      left: true
    },
    component: (resolve : any) => require(['../views/laird/feudalpage.vue'], resolve)
  },
  {
    path: '/ranking',
    name: 'ranking',
    meta: {
      title: '收益排行',
      left: true
    },
    component: (resolve : any) => require(['../views/laird/ranking.vue'], resolve)
  },
  {
    path: '/myfeudal',
    name: 'myfeudal',
    meta: {
      title: '我的',
      left: true
    },
    component: (resolve : any) => require(['../views/laird/myfeudal.vue'], resolve)
  },
  {
    path: '/bidrecord',
    name: 'bidrecord',
    meta: {
      title: '中标记录',
      left: true
    },
    component: (resolve : any) => require(['../views/laird/bidrecord.vue'], resolve)
  },
  {
    path: '/application',
    name: 'application',
    meta: {
      title: '申请领主',
      left: true
    },
    component: (resolve : any) => require(['../views/laird/application.vue'], resolve)
  },
  {
    path: '/selcity',
    name: 'selcity',
    meta: {
      title: '选择城市',
      left: true
    },
    component: (resolve : any) => require(['../views/laird/selcity.vue'], resolve)
  },
  {
    path: '/selarea',
    name: 'selarea',
    meta: {
      title: '选择地区',
      left: true
    },
    component: (resolve : any) => require(['../views/laird/selarea.vue'], resolve)
  },
  {
    path: '/choosecard',
    name: 'choosecard',
    meta: {
      title: '卡包',
      left: true
    },
    component: (resolve : any) => require(['../views/laird/choosecard.vue'], resolve)
  },
  {
    path: '/feuwithdraw',
    name: 'feuwithdraw',
    meta: {
      title: '提现',
      left: true
    },
    component: (resolve : any) => require(['../views/laird/feuwithdraw.vue'], resolve)
  },
  {
    path: '/feuwithdlist',
    name: 'feuwithdlist',
    meta: {
      title: '提现记录',
      left: true
    },
    component: (resolve : any) => require(['../views/laird/feuwithdlist.vue'], resolve)
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

export default router
