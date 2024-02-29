import Vue, {createApp} from "vue";
import AppTest from "./AppTestUi.vue";

const app = createApp(AppTest);
app.mount('#app');

app.config.globalProperties.productionTip = false;
