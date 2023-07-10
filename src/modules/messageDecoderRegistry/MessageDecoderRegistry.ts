import {IMessageDecoder, IMessageDecoderRegistry} from "../../interface";
import {injectable} from "mcdis-app";

@injectable('message-decoder-registry')
export class MessageDecoderRegistry implements IMessageDecoderRegistry {
  private readonly p_decoders: IMessageDecoder[] = [];

  public register(_decoder: IMessageDecoder): this {
    this.p_decoders.push(_decoder);
    return this;
  }

  public async tryDecodeAsync(_encoding: string, _data: Uint8Array): Promise<string | undefined>{
    for (const decoder of this.p_decoders) {
      if (!decoder.canDecode(_encoding))
        continue;
      const res = await decoder.tryDecodeAsync(_encoding, _data);
      if (res !== undefined)
        return res;
    }
    return undefined;
  }
}

export function useMessageDecoderRegistry() {
  return new MessageDecoderRegistry();
}