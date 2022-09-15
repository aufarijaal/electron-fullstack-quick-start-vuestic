import {transports, format, createLogger} from "winston";
import "winston-daily-rotate-file";
import dayjs from "dayjs";
import {app} from "electron";
import { appDirectory } from "./main/sqlite/knexfile";

const consoleTransport = new transports.Console({});
const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: "app-%DATE%.log",
  datePattern: "YYYY_MM_DD",
  dirname: appDirectory,
  maxSize: "5m",
  zippedArchive: true,
  maxFiles: "14d"  
});

export const logger = createLogger({
  level: "info",
  format: format.printf((log) => {
    return `${dayjs().format("DD-MM-YYYY HH:mm:ss")} [${log.level.toUpperCase()}] ${log.message}`;
  }),
  transports: [
    consoleTransport,
    dailyRotateFileTransport,
  ]
});

// Don't log to console when app is packaged
if(app.isPackaged) logger.remove(consoleTransport);