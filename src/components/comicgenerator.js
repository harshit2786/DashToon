import React, { useState } from 'react';
import './comic.css';
import { useMobileLayout } from './hooks';

async function query(data) {
  const response = await fetch(
    "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
    {
      headers: { 
        "Accept": "image/png",
        "Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM", 
        "Content-Type": "application/json" 
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.blob();
  return result;
}

const ComicGenerator = () => {
    const isMobile = useMobileLayout();
    const [comicPanels, setComicPanels] = useState([]);
    const [inputTexts, setInputTexts] = useState(Array(10).fill(''));
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const generateComic = async () => {
      // Check if any input field is empty
      if (inputTexts.some((text) => !text.trim())) {
        setError("Please fill in all input fields before generating the comic.");
        return;
      }
  
      try {
        setLoading(true); // Set loading to true when starting the comic generation
        const panelPromises = inputTexts.map(async (text) => {
          const response = await query({ "inputs": text });
          return response;
        });
  
        const generatedPanels = await Promise.all(panelPromises);
        setComicPanels(generatedPanels);
        setError(null); // Clear any previous error
      } catch (error) {
        setError("Failed to generate comic. Please try again.");
      } finally {
        setLoading(false); // Set loading to false when the comic generation is complete (success or failure)
      }
    };
  
    return (
      <div style={{ display: 'flex', gap: '10px' , padding: '10px',flexDirection: isMobile ? 'column' : 'row' }}>
        <div className="comic-generator" style={{width: isMobile ? '100%' : '30%', marginTop:'20px'}}>
        <div className="input-container" >
          {inputTexts.map((text, index) => (
            <input
              key={index}
              type="text"
              value={text}
              onChange={(e) => {
                const updatedInputs = [...inputTexts];
                updatedInputs[index] = e.target.value;
                setInputTexts(updatedInputs);
              }}
              placeholder={`Enter text for comic panel ${index + 1}`}
            />
          ))}
        </div>
        <button className="generate-button" onClick={generateComic}>
          {loading ? 'Generating...' : 'Generate Comic'}
        </button>
        {error && <p className="error-message">{error}</p>}
        
      </div>
      <div style={{width: isMobile ? '100%' : '60%'}}>
      {!loading && <div  className="comic-panels">
          {comicPanels.map((panel, index) => (
            <img style={{width:'70%'}} key={index} src={URL.createObjectURL(panel)} alt={`Comic Panel ${index + 1}`} />
          ))}
        </div>}
        </div>
      </div>
    );
  };
  
  export default ComicGenerator;
