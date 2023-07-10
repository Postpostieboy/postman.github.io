import {Application, IAppModule, IContainer, injectable, Log} from "mcdis-app";
import {PlaneContainer} from "@/modules/planeContainer";
import {BulletApi} from "@/api/BulletApi";
import {MessageDecoderRegistry} from "@/modules/messageDecoderRegistry/MessageDecoderRegistry";

@injectable('plane-bullet')
export class PlaneBullet {
  private readonly p_container :IContainer;
  private p_api:BulletApi | undefined;
  constructor(_container: IContainer) {
    this.p_container = _container;
  }

  public async getApiAsync() {
    if(this.p_api !== undefined)
      return this.p_api;

    const planeContainer = this.p_container.locate(PlaneContainer);
    const msgDecoderRegistry = this.p_container.locate(MessageDecoderRegistry);
    this.p_api = await BulletApi.resolveAsync(planeContainer.api,msgDecoderRegistry);
    return this.p_api;
  }
}

export class PlaneBulletModule implements IAppModule {
  configure?(_app: Application, _log: Log): void {
    _app.container.exportSingletone(PlaneBullet);
  }
}