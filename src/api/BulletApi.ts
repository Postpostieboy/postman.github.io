import {BulletChannel} from "@/api/BulletChannel";
import {Contract, utils, Web3} from "web3";
import BulletInterface from "./../abi/bullet.json";
import {ContainerApi} from "@/api/ContainerApi";
import {IMessageDecoderRegistry} from "@/interface";

export const BULLET_API_SERVICE_ID = "BULLET.1";

export interface IChannelInfo {
  id: number,
  origin: string;
  title: string;
  shotsCount: number;

  resolveApi(): BulletChannel;
}

export type ListChannelRecord = {
  origin: string;
  title: string;
  shotsCount: number;
}


export class BulletApi {
  private readonly p_contract: Contract<any>;
  private readonly p_web3: Web3;
  private readonly p_decoderRegistry: IMessageDecoderRegistry;

  public static async resolveAsync(_container: ContainerApi, _decoderRegistry: IMessageDecoderRegistry) {
    const contract = await _container.resolveAsync(BULLET_API_SERVICE_ID, BulletInterface.abi);
    return new BulletApi(contract, _container.web3, _decoderRegistry);
  }

  private constructor(_contract: Contract<any>, _web3: Web3, _decoderRegistry: IMessageDecoderRegistry) {
    this.p_web3 = _web3;
    this.p_contract = _contract;
    this.p_decoderRegistry = _decoderRegistry;
  }

  public async getChannelAsync(_channelId:number){

    // @ts-ignore
    const origin: string = await this.p_contract.methods.getChannel(_channelId).call();

    return new BulletChannel(origin, this.p_web3, this.p_decoderRegistry);
  }
  public async* listChannelsAsync(_offset: number = 0, _page: number = 32): AsyncGenerator<IChannelInfo> {
    let i = _offset;

    while (true) {

      // @ts-ignore
      const data: Array<any> = await this.p_contract.methods.listChannels(i, _page).call();

      let n = 0;
      for (const record of data) {
        const r: ListChannelRecord = record;
        const origin = r.origin;

        if (utils.toBigInt(origin) == BigInt(0))
          break;

        const shots = r.shotsCount;

        yield {
          id: i,
          origin: origin,
          title: utils.hexToUtf8(r.title),
          shotsCount: shots,
          resolveApi: () => new BulletChannel(origin, this.p_web3, this.p_decoderRegistry)
        };

        i++;
        n++;
      }

      if (n < _page)
        break;
    }
  }
}