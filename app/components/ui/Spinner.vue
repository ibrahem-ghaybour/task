<script setup lang="ts">
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  class?: string;
}

const props = withDefaults(defineProps<SpinnerProps>(), {
  size: "md",
});

const sizeClasses = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-3",
  lg: "w-12 h-12 border-4",
};
</script>

<template>
  <div
    :class="
      cn(
        'inline-block animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]',
        sizeClasses[size],
        props.class
      )
    "
    role="status"
  >
    <span class="sr-only">Loading...</span>
  </div>
</template>
