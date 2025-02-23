import * as vscode from 'vscode';

export class MobDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
  public provideDocumentSymbols(document: vscode.TextDocument): vscode.ProviderResult<vscode.DocumentSymbol[]> {
    const symbols: vscode.DocumentSymbol[] = [];
    const mobRegex = /^#(\d+)/;
    const mobNameRegex = /^([A-Za-z].*?)~/; // Adjust as needed based on your mob name format

    // First, find all lines where a mob header occurs.
    const mobHeaderLines: number[] = [];
    for (let line = 0; line < document.lineCount; line++) {
      const lineText = document.lineAt(line).text;
      if (mobRegex.test(lineText)) {
        mobHeaderLines.push(line);
      }
    }

    // Now, for each mob header, calculate its range until the next mob header or the end of the file.
    for (let i = 0; i < mobHeaderLines.length; i++) {
      const startLine = mobHeaderLines[i];
      const endLine = (i + 1 < mobHeaderLines.length) ? mobHeaderLines[i + 1] - 1 : document.lineCount - 1;
      
      // Extract the mob number from the header line.
      const headerText = document.lineAt(startLine).text;
      const mobMatch = mobRegex.exec(headerText);
      const mobNumber = mobMatch ? mobMatch[1] : '';
      
      // Extract the mob name from the second line after the header.
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
}
