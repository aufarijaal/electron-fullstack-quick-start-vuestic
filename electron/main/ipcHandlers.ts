/* eslint-disable no-unused-vars */
import { ipcMain } from "electron";
import { stat } from "fs";
import pkg from "../../package.json";
import { appDirectory } from "./sqlite/knexfile";
import * as dbhelper from "./sqlite/dbhelper";

ipcMain.handle("get-versions", (event, args) => {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        chromium: process.versions.chrome,
        node: process.versions.node,
        electron: process.versions.electron,
      });
    } catch (error) {
      reject(error);
    }
  });
});

ipcMain.handle("get-dependencies", (event, args) => {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        devDependencies: pkg.devDependencies,
        dependencies: pkg.dependencies,
      });
    } catch (error) {
      reject(error);
    }
  });
});

ipcMain.handle("get-db-path", (event, args) => {
  return new Promise((resolve, reject) => {
    stat(appDirectory, (err) => {
      if (err) reject(err);
      else resolve(appDirectory);
    });
  });
});

ipcMain.handle("get:users", (event, args) => {
  return new Promise((resolve, reject) => {
    dbhelper
      .getUsers()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => reject(err));
  });
});
