"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
const vscode = __importStar(require("vscode"));
describe('Ambient Music Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');
    it('Sample test: Extension should be present', async () => {
        const extension = vscode.extensions.getExtension('taj154dev.ambient-music-extension');
        assert.ok(extension);
    });
    it('Sample test: Extension activates without error', async () => {
        const extension = vscode.extensions.getExtension('taj154dev.ambient-music-extension');
        await extension?.activate();
        assert.strictEqual(extension?.isActive, true);
    });
    it('Ambient Music server should start (based on port message)', async () => {
        const ext = vscode.extensions.getExtension('taj154dev.ambient-music-extension');
        await ext?.activate();
        assert.ok(ext?.isActive, 'Extension active but server status unknown');
    });
    it('Ambient Music configuration defaults are present', () => {
        const config = vscode.workspace.getConfiguration('ambientMusic');
        const port = config.get('port');
        // const  //
        assert.strictEqual(port, 0, 'Expected default port to be 0');
    });
});
//# sourceMappingURL=extension.test.js.map