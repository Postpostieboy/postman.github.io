import {Application, IAppModule, injectable, Log} from "mcdis-app";
import {Web3} from "web3";

@injectable('web3-provider')
export class Web3Provider {
  constructor() {
    this.web3 = new Web3("https://cloudflare-eth.com");
  }

  public readonly web3: Web3;
}

export class Web3ProviderModule implements IAppModule {
  configure?(_app: Application, _log: Log): void {
    _app.container.exportSingletone(Web3Provider);
  }
}