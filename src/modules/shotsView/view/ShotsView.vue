<template>
  <h-stack align="center" justify="center" v-if="loaded === false && shots.length === 0">
    <spinner size="xl"/>
  </h-stack>
  <template v-else>
    <template v-for="(shot,index) of shots" :key="index">
      <v-stack justify-self="stretch">
        <span class="date">{{ shot.date.toLocaleString(DateTime.DATE_FULL) }}</span>
        <h-stack align="start" gap justify-self="stretch">
          <text-label class="time"
                      radius="0.5rem"
                      color="#3186ee"
                      pad="0.1rem 0.5rem"
                      font-size="0.9em"
                      background="#172028"
                      style="text-shadow: 1px -1px 4px #1830C9;">
            {{ shot.date.toLocaleString(DateTime.TIME_24_SIMPLE) }}
          </text-label>
          <text-label color="#e0e0e0" v-html="shot.body"/>
        </h-stack>
      </v-stack>
    </template>
  </template>
</template>


<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {useAppRoot} from "mcdis-app";
import {PlaneBullet} from "@/modules/planeBullet";
import {ChannelMsgType} from "@/api";
import {DateTime} from "luxon";
import {HStack, Spinner, TextLabel, VStack} from "mcdis-app-ui";

const props = defineProps({
  channelId: {
    type: [Number, String],
    required: true
  }
});

type Shot = {
  date: DateTime,
  timestamp: number,
  body: string,
  type: ChannelMsgType
}

const app = useAppRoot();

const shots = reactive<Shot[]>([]);
const loaded = ref(false);

onMounted(() => {
  setTimeout(async () => {
    const bulletApi = await app.locate(PlaneBullet).getApiAsync();
    const channel = await bulletApi.getChannelAsync(+props.channelId);

    const n = await channel.getShotCountAsync();

    for (let i = 0; i < n; i++) {
      const post = await channel.getShotAsync(i);
      let messageType = "unknown";

      switch (post.type) {
        case ChannelMsgType.System:
          messageType = 'system';
          break;
        case ChannelMsgType.User:
          messageType = 'user';
          break;
      }

      const body = await post.decodeAsync();

      if (body != undefined) {
        const timestamp = post.timestampUnixSecUtc * 1000;
        shots.push({
          date: DateTime.fromMillis(timestamp),
          timestamp: timestamp,
          body: body.replace(/(?:\r\n|\r|\n)/g, '</br>'),
          type: post.type
        });
      }
    }
    shots.sort((_x, _y) => _x.timestamp - _y.timestamp);

    loaded.value = true;
  }, 0);
});
</script>

<style lang="scss">

.postContainer {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.date {
  color: #DA3D1B;
  padding: 0.1rem 0.2rem;
  display: flex;
  text-shadow: 1px -1px 4px #1830C9
}
</style>