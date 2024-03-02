<template>
  <div id="Emojis">
    <div ref="container-emoji" class="container-emoji">
      <template v-if="continuousList">
        <div v-for="(category, category_name) in dataFilteredByCategory" :key="category_name">
          <CategoryLabel v-show="category.length" :name="category_name" :ref="category_name"/>
          <div v-if="category.length" class="grid-emojis" :style="gridDynamic">
            <EmojiItem
                v-for="(emoji, index_e) in category"
                :key="`${category_name}-${index_e}`"
                :emoji="emoji"
                :size="emojiSize"
                :withBorder="emojiWithBorder"
                @click.native="onSelect(emoji)"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <div v-if="category.indexOf('Sticker-') === -1" class="grid-emojis" :style="gridDynamic">
          <EmojiItem
              v-for="(emoji, index) in dataFiltered"
              :key="index"
              :emoji="emoji"
              :size="emojiSize"
              :withBorder="emojiWithBorder"
              @click.native="onSelect(emoji)"
          />
        </div>
        <div v-else class="grid-emojis" :style="stickerGridDynamic">
          <StickerItem
              v-for="(emoji, index) in dataFiltered"
              :key="index"
              :emoji="emoji"
              :size="stickerSize"
              :withBorder="emojiWithBorder"
              @click.native="onSelect(emoji)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import {Emoji} from "@/models/Emoji";

import EmojiItem from "./EmojiItem.vue";
import CategoryLabel from "./CategoryLabel.vue";
import StickerItem from "./StickerItem.vue";
import {defineComponent} from "vue";

export default defineComponent({

  components: {
    StickerItem,
    EmojiItem,
    CategoryLabel
  },
  emits:['select'],

  props: {
    data: {
      required: true,
      type: Object
    },
    emojisByRow: {
      required: true,
      type: Number
    },
    stickersByRow: {
      required: true,
      type: Number
    },
    emojiWithBorder: {
      required: false,
      type: Boolean
    },
    emojiSize: {
      required: false,
      type: Number
    },
    stickerSize: {
      required: false,
      type: Number
    },
    filter: {
      required: true,
      type: String
    },
    continuousList: {
      required: false,
      type: Boolean
    },
    category: {
      required: true,
      type: String
    },
    hasSearch: {
      required: true,
      type: Boolean
    }
  },

  methods: {
    searchByAlias(term: string, emoji: Emoji) {
      const isRelevant = (alias: string) => alias.toLowerCase().includes(term);

      return emoji.aliases.some((alias: string) => isRelevant(alias));
    },

    calcScrollTop() {
      return this.hasSearch ? 88 : 44;
    },

    onCategoryChanged(newValue: any) {
      if (this.continuousList) {
        const categoryEl = (this.$refs[newValue] as any)[0].$el;

        this.containerEmoji.scrollTop =
            categoryEl.offsetTop - this.calcScrollTop();
      }
    },

    onDataChanged() {
      this.containerEmoji.scrollTop = 0;
    },

    // TODO
    // @Emit("select")
    onSelect(emoji: Emoji) {
      this.$emit('select', emoji);
      // return emoji;
    }
  },

  computed: {
    gridDynamic() {
      const percent = 100 / this.emojisByRow;
      return {
        gridTemplateColumns: `repeat(${this.emojisByRow}, ${percent}%)`
      };
    },

    stickerGridDynamic() {
      const percent = 100 / this.stickersByRow;
      return {
        gridTemplateColumns: `repeat(${this.stickersByRow}, ${percent}%)`
      };
    },

    dataFiltered() {
      let data = this.data[this.category];
      const searchValue = this.filter.trim().toLowerCase();

      if (searchValue) {
        data = data.filter((emoji: Emoji) =>
            this.searchByAlias(searchValue, emoji)
        );
      }

      return data;
    },

    dataFilteredByCategory() {
      let _data = Object.assign({}, this.data);
      const searchValue = this.filter.trim().toLowerCase();

      if (searchValue) {
        this.categories.forEach((category: string) => {
          _data[category] = this.data[category].filter((item: Emoji) =>
              this.searchByAlias(searchValue, item)
          );
        });
      }

      return _data;
    },

    categories(): any {
      return Object.keys(this.data);
    },

    containerEmoji(): any {
      return this.$refs["container-emoji"];
    }
  },


  watch: {
    "category": [
      {
        handler: "onCategoryChanged"
      }],
    "data": [
      {
        handler: "onDataChanged"
      }
    ]
  }

});
</script>

<style lang="css" scoped>
#Emojis {
  font-family: Twemoji, NotomojiColor, Notomoji, EmojiOne Color, Symbola, Noto,
  Segoe UI Emoji, OpenSansEmoji, monospace;
  display: block;
  width: 100%;
  max-width: 100%;
  color: var(--ep-color-text);


}

#Emojis::-webkit-scrollbar {
  border-radius: 4px;
  width: 4px;
  overflow: hidden;
}

.container-emoji {
  overflow-x: hidden;
  overflow-y: scroll;
  height: 350px;
}

.grid-emojis {
  display: grid;
  margin: 5px 0;
  justify-items: center;
}
</style>
