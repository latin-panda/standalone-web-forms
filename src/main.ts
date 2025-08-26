import { createApp } from 'vue';
import './style.css'
import App from './App.vue'
import { webFormsPlugin } from '@getodk/web-forms';

const app = createApp(App);
app.use(webFormsPlugin);
app.mount('#app');
