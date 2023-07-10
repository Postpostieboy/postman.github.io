import App from './App.vue';
import 'mcdis-app-ui/style.css';
import {AppThemeDefaultPaletteModule, AppThemeModule, AppTitleModule, AppUiModule} from "mcdis-app-ui";
import {Application} from "mcdis-app";
import {ShotsViewModule} from "@/modules/shotsView";
import {Web3ProviderModule} from "@/modules/web3Provider";
import {PlaneContainerModule} from "@/modules/planeContainer";
import {MessageDecoderRegistryModule} from "@/modules/messageDecoderRegistry";
import {PlaneBulletModule} from "@/modules/planeBullet";
import {Buffer} from "buffer";

window.Buffer = window.Buffer || Buffer;

const app = new Application();

app
  .use(new AppUiModule())
  .use(new AppThemeModule())
  .use(new AppThemeDefaultPaletteModule())
  .use(new AppTitleModule("The Plane"));

app
  .use(new MessageDecoderRegistryModule())
  .use(new Web3ProviderModule())
  .use(new PlaneContainerModule())
  .use(new PlaneBulletModule())
  .use(new ShotsViewModule());

app.vueRootComponent = App;
app.vueMountNode = '#app';

// --------------------------------
// run
// --------------------------------
app.runAsync();