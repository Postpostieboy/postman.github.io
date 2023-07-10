import {IMessageDecoder} from "@/interface";
import {utils} from "web3";

export class RawMessageDecoder implements IMessageDecoder {
  public canDecode(_encoding: string): boolean {
    return _encoding === 'RAW';
  }

  public async tryDecodeAsync(_encoding: string, _data: Uint8Array): Promise<string | undefined> {
    return utils.hexToUtf8(utils.bytesToHex(_data));
  }
}