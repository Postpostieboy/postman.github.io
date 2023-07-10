import {Application, IAppModule, Log} from "mcdis-app";
import {RouteRecordRaw} from "vue-router";
import ShotsView from './view/ShotsView.vue';

export class ShotsViewModule implements IAppModule {
  routes?(_routes: Array<RouteRecordRaw>, _app: Application, _log: Log): void {
    _routes.push({
      name: 'channel',
      path: '/channel/:channelId',
      component: ShotsView,
      props: true
    });
  }
}