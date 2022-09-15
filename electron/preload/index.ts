/* eslint-disable no-unused-labels */
import { contextBridge, ipcRenderer } from "electron";

const getVersions = () => ipcRenderer.invoke("get-versions");
const getDependencies = () => ipcRenderer.invoke("get-dependencies");
const getDBPath = () => ipcRenderer.invoke("get-db-path");

const getUsers = () => ipcRenderer.invoke("get:users");

export const API = {
  getVersions,
  getDependencies,
  getDBPath,
  getUsers,
};

contextBridge.exposeInMainWorld("api", API);
