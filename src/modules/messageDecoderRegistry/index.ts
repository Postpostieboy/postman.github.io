import {Application, IAppModule, Log} from "mcdis-app";
import {MessageDecoderRegistry} from "@/modules/messageDecoderRegistry/MessageDecoderRegistry";
import {RawMessageDecoder} from "@/modules/messageDecoderRegistry/decoders";
import {BrotliMessageDecoder} from "@/modules/messageDecoderRegistry/decoders/BrotliMessageDecoder";

export class MessageDecoderRegistryModule implements IAppModule {
  configure?(_app: Application, _log: Log): void {
    _app.container.exportSingletone(MessageDecoderRegistry);
  }
  
  postWire(_app: Application, _log: Log) {
    _app
      .locate(MessageDecoderRegistry)
      .register(new RawMessageDecoder())
      .register(new BrotliMessageDecoder());
  }
}