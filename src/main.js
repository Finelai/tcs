/* eslint-disable */

import Vue from 'vue';

import './assets/scss/_global.scss';

// element
import {
  Button,
  Message,
  MessageBox,
  Row,
  Col,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Tabs,
  TabPane,
  Switch,
  Table,
  TableColumn,
  Badge,
  Card,
  Rate,
  Form,
  FormItem,
  Input,
  Icon,
  Carousel,
  CarouselItem,
  Loading,
} from 'element-ui';
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';

locale.use(lang);

import '../config/firebase';
import firebase from 'firebase';
import VueFire from 'vuefire';

import App from './App';
import router from './router';

import Vue2Filters from 'vue2-filters';

Vue.component(Icon.name, Icon);
Vue.component(Button.name, Button);
Vue.component(Carousel.name, Carousel);
Vue.component(CarouselItem.name, CarouselItem);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Input.name, Input);
Vue.component(Row.name, Row);
Vue.component(Col.name, Col);
Vue.component(Container.name, Container);
Vue.component(Header.name, Header);
Vue.component(Aside.name, Aside);
Vue.component(Main.name, Main);
Vue.component(Footer.name, Footer);
Vue.component(Menu.name, Menu);
Vue.component(Submenu.name, Submenu);
Vue.component(MenuItem.name, MenuItem);
Vue.component(MenuItemGroup.name, MenuItemGroup);
Vue.component(Tabs.name, Tabs);
Vue.component(TabPane.name, TabPane);
Vue.component(Switch.name, Switch);
Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);
Vue.component(Badge.name, Badge);
Vue.component(Card.name, Card);
Vue.component(Rate.name, Rate);

Vue.use(Loading.directive);

Vue.prototype.$message = Message;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$loading = Loading.service;

// Vue.use(require('vue-script2'));
Vue.use(VueFire);
Vue.use(Vue2Filters);
Vue.config.productionTip = false;

let app;

firebase.auth().onAuthStateChanged(function(user) {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      components: { App },
      template: '<App/>',
    });
  }
});


/* Global Mixin */

Vue.mixin({
  methods: {
    follow(type, name) {
      if (type === 'user') {
        this.$message({
          message: `Вы подписались на обновления участника ${name}`,
          type: 'success',
        });
      } else if (type === 'stream') {
        this.$message({
          message: `Вы подписались на оповещение о стриме ${name}`,
          type: 'success',
        });
      } else {
        this.$message({
          message: 'Упс. Что-то пошло не так',
          type: 'error',
        });
      }
    },
  },
});
