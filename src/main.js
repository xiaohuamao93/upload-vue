import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import host from "../utils/address";

import async from "async";
Vue.prototype.$async = async;

Vue.config.productionTip = false;

Vue.prototype.$host = host;

Vue.use(VueAxios, axios);

Vue.use(ElementUI);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
