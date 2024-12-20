import { useState, useEffect } from 'react';
import axios from 'axios';

const useLanguageData = () => {
  const [languageData, setLanguageData] = useState([]);


  const fetchLanguageData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/language_data');
      setLanguageData(response.data.data || []);
      console.log(response.data.message);
    } catch (err) {
      console.error(err);
    } finally {
      <></>
    }
  };

  useEffect(() => {
    fetchLanguageData()
  }, []);

  return { languageData };
};

export default useLanguageData;
