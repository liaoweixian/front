<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import mqtt from 'mqtt'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader,
      user: state => state.user.user
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile',
        doors: this.doors
      }
    }
  },
  created() {
    
  },
  mounted() {
    this.connection()
  },
  destroyed() {
    this.disconnect()
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    connection() {
      const URL = '47.98.228.109'
      var options = {
        // 如果连接在此秒数内未成功，则视为已失败
        // connectTimeout: 10,
        // 如果存在且为true，则使用SSL Websocket连接
        // useSSL: useTLS,
        // 如果此秒数内没有活动，服务器将断开此客户端的连接
        keepalive: 60,
        // session 标志位，当 clean session = false 时，
        // client 失去连接时， broker 会一直保留消息直到 client 重新连接。
        // 而 clean session = true 时，broker 会清除所有的消息当这个 client 失去连接。
        // clean: cleansession,
        username: 'xs-front',
        password: '',
        clientId: 'xs-' + new Date()
      }
      const client = mqtt.connect(`mqtt://${URL}:8083/mqtt`)
      let _this = this
      // 连接
      client.on('connect', () => {
        console.log('连接' + new Date())
        setTimeout(() => {
          // 订阅端口
          // 客户消息订阅
          client.subscribe('/member/info/' + _this.user.id, { qos: 1 }, function(err) {
            if (!err) {
              console.error('订阅成功: ' + '/member/info/' + _this.user.id)
            } else {
              console.error('订阅失败: ' + err)
            }
          })
          // 只有仓库管理员才订阅
          if (_this.user.username.startsWith('cg')) {
            client.subscribe('/order/prompt/', { qos: 1 }, function(err) {
              if (!err) {
                console.error('订阅成功: ' + '/order/prompt/')
              } else {
                console.error('订阅失败: ' + err)
              }
            })
          }
        }, 1500)
      })
      // 获取到消息
      client.on('message', (topic, message) => {
        // message is Buffer
        /* console.log('======================================')
        console.log(topic)
        console.log(message.toString()) */

        if (topic === '/order/prompt/') {
          this.$notify({
            title: '提示',
            message: '你有一条订单待处理，请到订单列表查看',
            duration: 0
          })
        } else {
          const data = JSON.parse(message.toString())
          this.$store.dispatch('SendWebsocketData', data)
        }
      })
      // 断开自动重连
      client.on('close', () => {
        console.log('close重新连接' + new Date())
      })
    },
    disconnect() {
      if (this.stompClient != null) {
        this.stompClient.disconnect()
        console.log('Disconnected')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/mixin.scss";
  @import "~@/assets/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
    padding: 0;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
