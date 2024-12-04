import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Save, Trash2 } from 'lucide-react';
import mermaid from 'mermaid';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize mermaid with enhanced configuration
mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  flowchart: {
    nodeSpacing: 50,
    rankSpacing: 50,
    curve: 'basis',
    useMaxWidth: false
  }
});


const MermaidGenerator = () => {
  const [apiKey, setApiKey] = useState('');
  const [description, setDescription] = useState('');
  const [mermaidCode, setMermaidCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: string, parts: Array<{text: string}>}>>([]);


  const cleanMermaidCode = (code: string) => {
    return code
      .replace(/```mermaid/g, '')
      .replace(/```/g, '')
      .trim();
  };

  const fixDoubleQuotes = (code: string) => {
    return code.split('\n').map(line => {
      // Replace double quotes with single quotes in edge labels
      return line.replace(/--?>?\s*"{2,}(.+?)"{2,}/g, (_, label) => {
        return `--> "${label.trim()}"`;
      });
    }).join('\n');
  };

  const fixNodeSyntax = (code: string) => {
    return code.split('\n').map(line => {
      // Add semicolons between node definitions
      return line.replace(/(\)|\])\s*([A-Za-z])/g, '$1;$2');
    }).join('\n');
  };

  const fixEdgeLabels = (code: string) => {
    return code.split('\n').map(line => {
      // Replace pipe-style labels with quoted labels
      // Matches both --> and --- style edges
      return line
        .replace(/(-+>|--)\s*\|(.+?)\|\s*/g, (_, arrow, label) => {
          return `${arrow} "${label.trim()}" `;
        });
    }).join('\n');
  };

  const parseAndFixBrackets = (code: string) => {
    return code.split('\n').map(line => {
      // Find content inside square brackets without quotes
      return line.replace(/\[(.*?)\]/g, (match, content) => {
        // If content has parentheses but isn't wrapped in quotes, wrap it
        if ((content.includes('(') || content.includes(')')) && 
            !content.startsWith('"') && !content.endsWith('"')) {
          return `["${content}"]`;
        }
        return match;
      });
    }).join('\n');
  };

  const callGeminiAPI = async (description: string, apiKey: string) => {
    console.log('Making API call with description:', description.substring(0, 50) + '...');
    
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.001,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
        }
      });

      // Add the instruction prefix to the description
        const instructionPrefix = `As a professional flowchart developer, create a Mermaid.js flowchart with the following guidelines:
    - Use proper spacing between nodes
    - For edge labels, use quotes instead of pipes (e.g., --> "label" instead of -->|label|)
    - Keep the diagram simple and readable
    - Use appropriate node shapes
    - Ensure consistent spacing

    Please provide the flowchart for the following in Mermaid.js code (strictly only send code, no other text):

    `;
      const enhancedDescription = instructionPrefix + description;

      // Create a new chat for each request
      const chat = model.startChat({
        history: chatHistory
      });

      // Send the message and await the response
      const result = await chat.sendMessage(enhancedDescription);
      const response = await result.response.text();
      
      // Update chat history only after successful response
      const newHistory = [
        ...chatHistory,
        { 
          role: "user", 
          parts: [{ text: enhancedDescription }] 
        },
        { 
          role: "model", 
          parts: [{ text: response }] 
        }
      ];
      setChatHistory(newHistory);
      
      console.log('Received response:', response);
      return response;

    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  };

  const generateDiagram = async () => {
    setIsLoading(true);
    setError('');
    setDebugInfo('');
    
    try {
      console.log('Starting diagram generation...');
        const response = await callGeminiAPI(description, apiKey);
        console.log('Received mermaid code:', response);
        
        const cleanedCode = cleanMermaidCode(response);
        const fixedBrackets = parseAndFixBrackets(cleanedCode);
        const fixedEdges = fixEdgeLabels(fixedBrackets);
        const fixedQuotes = fixDoubleQuotes(fixedEdges);
        const fixedNodes = fixNodeSyntax(fixedQuotes);
        setMermaidCode(fixedNodes);
        
        // Wrap the rendering logic in a setTimeout to ensure DOM is ready
        setTimeout(async () => {
        const element = document.querySelector("#mermaid-diagram");
        if (element) {
          console.log('Rendering mermaid diagram...');
          element.innerHTML = '';
          
          const diagramDiv = document.createElement('div');
          diagramDiv.className = 'mermaid';
          diagramDiv.textContent = fixedNodes;
          element.appendChild(diagramDiv);
          
          try {
            await mermaid.init(undefined, document.querySelectorAll('.mermaid'));
            console.log('Mermaid diagram rendered successfully');
          } catch (mermaidError) {
            console.error('Mermaid rendering error:', mermaidError);
            setError('Failed to render diagram: Invalid mermaid syntax');
            setDebugInfo(JSON.stringify(mermaidError, null, 2));
          }
        } else {
          console.error('Mermaid diagram element not found');
          setError('Diagram element not found');
          setDebugInfo('Element #mermaid-diagram not found in DOM');
        }
      }, 100); // Add 100ms delay to ensure React has rendered the element
      
    } catch (err: any) {
      const errorMessage = err.message || 'Unknown error occurred';
      console.error('Error in generateDiagram:', err);
      setError(`Failed to generate diagram: ${errorMessage}`);
      setDebugInfo(`Debug Info: ${JSON.stringify(err, null, 2)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAll = () => {
    setChatHistory([]);
    setMermaidCode('');
    setError('');
    setDebugInfo('');
    setDescription('');
    
    // Clear the mermaid diagram
    const element = document.querySelector("#mermaid-diagram");
    if (element) {
      element.innerHTML = '';
    }
  };

  const saveDiagram = () => {
    const mermaidDiagram = document.querySelector("#mermaid-diagram svg");
    if (!mermaidDiagram) {
      console.error('No SVG found in mermaid diagram');
      return;
    }

    // Get the SVG content
    const svgContent = mermaidDiagram.outerHTML;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    
    // Create download link
    const element = document.createElement('a');
    element.href = URL.createObjectURL(blob);
    element.download = 'diagram.svg';
    
    // Trigger download
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    // Cleanup
    URL.revokeObjectURL(element.href);
  };

  return (
    <div className="min-h-screen bg-gray-950 overflow-auto">
      <div className="w-full max-w-4xl mx-auto p-4 space-y-4 relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-100">Mermaid Diagram Generator</h1>
      </div>

      <Card className="border-2 bg-gray-900 border-gray-800">
      <CardContent className="space-y-4 p-6">
        <div className="space-y-2">
        <label className="block text-sm font-medium mb-2 text-gray-200">Gemini API Key</label>
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Gemini API key"
          className="w-full transition-colors focus:ring-2 bg-gray-800 text-gray-200 border-gray-700"
        />
        </div>
        
        <div className="space-y-2">
        <label className="block text-sm font-medium mb-2 text-gray-200">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the relationships and flow you want to visualize..."
          className="w-full h-32 transition-colors focus:ring-2 bg-gray-800 text-gray-200 border-gray-700"
        />
        </div>

          <div className="flex justify-between pt-4">
          <div className="space-x-2">
            <Button
            onClick={generateDiagram}
            disabled={!apiKey || !description || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            >
            {isLoading ? 'Generating...' : 'Generate Diagram'}
            </Button>
            
            <Button
            onClick={resetAll}
            variant="outline"
            className="border-2 hover:bg-red-900/20 text-red-400 border-red-900"
            disabled={isLoading}
            >
            <Trash2 className="w-4 h-4 mr-2" />
            Reset All
            </Button>
          </div>
          
          <Button
            onClick={saveDiagram}
            disabled={!mermaidCode}
            variant="outline"
            className="border-2 border-gray-700 text-gray-200 hover:bg-gray-800"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Diagram
          </Button>
          </div>

          {error && (
          <div className="text-red-400 text-sm space-y-2 p-4 border border-red-900/50 rounded-lg bg-red-900/10">
            <div>{error}</div>
            {debugInfo && (
            <pre className="text-xs p-2 rounded overflow-auto bg-gray-800/50">
              {debugInfo}
            </pre>
            )}
          </div>
          )}
          
          {mermaidCode && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4 text-gray-200">Generated Diagram</h3>
            <div className="border-2 border-gray-700 rounded-lg p-6 bg-gray-800">
            <div id="mermaid-diagram" className="overflow-auto"></div>
            <pre className="whitespace-pre-wrap mt-6 pt-4 border-t-2 border-gray-700 text-gray-300">
              {mermaidCode}
            </pre>
            </div>
          </div>
          )}
        </CardContent>

        </Card>
        </div>
      </div>
  );
};

export default MermaidGenerator;