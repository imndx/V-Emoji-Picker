<template>
  <span class="svg" :style="styleSVG" :title="label" v-html="icon" />
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
    computed: {
        styleSVG() {
            return {
              ...this.styles
            };
        }
    },
    props: {
        label: { required: true,
            type: String
        },
        icon: { required: true,
            type: String
        },
        styles: {
            type: Object as PropType<object>
        }
    }
});

</script>

<style lang="scss" scoped>
.svg {
  display: inline-block;
  vertical-align: middle;
}
</style>
