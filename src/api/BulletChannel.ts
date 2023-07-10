import {Bytes, Contract, utils, Web3} from "web3";
import BulletChannelInterface from "./../abi/bulletChannel.json";
import {IMessageDecoderRegistry} from "@/interface";

export enum ChannelMsgType {
  User = 0x55,
  System = 0x53
}

export class BulletChannel {
  private readonly p_contract: Contract<any>;
  private readonly p_registry: IMessageDecoderRegistry;

  constructor(_address: string, _web3: Web3, _registry: IMessageDecoderRegistry) {
    this.p_contract = new Contract(BulletChannelInterface.abi, _address, _web3);
    this.p_registry = _registry;
  }

  public async getShotCountAsync(): Promise<number> {
    const n = await this.p_contract.methods.getShotsCount().call();
    return Number(n);
  }

  public async getShotAsync(_index: number) {

    // @ts-ignore
    const raw: string = await this.p_contract.methods.getShot(_index).call();

    const shot: Bytes = utils.hexToBytes(raw);

    const view = new DataView(shot.buffer, 0);

    const timestampUnixSec = Number(view.getBigUint64(24, false));
    const date = new Date(timestampUnixSec * 1000);
    const postType = view.getInt8(32);
    const encoding = utils.hexToString(utils.bytesToHex(shot.slice(33, 33 + 8))).replace(/\0/g, '');
    const bodyRaw = shot.slice(33 + 8);
    console.error(utils.bytesToHex(bodyRaw));

    return {
      date,
      type: postType as ChannelMsgType,
      timestampUnixSecUtc: timestampUnixSec,
      encoding,
      bodyRaw,
      decodeAsync: () => this.p_registry.tryDecodeAsync(encoding, bodyRaw)
    };
  }
}