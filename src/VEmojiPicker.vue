<template>
  <div id="EmojiPicker" :class="['emoji-picker', {dark}]">
    <Categories
        v-if="showCategories"
        :categories="categoriesFiltered"
        :current="currentCategory"
        @select="changeCategory"
    />
    <InputSearch v-if="showSearch" @update="onSearch"/>
    <EmojiList
        :data="mapEmojis"
        :category="currentCategory"
        :filter="filterEmoji"
        :emojiWithBorder="emojiWithBorder"
        :emojiSize="emojiSize"
        :stickerSize="stickerSize"
        :emojisByRow="emojisByRow"
        :stickersByRow="stickersByRow"
        :continuousList="continuousList"
        :hasSearch="showSearch"
        @select="onSelectEmoji"
    />
  </div>
</template>

<script lang="ts">

import {Emoji, IEmoji} from "./models/Emoji";
import {ICategory} from "./models/Category";
import {MapEmojis} from "./models/MapEmojis";

import {emojisDefault} from "./utils/emojis";
import {categoriesDefault} from "./utils/categories";

import Categories from "./components/Categories.vue";
import EmojiList from "./components/EmojiList.vue";
import InputSearch from "./components/InputSearch.vue";

import locale from "./locale";
import {defineComponent} from "vue";

export default defineComponent({

  components: {
    Categories,
    EmojiList,
    InputSearch
  },
  emits:['select', 'changeCategory'],

  props: {
    customEmojis: {
      required: true,
      type: Array,
      default: emojisDefault
    },
    customCategories: {
      required: false,
      type: Array,
      default: categoriesDefault as ICategory[]
    },
    limitFrequently: {
      required: false,
      type: Number,
      default: 15
    },
    emojisByRow: {
      required: false,
      type: Number,
      default: 5
    },
    stickersByRow: {
      required: false,
      type: Number,
      default: 4
    },
    continuousList: {
      required: false,
      type: Boolean,
      default: false
    },
    emojiSize: {
      required: false,
      type: Number,
      default: 32,
    },
    stickerSize: {
      required: false,
      type: Number,
      default: 64,
    },
    emojiWithBorder: {
      required: false,
      type: Boolean,
      default: true
    },
    showSearch: {
      required: false,
      type: Boolean,
      default: true
    },
    showCategories: {
      required: false,
      type: Boolean,
      default: true
    },
    dark: {
      required: false,
      type: Boolean,
      default: false
    },
    initialCategory: {
      required: false,
      type: String,
      default: 'Peoples'
    },
    exceptCategories: {
      required: false,
      type: Array,
      default: [] as ICategory[]
    },
    exceptEmojis: {
      required: false,
      type: Array,
      default: [] as Emoji[]
    },
    i18n: {
      required: false,
      type: Array,
      default: Object
    },

  },

  data() {
    return {
      mapEmojis: {} as MapEmojis,
      currentCategory: this.initialCategory,
      filterEmoji: "",
    };
  },

  created() {
    const categoriesNames = (this.customCategories as ICategory[]).map(c => c.name);
    if (!categoriesNames.includes(this.initialCategory)) {
      // TODO
      //this.initialCategory = categoriesNames[0];
      this.currentCategory = categoriesNames[0];
    }

    // Create map
    this.mapperEmojisCategory(this.customEmojis as IEmoji[]);
    this.restoreFrequentlyEmojis();

    // Configure i18n
    if (this.i18n) {
      locale.i18n(this.i18n);
    }
  },

  beforeUnmount() {
    this.mapEmojis = {};
  },

  methods: {
    async onSearch(term: string) {
      this.filterEmoji = term;
    },

    async changeCategory(category: ICategory) {
      const hasEmojis = this.mapEmojis[category.name].length;
      this.currentCategory = category.name;

      if (hasEmojis) {
        await this.onChangeCategory(category);
      }
    },


    async updateFrequently(emoji: IEmoji) {
      if (emoji.data.startsWith("http")) {
        return;
      }
      const oldEmojis = this.mapEmojis["Frequently"];
      const emojis = [...new Set([emoji, ...oldEmojis])];

      this.mapEmojis["Frequently"] = emojis.slice(0, this.limitFrequently);

      await this.saveFrequentlyEmojis(emojis);
    },

    async mapperEmojisCategory(emojis: IEmoji[]) {
      // this.$set(this.mapEmojis, "Frequently", []);
      this.mapEmojis.Frequently = [];

      emojis
          .filter(emoji => !this.exceptEmojis.includes(emoji))
          .forEach(emoji => {
            const _category = emoji.category;

            if (!this.mapEmojis[_category]) {
              //this.$set(this.mapEmojis, _category, []);
              this.mapEmojis[_category] =  [];
            }

            this.mapEmojis[_category].push(emoji);
          });
    },
    async restoreFrequentlyEmojis() {
      const jsonMapIndexEmojis = localStorage.getItem("frequentlyEmojis");

      const mapIndexEmojis = JSON.parse(jsonMapIndexEmojis!!) || [];
      this.mapEmojis["Frequently"] = mapIndexEmojis.map(
          index => this.customEmojis[index]
      );
    },

    async saveFrequentlyEmojis(emojis: IEmoji[]) {
      const mapIndexEmojis = emojis.map(emoji => {
        return this.customEmojis.indexOf(emoji);
      });

      localStorage.setItem("frequentlyEmojis", JSON.stringify(mapIndexEmojis));
    },

    onChangeCustomEmojis(newEmojis: IEmoji[]) {
      if (newEmojis && newEmojis.length) {
        this.mapEmojis = {};
        this.mapperEmojisCategory(newEmojis);
      }
    },

    //@Emit("select")
    async onSelectEmoji(emoji: IEmoji) {
      await this.updateFrequently(emoji);

      this.$emit('select', emoji);
      //return emoji;
    },

    //@Emit("changeCategory")
    async onChangeCategory(category: ICategory) {
      this.$emit('changeCategory', category);
      // return category;
    },
  },

  computed:{
    categoriesFiltered() {
      return this.customCategories.filter(
          category => !this.exceptCategories.includes(category)
      );
    },
  },

  watch: {
    "customEmojis": [
      {
        handler: "onChangeCustomEmojis"
      }
    ]
  },


});
</script>

<style lang="css" scoped>
.emoji-picker {
  --ep-color-bg: #f0f0f0;
  --ep-color-sbg: #f6f6f6;
  --ep-color-border: #e4e4e4;
  --ep-color-text: #4a4a4a;
  --ep-color-active: #009688;

  display: inline-flex;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeSpeed;
  flex-direction: column;
  align-items: center;
  background-color: var(--ep-color-bg);
  border-radius: 4px;
  border: 1px solid var(--ep-color-border);
  overflow: hidden;
  width: 325px;
  user-select: none;

  @media screen and (max-width: 325px) {
    width: 100%;
  }
}

.dark {
  --ep-color-bg: #191B1A;
  --ep-color-sbg: #212221;
  --ep-color-border: #3E3D42;
  --ep-color-text: #f0f0f0;
  --ep-color-active: #009688;
}
</style>
