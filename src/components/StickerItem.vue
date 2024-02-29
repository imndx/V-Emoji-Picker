<template>
  <img :class="['sticker', { 'border': withBorder } ]" :style="styleSize" :src="emoji.data"  alt=""/>
</template>

<script lang="ts">
import { IEmoji } from "@/models/Emoji";
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
    props: {
        emoji: {
            type: Object as PropType<IEmoji>
        },
        size: {
          required:true,
            type: Number
        },
        withBorder: {
            type: Boolean
        }
    }
});

</script>

<style lang="scss" scoped>
.sticker {
  display: inline-block;
  text-align: center;
  padding: 3px;
  box-sizing: content-box;
  overflow: hidden;
  transition: transform 0.2s;

  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
}

.border:hover {
  background: #00000010;
  border-radius: 8px;
}
</style>
