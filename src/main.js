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
  updated() {
    // функция для подкрашивания рейтинга в цвет в зависимости от его величины
    this.$nextTick(function () {
      if (document.querySelectorAll('.raiting_colorize').length) {
        const allRaitings = document.querySelectorAll('.raiting_colorize');
        const allRaitingsLength = allRaitings.length;
        for (let n = 0; n < allRaitingsLength; n++) {
          const curRaiting = allRaitings[n].firstElementChild.nextElementSibling.innerText;
          if (curRaiting > 9) {
            // uncommon (green)
            let raitingColor = `rgb(0,1${curRaiting},77)`;

            if (curRaiting > 99 && curRaiting < 200) {
              // rare (blue)
              raitingColor = `rgb(0,100,${curRaiting})`;
            } else if (curRaiting > 199 && curRaiting < 300) {
              // epic (magenta)
              raitingColor = `rgb(150,0,${curRaiting - 50})`;
            } else if (curRaiting > 299 && curRaiting < 500) {
              // hot (red)
              raitingColor = `rgb(${curRaiting - 250},0,0)`;
            } else if (curRaiting > 499) {
              // legendary (gold)
              raitingColor = '#DB9E1C';
            }

            allRaitings[n].style.color = raitingColor;
          }
        }
      }
    });
  },
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
