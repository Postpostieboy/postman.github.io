export interface IMessageDecoderRegistry {
  tryDecodeAsync(_encoding: string, _data: Uint8Array): Promise<string | undefined>;
}