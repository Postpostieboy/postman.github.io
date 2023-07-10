import ContainerInterface from "@/abi/container.json";

import {Contract, utils, Web3} from "web3";
import {ContractAbi} from "web3-types";

const CONTAINER_ADDRESS = "0x41d4cbe5070a88658a683896e8bf08e99fd51fe4";

export class ContainerApi {
  private readonly p_web3: Web3;
  private p_contract: Contract<any>;

  constructor(_web3: Web3) {
    this.p_web3 = _web3;
    this.p_contract = new Contract(ContainerInterface.abi,CONTAINER_ADDRESS , this.p_web3);
  }

  public get web3() {
    return this.p_web3;
  }

  public async resolveAsync(_serviceId: string, _abi: ContractAbi): Promise<Contract<any>> {
    if (_serviceId.length > 16)
      throw new Error('Out of range. Service id length have to be less or equals than 16');

    const srvId = utils.asciiToHex(_serviceId).padEnd(32 + 2, "0"); // 0x + ...

    // @ts-ignore
    const address: string = await this.p_contract.methods.resolve(srvId).call();

    return new Contract(_abi, address, this.p_web3);
  }
}
export function useContainerApi(_web3: Web3) {
  return new ContainerApi(_web3);
}