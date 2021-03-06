import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
// Directives
import "./directives/vue-the-mask";

// Filters
import "./util/filters/vue-currency";
import "./util/filters/vue-datefns";
import "./util/filters/vue-strip";

import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(VueAxios, axios);

import UserStore from "./store/user/user-store";

Vue.config.productionTip = false;

(async () => {
  await UserStore.init();
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount("#app");
})();
