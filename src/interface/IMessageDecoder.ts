export interface IMessageDecoder {
  canDecode(_encoding: string): boolean;

  tryDecodeAsync(_encoding: string, _data: Uint8Array): Promise<string | undefined>;
}