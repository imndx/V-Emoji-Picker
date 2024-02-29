<template>
  <span :class="['emoji-c', { 'border': withBorder } ]" :style="styleSize" v-html="uemoji(emoji.data)"/>
</template>

<script lang="ts">
import {IEmoji} from "@/models/Emoji";
import uEmojiParser from 'universal-emoji-parser';
import { defineComponent, PropType } from "vue";

export default defineComponent({
  computed: {
        styleSize() {
            return {
              fontSize: `${this.size - 5}px`,
              lineHeight: `${this.size}px`,
              height: `${this.size}px`,
              width: `${this.size}px`
            };
        }
    },
    methods: {
        uemoji(data) {
            let tmp = uEmojiParser.parse(data);
            // window.__twemoji_base_url__ = 'https://static.wildfirechat.net/twemoji/assets/';
            if(window.hasOwnProperty('__twemoji_base_url__')){
              tmp = tmp.replace(/src="https:\/\/twemoji\.maxcdn\.com\/v\/[0-9.]+\//g, 'src="' + window.__twemoji_base_url__);
            }
            return tmp;
        }
    },
    props: {
        emoji: {
            type: Object as PropType<IEmoji>
        },
        size: {
            type: Number,
            required:true
        },
        withBorder: {
            type: Boolean
        }
    }
});

</script>

<style lang="css" scoped>
.emoji-c {
  text-align: center;
  padding: 3px;
  box-sizing: content-box;
  overflow: hidden;
  transition: transform 0.2s;

  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

}
.emoji-c:hover {
  transform: scale(1.15);
}

.emoji-c ::v-deep img {
  width: 28px;
  height: 28px;
}

.border:hover {
  background: #00000010;
  border-radius: 8px;
}
</style>
