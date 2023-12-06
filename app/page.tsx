'use client'
import {useState, useEffect} from 'react'
import Background from './background'
import Settings from './settings'
import './page.css'

interface Website {
  name: string;
  url: string;
  selected: boolean;
}
const initialWebsites: Website[] = [
    { name: 'D2L', url: 'https://ecat.montana.edu/d2l/home', selected: true },
    { name: 'Youtube', url: 'https://youtube.com', selected: true }
  ];
export default function Page() {
  const [shortcutWebsites, setShortcutWebsites] = useState<Website[]>(initialWebsites);
  const updateShortcuts = (websites: Website[]) => {
    setShortcutWebsites(websites.filter((website) => website.selected))
  };

  return (
    <div>
      <Background state={0} />
      <div className ="settings-icon-container">
      <Settings updateShortcuts={updateShortcuts} />
      </div>
      <div className="shortcuts-container"> 
        {shortcutWebsites.map((website, index) => (
          <a key={index} href={website.url} target="_blank" rel="noopener noreferrer">
            {website.name}
          </a>
        ))}
      </div>
      
    </div>
  );
}
