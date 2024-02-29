<template>
  <div>
    <div>
      <VEmojiPicker :customEmojis="emojis" :customCategories="categories" :continuousList="false" @select="selectEmoji"
                    v-if="visible" :dark="false"/>
    </div>
    <button @click="changeEmojis">Change</button>
    <button @click="changeVisibleEmojis">Toogle View</button>
  </div>
</template>

<script lang="ts">
import {VEmojiPicker, emojisDefault, categoriesDefault} from "./index";
import {defineComponent} from "vue";

export default defineComponent({
  name: "AppTestUI",
  components: {
    VEmojiPicker
  },
  data() {
    return {
      emojis: emojisDefault,
      categories: categoriesDefault,
      visible: true
    };
  },
  methods: {
    changeEmojis() {
      this.emojis = emojisDefault.slice(0, 8);
    },
    changeVisibleEmojis() {
      this.visible = !this.visible;
    },
    selectEmoji(emoji) {
      // console.log('select emoji', emoji.data);
    }
  }
});

</script>

<style lang='scss' scoped>
</style>
