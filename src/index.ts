import {DefineComponent, Plugin as PluginObject} from 'vue';
import _VEmojiPicker from './VEmojiPicker.vue';

import { categoriesDefault } from './utils/categories';
import { emojisDefault } from './utils/emojis';
import {Emoji} from './models/Emoji';
import {Category} from "./models/Category";

import locale from './locale';

const defaultOptions = {
  i18n: {}
};

const plugin: PluginObject<DefineComponent> = {
  // VEmojiPicker: _VEmojiPicker,
  install: (app, opts: any = defaultOptions) => {
    locale.i18n(opts.i18n);

    //app.component(_VEmojiPicker.name, _VEmojiPicker);
    app.component('VEmojiPicker', _VEmojiPicker as unknown as DefineComponent);
  }
};

// Automatic installation if Vue has been added to the global scope.
// if (typeof window !== 'undefined' && window.Vue) {
//   try {
//     window.Vue.use(VEmojiPicker)
//   } catch (error) {
//     VEmojiPicker.install(window.Vue)
//   }
// }

export {
  _VEmojiPicker as VEmojiPicker,
  categoriesDefault,
  emojisDefault,
  Emoji,
  Category,
};

export default plugin;
