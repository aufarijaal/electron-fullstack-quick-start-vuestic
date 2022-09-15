<script setup lang="ts">
import { reactive } from "vue";

interface AppDependencies {
  dependencies: any;
  devDependencies: any;
}

const dependencies = reactive<string[]>([]);
const devDependencies = reactive<string[]>([]);

const getDependencies = () => {
  dependencies.length = 0;
  devDependencies.length = 0;
  window.api.getDependencies().then((app: AppDependencies) => {
    for (const dep of Object.keys(app.dependencies)) {
      dependencies.push(`${dep}: ${app.dependencies[dep]}`);
    }
    for (const dep of Object.keys(app.devDependencies)) {
      devDependencies.push(`${dep}: ${app.devDependencies[dep]}`);
    }
  });
};
</script>

<template>
  <va-button @click="getDependencies" size="small" color="success" outline>Load dependencies</va-button>
  <div class="dependencies-container">
    <va-card stripe stripe-color="success">
      <va-card-title>Dependencies</va-card-title>
      <va-card-content>
        <div style="font-size: 13px; color: var(--va-secondary); margin-bottom: 3px;" v-for="dep in dependencies" :key="dep">{{ dep }}</div>
      </va-card-content>
    </va-card>
    <va-card stripe>
      <va-card-title>Dev Dependencies</va-card-title>
      <va-card-content>
        <div style="font-size: 13px; color: var(--va-secondary); margin-bottom: 3px;" v-for="devdep in devDependencies" :key="devdep">{{ devdep }}</div>
      </va-card-content>
    </va-card>
  </div>
</template>

<style>
.dependencies-container {
  display: flex;
  gap: 5px;
}
</style>
