import { app, BrowserWindow, shell, ipcMain } from "electron";
import { release } from "os";
import { join } from "path";
import pkg from "../../package.json";
import { logger } from "../winston";
import "./ipcHandlers";

logger.info("********* STARTING APPLICATION *********");
// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
	app.quit();
	process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

export const ROOT_PATH = {
	// /dist
	dist: join(__dirname, "../.."),
	// /dist or /public
	public: join(__dirname, app.isPackaged ? "../.." : "../../../public"),
};

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL as string;
const indexHtml = join(ROOT_PATH.dist, "index.html");

async function createWindow() {
	win = new BrowserWindow({
		title: pkg.displayName,
		icon: join(ROOT_PATH.public, "icon.ico"),
		webPreferences: {
			preload,
			nodeIntegration: false,
			contextIsolation: true,
		},
		minHeight: 350,
		minWidth: 490,
		height: 600,
		width: 510,
		frame: true,
	});

	// Disable menu bar
	win.menuBarVisible = false;

	if (app.isPackaged) {
		win.loadFile(indexHtml);
	} else {
		win.loadURL(url);
		// Open devTool if the app is not packaged
		// win.webContents.openDevTools()
	}

	logger.info("Loading main page...");

	// Make all links open with the browser, not with the application
	win.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith("https:")) shell.openExternal(url);
		return { action: "deny" };
	});
}

app.whenReady().then(() => {
	createWindow()
	.then(() => logger.info("Main Window successfully initialized"))
	.catch((err) => logger.error("Failed to initialize Main Window. reason : " + err.message));
});

app.on("window-all-closed", () => {
	logger.info("********* CLOSING THE APPLICATION *********");
	win = null;
	if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
	if (win) {
		// Focus on the main window if the user tried to open another
		if (win.isMinimized()) win.restore();
		win.focus();
	}
});

app.on("activate", () => {
	const allWindows = BrowserWindow.getAllWindows();
	if (allWindows.length) {
		allWindows[0].focus();
	} else {
		createWindow();
	}
});

// new window example arg: new windows url
ipcMain.handle("open-win", (event, arg) => {
	const childWindow = new BrowserWindow({
		webPreferences: {
			preload,
		},
	});

	if (app.isPackaged) {
		childWindow.loadFile(indexHtml, { hash: arg });
	} else {
		childWindow.loadURL(`${url}/#${arg}`);
		// childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
	}
});
