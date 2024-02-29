<template>
  <div class="category-title">{{ name }}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        name: { required: true,
            type: String
        }
    }
});

</script>

<style lang='scss' scoped>
.category-title {
  text-transform: uppercase;
  font-size: 0.8em;
  padding: 5px 0 0 16px;
  color: #676666;

  &:not(:first-of-type) {
    padding: 10px 0 0 16px;
  }
}
</style>
