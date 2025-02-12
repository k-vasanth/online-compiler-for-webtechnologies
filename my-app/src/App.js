import React, { useState, useEffect } from 'react';
import Editor from './Editor';
import useLocalStorage from './useLocalStorage';

function App() {
  const [html, setHtml] = useLocalStorage('html', '');
  const [css, setCss] = useLocalStorage('css', '');
  const [js, setJs] = useLocalStorage('js', '');
  const [blobUrl, setBlobUrl] = useState('');

  const handleRun = () => {
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl); // Remove old Blob URL
    }

    const blob = new Blob(
      [
        `
        <html>
          <head>
            <style>${css}</style>
          </head>
          <body>
            ${html}
            <script>
              try {
                ${js}
              } catch (error) {
                console.error(error);
              }
            </script>
          </body>
        </html>
        `
      ],
      { type: 'text/html' }
    );

    const newBlobUrl = URL.createObjectURL(blob);
    setBlobUrl(newBlobUrl);
  };

  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  return (
    <>
      <div className="pane top-pane">
        <Editor language="xml" displayName="HTML" value={html} onChange={setHtml} />
        <Editor language="css" displayName="CSS" value={css} onChange={setCss} />
        <Editor language="javascript" displayName="JS" value={js} onChange={setJs} />
      </div>
      <button onClick={handleRun} className="run-button btn btn-success">
        Run
      </button>
      <div className="pane">
        <iframe
          key={blobUrl} // Forces re-render when blobUrl changes
          src={blobUrl}
          title="output"
          sandbox="allow-scripts allow-modals"
          frameBorder="0"
          width="100%"
          height="100%"
        />
      </div>
    </>
  );
}

export default App;
