"use strict";

// camel-harness demo for Electron

// Load the camel-harness package:
const camelHarness = require("camel-harness");

// Determine the operating system and initialize "path" object:
let os = require("os");
let platform = os.platform();

let path;
if (platform !== "win32") {
  path = require("path").posix;
} else {
  path = require("path").win32;
}

// version.pl:
let versionScriptFullPath =
    path.join(__dirname, "perl", "version.pl");

let versionScriptObject = {};
versionScriptObject.interpreter = "perl";
versionScriptObject.scriptFullPath = versionScriptFullPath;
versionScriptObject.stdoutFunction = function(stdout) {
  document.getElementById("version-script").textContent = stdout;
};

// counter.pl full path:
let counterScriptFullPath =
    path.join(__dirname, "perl", "counter.pl");

// counter.pl - first instance:
let counterOneObject = {};
counterOneObject.interpreter = "perl";
counterOneObject.scriptFullPath = counterScriptFullPath;
counterOneObject.stdoutFunction = function(stdout) {
  document.getElementById("long-running-script-one").textContent = stdout;
};

// counter.pl - second instance:
let counterTwoObject = {};
counterTwoObject.interpreter = "perl";
counterTwoObject.scriptFullPath = counterScriptFullPath;
counterTwoObject.stdoutFunction = function(stdout) {
  document.getElementById("long-running-script-two").textContent = stdout;
};

// interactive script:
let interactiveScriptObject = {};

function startInteractiveScript() {
  let interactiveScriptFullPath =
      path.join(__dirname, "perl", "interactive.pl");

  interactiveScriptObject.interpreter = "perl";
  interactiveScriptObject.scriptFullPath = interactiveScriptFullPath;

  interactiveScriptObject.stdoutFunction = function(stdout) {
    if (stdout.match(/_closed_/)) {
      const {ipcRenderer} = require("electron");
      ipcRenderer.send("asynchronous-message", "close");
    } else {
      document.getElementById("interactive-script-output").textContent = stdout;
    }
  };

  camelHarness.startScript(interactiveScriptObject);
}

function sendDataToInteractiveScript() {
  let data = document.getElementById("interactive-script-input").value;
  interactiveScriptObject.scriptHandler.stdin.write(`${data}\n`);
}

function closeInteractiveScript() {
  interactiveScriptObject.scriptHandler.stdin.write("_close_\n");
}

// Wait for close event message from the main process and react accordingly:
require("electron").ipcRenderer.on("closeInteractiveScript", function() {
  closeInteractiveScript();
});
