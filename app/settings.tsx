// settings.tsx
import { useState } from 'react';
import Image from 'next/image';
import settingsIcon from './images/settings.png';

interface SettingsProps {
  updateShortcuts: (websites: Website[]) => void;
}

interface Website {
  name: string;
  url: string;
  selected: boolean;
}

export default function Settings(props: SettingsProps) {
  const [isCollapsed, setIsCollapsed] = useState(true); // State to track whether the settings panel is collapsed
  const [websites, setWebsites] = useState<Website[]>([
    { name: 'Youtube', url: 'https://youtube.com', selected: false },
    { name: 'Instagram', url: 'https://instagram.com', selected: false },
    { name: 'D2L', url: 'https://ecat.montana.edu/d2l/home', selected: false },
    { name: 'Facebook', url: 'https://www.facebook.com/', selected: false },
    { name: 'Netflix', url: 'https://www.netflix.com/', selected: false },
  ]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleWebsite = (index: number) => {
    const updatedWebsites = [...websites];
    updatedWebsites[index].selected = !updatedWebsites[index].selected;
    setWebsites(updatedWebsites);
    props.updateShortcuts(updatedWebsites); // Update shortcuts after changing selection
  };

  return (
    <div>
      <div onClick={toggleCollapse} className="settings-icon">
        <Image src={settingsIcon.src} alt="Settings Icon" width={50} height={50} />
      </div>

      {/* Display websites and checkboxes only if the panel is not collapsed */}
      {!isCollapsed && (
        <div>
          {websites.map((website, index) => (
            <div key={index}>
              <label>
                <a href={website.url} target="_blank" rel="noopener noreferrer">
                  {website.name}
                </a>
                <input
                  type="checkbox"
                  checked={website.selected}
                  onChange={() => toggleWebsite(index)}
                />
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
