// ============================ 公共模块 ============================
// electron模块
const electron = require('electron');
// 控制应用生命周期的模块。
const {app} = electron;
// 创建原生浏览器窗口的模块。
const {BrowserWindow} = electron;
// 通信进程
const {ipcMain} = electron;

// ============================ 主窗口 ============================
// 保持一个对于 window 对象的全局引用，如果你不这样做，
// 当 JavaScript 对象被垃圾回收， window 会被自动地关闭。
let mainWindow;

function createWindow () {
	// 创建浏览器窗口。
	mainWindow = new BrowserWindow({
		//width: 800,
		//height: 600,
		minWidth: 600,
		minHeight: 600,
		frame: false,
		show: false
	});

	// 加载应用的 main.html。
	mainWindow.loadURL(`file://${__dirname}/main.html`);

	// 启用开发工具。
	//mainWindow.webContents.openDevTools();

	// 当 window 被关闭，这个事件会被触发。
	mainWindow.on('closed', (event) => {
		// 取消引用 window 对象，如果你的应用支持多窗口的话，
		// 通常会把多个 window 对象存放在一个数组里面，
		// 与此同时，你应该删除相应的元素。
		mainWindow = null;
	});

	// 监听页面加载完毕后显示窗口
	mainWindow.webContents.on('did-finish-load', () => {
		mainWindow.show();
	});

	// 监听最大化按钮
	mainWindow.on('maximize', (event) => {
		event.sender.send('max');
	});
	mainWindow.on('unmaximize', (event) => {
		event.sender.send('unmax');
	});
}

// Electron 会在初始化后并准备创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow);

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
	// 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
	// 否则绝大部分应用及其菜单栏会保持激活。
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// 当应用被激活时触发，常用于点击应用的 dock 图标的时候。macOS
app.on('activate', () => {
	// 在 macOS 上，当点击 dock 图标并且该应用没有打开的窗口时，
	// 绝大部分应用会重新创建一个窗口。
	if (mainWindow === null) {
		createWindow();
	}
});

// 最小化
ipcMain.on('min', (event) => {
	mainWindow.minimize();
});
// 最大化
ipcMain.on('max', (event) => {
	if(mainWindow.isMaximized()) {
		mainWindow.unmaximize();
	} else {
		mainWindow.maximize();
	}
});
// 关闭
ipcMain.on('close', (event) => {
	app.quit();
});


// ============================ 公共方法 ============================
// 通信方法：显示指定窗口
ipcMain.on('show', (event) => {
	
});

// 在这文件，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。
