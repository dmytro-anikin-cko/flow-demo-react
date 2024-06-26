"use client"
import Link from "next/link";
import { useState } from "react";

export default function Home() {

  const [language, setLanguage] = useState("en");

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    // Store the selected language in local storage
    localStorage.setItem("language", event.target.value);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex">
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">English</span>
            <input type="radio" name="radio-10" className="radio checked:bg-blue-500" value='en' defaultChecked checked={language === "en"}
              onChange={handleLanguageChange} />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">French</span>
            <input type="radio" name="radio-10" className="radio checked:bg-blue-500" value='fr' defaultChecked checked={language === "fr"}
              onChange={handleLanguageChange} />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Dutch</span>
            <input type="radio" name="radio-10" className="radio checked:bg-blue-500" value='nl' defaultChecked checked={language === "nl"}
              onChange={handleLanguageChange} />
          </label>
        </div>
      </div>

      <div>
        <Link className="link link-primary" href={'/checkout'}>Proceed to payment</Link>
      </div>
    </main>
  );
}
