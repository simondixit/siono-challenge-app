import { useState } from 'react'
import './App.css'

function App() {
  const [file, setFile] = useState<any>(null)
  const [top, setTop] = useState<string>('1')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  function handleFileChange(event: any) {
    setFile(event.target.files[0])
  }

  function submitFile() {
    if(!loading) {
      setError("")
      const formData = new FormData();
      formData.append('file', file);
      setLoading(true)
      setResult(null)
      fetch(`/api/v1/upload/${top}`, { method: 'post', body: formData })
      .then(async response => {
        const data = await response.json()
        if(response.status !== 200) throw new Error(data.message);
        return data
      })
      .then(response => {
        setResult(response)
        setLoading(false)
      })
      .catch(err => {
        setError(`Error: ${err.message}`)
        setLoading(false)
      })
    }
  }

  return (
    <div className="App">
      <h1 className="title">Word Frequencies App</h1>
      <p className="description">Upload a txt file to discover the most frecuented words within it!</p>
      <div className="content">
        <div className="action-wrapper">
          <label>
            <span className="button">Choose File</span>
            <span className="file-details">{file && ` : ${file.name} - ${(file.size / 1024).toFixed(2)}Kb`}</span>
            <input type="file" accept="text/plain" onChange={(e) => handleFileChange(e)} hidden/>
          </label>
          <div className="submit-wrapper">
            <input type="number" placeholder="1" onChange={(e) => setTop(e.target.value)} />
            <button className="button" onClick={submitFile} disabled={loading}>Submit</button>
          </div>
        </div>
        <ul className="list-wrapper">
          {result ? result.frecuencies.map((item: { word: string, count: number }, idx: any) => (
            <li key={idx} className="list-item">
              <span>{item.word}:</span>
              <span>{item.count}</span>
            </li>
          )) : 
          <li className="default-item">{loading ? "Please wait..." : "Nothing yet :P"}</li>
          }
          {error && <li className="error-item">{error}</li>}
        </ul>
      </div>
    </div>
  )
}

export default App
