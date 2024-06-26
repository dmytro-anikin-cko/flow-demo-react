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
            <div className='bg-slate-200 rounded-xl p-8 mb-4'>
              <div className='italic'>
                <p>
                  Use one of the following <a className="text-blue-500 underline" target="_blank" rel="noopener noreferrer" href="https://www.checkout.com/docs/developer-resources/testing/test-cards">test cards</a>.
                </p>
              </div>
            </div>
            <div>
                <Flow language={language} />
            </div>
        </section>
    )
}