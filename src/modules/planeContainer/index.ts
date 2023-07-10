import {Application, IAppModule, IContainer, injectable, Log} from "mcdis-app";
import {Web3Provider} from "@/modules/web3Provider";
import {Lazy, lazy} from "mcdis-design";
import {ContainerApi} from "@/api";

@injectable('plane-container')
export class PlaneContainer {
  private readonly p_api: Lazy<ContainerApi>;

  constructor(_container: IContainer) {
    this.p_api = lazy(() => {
      const web3Provider = _container.locate(Web3Provider);
      const web3 = web3Provider.web3;
      return new ContainerApi(web3);
    })
  }

  public get api() {
    return this.p_api.value;
  }
}

export class PlaneContainerModule implements IAppModule {
  configure?(_app: Application, _log: Log): void {
    _app.container.exportSingletone(PlaneContainer);
  }
}