import { useElementHover } from "@vueuse/core";
import type { VNode } from "vue";
import { computed, defineComponent, h, onMounted, ref, watch } from "vue";
import { Content } from "vuepress/client";

import { useThemeData } from "@theme-hope/composables/index";

import "../styles/markdown-content.scss";

export default defineComponent({
  name: "MarkdownContent",

  props: {
    /** whether use customized layout */
    custom: Boolean,
  },

  setup(props) {
    const themeData = useThemeData();

    const contentElement = ref<HTMLElement>();

    const isHovered = useElementHover(contentElement, {
      delayEnter: 3000,
      delayLeave: 0,
    });

    watch(isHovered, console.log, { immediate: true });

    const enableFocus = computed(
      () =>
        Boolean(themeData.value.focus ?? themeData.value.pure) &&
        isHovered.value,
    );

    onMounted(() => {
      const html = document.documentElement;

      const h1 = document.querySelector("h1")!;

      const isHovered = useElementHover(h1, {
        delayEnter: 3000,
        delayLeave: 0,
      });

      watch(isHovered, console.warn, { immediate: true });

      watch(
        enableFocus,
        (value) => {
          if (value) {
            html.classList.add("is-focusing");
          } else {
            html.classList.remove("is-focusing");
          }
        },
        { immediate: true },
      );
    });

    return (): VNode =>
      h(Content, {
        ref: contentElement,
        class: ["theme-hope-content", { custom: props.custom }],
        "vp-content": "",
      });
  },
});
