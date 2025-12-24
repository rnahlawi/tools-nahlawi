<template>
  <div class="it-tool-wrapper">
    <component :is="toolComponent" v-if="toolComponent" />
    <div v-else class="loading">
      <p>Loading tool...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';

const props = defineProps({
  toolName: {
    type: String,
    required: true
  }
});

const toolComponent = ref(null);

onMounted(async () => {
  try {
    // Dynamically import the it-tools component
    const module = await import(`../../vendor/it-tools/src/tools/${props.toolName}.vue`);
    toolComponent.value = module.default;
  } catch (error) {
    console.error(`Failed to load tool: ${props.toolName}`, error);
  }
});
</script>

<style scoped>
.it-tool-wrapper {
  min-height: 400px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: var(--color-text-secondary);
}
</style>