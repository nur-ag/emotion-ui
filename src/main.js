// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueTimeago from 'vue-timeago'
import Clipboard from 'v-clipboard'

// Use Buefy
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(Buefy, {
  defaultIconPack: 'fas'
})

Vue.use(VueTimeago, {
  name: 'Timeago',
  locale: 'en'
})

Vue.use(Clipboard)
Vue.config.productionTip = process.env.NODE_ENV === 'production'
Vue.prototype.$hostname = 'http://localhost:8020' // (Vue.config.productionTip) ? 'http://80.93.90.105:8020' : 'http://localhost:8020'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
