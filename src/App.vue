<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useToast } from "vuestic-ui";
import DependenciesComponent from "./components/DependenciesComponent.vue";

// eslint-disable-next-line no-unused-vars
const {init, close, closeAll} = useToast();
const versionChrome = ref("?");
const versionElectron = ref("?");
const versionNode = ref("?");
const count = ref(0);
const dbPath = ref("?");
const usersData = reactive<Array<object>>([]);

const getVersions = () => {
  count.value++;
  window.api
    .getVersions()
    .then((versions: any) => {
      versionChrome.value = versions.chromium;
      versionElectron.value = versions.electron;
      versionNode.value = versions.node;
    })
    .catch((err: Error) => init(err.message));
};

onMounted(() => {
  window.api
    .getDBPath()
    .then((path: string) => {
      dbPath.value = path;
    })
    .catch((err: Error) => (dbPath.value = err.message));

    usersData.length = 0;
  window.api.getUsers().then((rows: Array<object>) => {
    rows.forEach((row) => {
      usersData.push(row);
    });
  }).catch((err: Error) => console.log(err));
});
</script>

<template>
  <div class="root-container">
    <div style="font-size: 22px; font-weight: 500">Electron Fullstack Quick Start</div>
    <div class="small-secondary-text">Path to application data: {{ dbPath }}</div>
    <div class="small-secondary-text">Users: {{ usersData }}</div>
    <va-button outline color="info" @click="getVersions">Get versions (Clicked {{ count }} times)</va-button>
    <div class="all-versions-container">
      <div class="versions-container">
        <va-image src="chromium-svgrepo-com.svg" class="versions-image" />
        <div class="small-secondary-text">Chromium version: {{ versionChrome }}</div>
      </div>
      <div class="versions-container">
        <va-image src="electron.svg" class="versions-image" />
        <div class="small-secondary-text">Electron version: {{ versionElectron }}</div>
      </div>
      <div class="versions-container">
        <va-image src="nodejs-icon-logo-svgrepo-com.svg" class="versions-image" />
        <div class="small-secondary-text">Node JS version: {{ versionNode }}</div>
      </div>
    </div>
    <dependencies-component />
  </div>
</template>

<style>
html,
body {
  min-height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.root-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 30px;
  margin-top: 50px;
  align-items: center;
}
.all-versions-container {
  display: flex;
  gap: 5px;
}
.small-secondary-text {
  color: var(--va-secondary);
  font-size: 13px;
}
.versions-image {
  width: 30vw;
  max-width: 280px;
}
.versions-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
</style>
