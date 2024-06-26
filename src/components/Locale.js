"use client"
import { useEffect } from "react";


export default function Locale({ language, onLanguageChange }) {
    useEffect(() => {
        localStorage.setItem("language", language);
      }, [language]);
    
      const handleLanguageChange = (event) => {
        const selectedLanguage = event.target.getAttribute('data-lang');
        onLanguageChange(selectedLanguage);
      };
    
      const getLanguageLabel = (lang) => {
        switch (lang) {
          case 'fr':
            return 'French';
          case 'nl':
            return 'Dutch';
          default:
            return 'English';
        }
      };

  return (
    <div className="flex flex-col items-center justify-between p-24">
      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn m-1">
          {getLanguageLabel(language)}
        </div>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
          <li><a data-lang="en" onClick={handleLanguageChange}>English</a></li>
          <li><a data-lang="fr" onClick={handleLanguageChange}>French</a></li>
          <li><a data-lang="nl" onClick={handleLanguageChange}>Dutch</a></li>
        </ul>
      </div>
    </div>
  );
}
