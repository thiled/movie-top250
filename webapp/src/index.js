let App = () => VueScooter.load('app.vue');
Vue.use(Vuetify);
let vuetify = new Vuetify({
});
new Vue({
  el: '#app',
  vuetify,
  render: (h) => h(App),
});
