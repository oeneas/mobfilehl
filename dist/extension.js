"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode2 = __toESM(require("vscode"));

// src/mobSymbolProvider.ts
var vscode = __toESM(require("vscode"));
var MobDocumentSymbolProvider = class {
  provideDocumentSymbols(document) {
    const symbols = [];
    const mobRegex = /^#(\d+)/;
    const mobNameRegex = /^([A-Za-z].*?)~/;
    const mobHeaderLines = [];
    for (let line = 0; line < document.lineCount; line++) {
      const lineText = document.lineAt(line).text;
      if (mobRegex.test(lineText)) {
        mobHeaderLines.push(line);
      }
    }
    for (let i = 0; i < mobHeaderLines.length; i++) {
      const startLine = mobHeaderLines[i];
      const endLine = i + 1 < mobHeaderLines.length ? mobHeaderLines[i + 1] - 1 : document.lineCount - 1;
      const headerText = document.lineAt(startLine).text;
      const mobMatch = mobRegex.exec(headerText);
      const mobNumber = mobMatch ? mobMatch[1] : "";
      let mobName = `Mob #${mobNumber}`;
      if (startLine + 2 < document.lineCount) {
        const nameLine = document.lineAt(startLine + 2).text;
        const nameMatch = mobNameRegex.exec(nameLine);
        if (nameMatch) {
          mobName = nameMatch[1].trim();
        }
      }
      const range = new vscode.Range(
        startLine,
        0,
        endLine,
        document.lineAt(endLine).text.length
      );
      const symbol = new vscode.DocumentSymbol(
        mobName,
        `Mob Number: ${mobNumber}`,
        vscode.SymbolKind.Struct,
        range,
        range
      );
      symbols.push(symbol);
    }
    return symbols;
  }
};

// src/extension.ts
function activate(context) {
  console.log('Congratulations, your extension "mobfilehl" is now active!');
  const disposable = vscode2.commands.registerCommand("mobfilehl.helloWorld", () => {
    vscode2.window.showInformationMessage("Hello World from MobFileHL!");
  });
  context.subscriptions.push(disposable);
  context.subscriptions.push(
    vscode2.languages.registerDocumentSymbolProvider(
      { language: "mob" },
      new MobDocumentSymbolProvider()
    )
  );
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
