let App = () => VueScooter.load('app.vue');
Vue.use(Vuetify);
let vuetify = new Vuetify({
  icons: {
    iconfont: 'mdi', // default - only for display purposes
  },
});
new Vue({
  el: '#app',
  vuetify,
  render: (h) => h(App),
});
