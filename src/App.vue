<template>
  <grid cols="1fr"
        height="100vh"
        rows="1fr"
        style="overflow: hidden;background: #262320"
        width="100vw">
    <grid
        margin="1rem"
        radius="1rem"
        pad="1rem"
        style="overflow: hidden;background: #26281C;box-shadow: inset 0 0 30px #0909097a"
    >

      <grid cols="20rem 1fr"
            gap="1rem"
            height="100%"
            rows="auto 1fr"
            width="100%">

        <panel row="1" col="1/-1">
          <text-label color="#D6532D" font-size="1.5rem" style="text-shadow: 0px 0px 12px rgba(235, 89, 46, 0.8)">
            THE PLANE
          </text-label>
        </panel>

        <div
            style="grid-row: 2; grid-column: 1; width: 100%;height: 100%;overflow-y: auto;overflow-x: hidden;word-break: break-all">
          <template v-for="info of channels">
            <h-stack style="background: transparent; width: 100%" align="center" @click="navigateToChannel(info.id)">
              <template v-if="info.id == activeChannel">

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="2rem" height="2rem"
                     style="fill: #1765E3;filter: drop-shadow(0 0 3px #1051b9);">
                  <path
                      d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z"/>
                </svg>
                <text-label class="active">
                  {{ info.title }}
                </text-label>
              </template>
              <template v-else>
                <text-label class="inactive">
                  {{ info.title }}
                </text-label>
              </template>
            </h-stack>
          </template>
        </div>
        <div style="grid-row: 2; grid-column: 2;width: 100%;height: 100%;overflow: auto">
          <text-label v-if="activeChannel == undefined || activeChannel < 0"
                      color="white">
            Please select channel...
          </text-label>
          <router-view :key="activeChannel"/>
        </div>
      </grid>
    </grid>
  </grid>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import {IChannelInfo} from "@/api";
import {useAppRoot} from "mcdis-app";
import {PlaneBullet} from "@/modules/planeBullet";
import {CachelessRouterView, Grid, HStack, Panel, TextLabel} from "mcdis-app-ui";

const app = useAppRoot();
const channels = reactive(new Array<IChannelInfo>());
const activeChannel = computed(() => app.router?.currentRoute.value?.params.channelId);

function navigateToChannel(_channelId: number) {
  app.router?.push({
    name: 'channel',
    params: {
      channelId: _channelId
    }
  });
}

onMounted(() => {
  setTimeout(async () => {
    const bullet = await app.locate(PlaneBullet).getApiAsync();

    for await(const channelInfo of bullet.listChannelsAsync())
      channels.push(channelInfo);

    // const ethereum: any = (window as any).ethereum;
    // if (ethereum != null) {
    //   const web3 = new Web3(ethereum);
    //   try {
    //     // Request account access if needed
    //     await ethereum.enable();
    //
    //     // Accounts now exposed
    //   } catch (error) {
    //     // User denied account access...
    //   }
    // }
  });
});
</script>

<style lang="scss" scoped>
.active {
  color: #65ce42;
  background: transparent;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  text-shadow: 0px 0px 12px rgba(67, 129, 46, 0.76);
  transition: background 200ms ease-out;
}

.inactive {
  color: #809f75;
  background: transparent;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  text-shadow: 0px 0px 12px rgba(65, 94, 56, 0.56);
  transition: background 200ms ease-out;
}

.inactive:hover {
  color: #D6532D;
  background: rgba(255, 255, 0, 0.75);
  text-shadow: 0px 0px 12px #D6532D;
  cursor: pointer;
}
</style>