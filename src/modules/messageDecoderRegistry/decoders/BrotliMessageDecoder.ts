import {IMessageDecoder} from "@/interface";
import {utils} from "web3";
import {brotliDecode} from "./parts/decode";

export class BrotliMessageDecoder implements IMessageDecoder {
  public canDecode(_encoding: string): boolean {
    return _encoding === 'BR';
  }

  public async tryDecodeAsync(_encoding: string, _data: Uint8Array): Promise<string | undefined> {
    try {
      const decoded2 = brotliDecode(Int8Array.from(_data));

      return utils.hexToUtf8(utils.bytesToHex(Uint8Array.from(decoded2)));
    } catch {
      return undefined;
    }
  }
}