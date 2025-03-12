import { useState, useEffect } from 'react';
import ts from 'typescript';
import Editor from '@monaco-editor/react';
import 'monaco-editor/min/vs/editor/editor.main.css';

export default function TypeScriptPlayground() {
  const [code, setCode] = useState("const message: string = 'Hello, TypeScript!';\nconsole.log(message);");
  const [output, setOutput] = useState('');
  const [consoleOutput, setConsoleOutput] = useState('');

  // Fungsi untuk mentranspilasi TypeScript ke JavaScript
  const transpileCode = (input: string) => {
    try {
      const result = ts.transpileModule(input, {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2020,
          strict: true,
        },
      });
      setOutput(result.outputText);
    } catch (err) {
      setOutput(`Error: ${err}`);
    }
  };

  // Jalankan kode JavaScript dan tangkap output
  const runCode = () => {
    try {
      const log: (string | number)[] = [];
      const originalLog = console.log;

      console.log = (...args) => {
        args.forEach(arg => {
          log.push(
            typeof arg === 'string' || typeof arg === 'number'
              ? arg
              : JSON.stringify(arg, null, 2)
          );
        });
        originalLog(...args);
      };

      new Function(output)();

      console.log = originalLog;
      setConsoleOutput(log.join('\n'));
    } catch (err) {
      setConsoleOutput(`Error: ${err}`);
    }
  };

  useEffect(() => {
    transpileCode(code);
  }, [code]);

  return (
    <div className="grid grid-cols-2 h-screen overflow-hidden">
      <header className="col-span-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-4">
        <h1 className="text-3xl font-bold">TypeScript Playground By Asrul</h1>
      </header>

      <div className="border-r border-gray-300 overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="typescript"
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
        />
      </div>

      <div className="p-4 bg-gray-100 flex flex-col overflow-hidden">
        <div>
          <h2 className="font-bold mb-2">Output (JavaScript):</h2>
          <button onClick={runCode} className="px-4 py-2 bg-blue-500 text-white rounded mb-4">Run</button>
        </div>

        <div className="flex-1 overflow-auto mb-4">
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>

        <div>
          <h2 className="font-bold mb-2">Console Output:</h2>
        </div>

        <div className="flex-1 overflow-auto">
          <pre className="bg-black text-green-400 p-2 rounded whitespace-pre-wrap">{consoleOutput}</pre>
        </div>
      </div>
    </div>
  );
}