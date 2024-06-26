"use client"

import Flow from "@/components/Flow"
import Locale from "@/components/Locale"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function Checkout(){

    const [language, setLanguage] = useState("en");

    useEffect(() => {
      const storedLanguage = localStorage.getItem("language");
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
    }, []);
  
    const handleLanguageChange = (newLanguage) => {
      setLanguage(newLanguage);
      localStorage.setItem("language", newLanguage);
    };

    return (
        <section>
            <div>
                <p>Checkout Page</p>
            </div>
            <div>
                <Link className="link link-primary" href={'/'}>Back to Home</Link>
            </div>
            <div>
                <Locale language={language} onLanguageChange={handleLanguageChange} />
            </div>
            <div>
                <Flow language={language} />
            </div>
        </section>
    )
}