import { useState } from 'react';
import axios from 'axios';
import { storage } from './firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import 'tailwindcss/tailwind.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [prompt, setPrompt] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const storageRef = ref(storage, `images/${selectedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Error uploading file:', error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            setPrompt(downloadURL);
          });
        }
      );
    }
  };

  const fetchData = async (search) => {
    setLoading(true);
    let url = '';
    if (prompt !== '') {
      url = prompt;
    } else {
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/generate-report', { url: url, search });
      const message = response.data.message;

      // Trim first 7 characters and last 4 characters
      const trimmedMessage = message.substring(7, message.length - 4);
      console.log(trimmedMessage);

      // Parse the JSON string received
      const jsonData = JSON.parse(message);
      setData(jsonData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setSearch(event.target.value);
    // console.log(search);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Enter Text:</label>
        <input
          name="Text"
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter Text"
        />
      </div>
      <button
        onClick={() => fetchData(search)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Generate Data
      </button>
      {loading && <p className="mt-4 text-blue-500">Loading...</p>}
      {data && (
        <div className="mt-8 bg-white shadow-md rounded p-6">
          <h1 className="text-2xl font-bold mb-4">{data.title}</h1>
          <p className="mb-4">{data.description}</p>
          {data.subtopics?.map((subtopic, index) => (
            <div key={index} className="mb-4">
              <h2 className="text-xl font-semibold mb-2">{subtopic.title}</h2>
              <ul className="list-disc list-inside">
                {subtopic.points?.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <input type="file" onChange={handleFileChange} className="mb-4" />
        <button
          onClick={handleUpload}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Upload
        </button>
        <p className="mt-2">Upload Progress: {uploadProgress}%</p>
      </div>
    </div>
  );
}

export default App;
