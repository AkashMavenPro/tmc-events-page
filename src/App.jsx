import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import PastEvents from './components/PastEvents';
import LeadersVideo from './components/LeadersVideo';
import FeaturedVideo from './components/FeaturedVideo';
import axios from 'axios';

const CORS_PROXY = "https://api.allorigins.win/raw?url=";
const MAMATA_CHANNEL_ID = 'UCA1S8-aM-YCEJCg4mHj20HA';
const ABHISHEK_CHANNEL_ID = 'UCFZ628cJi0OP89l432blg9A';

const parseXmlToVideos = (xmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, "application/xml");
    const entries = doc.getElementsByTagName('entry');
    const videos = [];
    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const videoId = entry.getElementsByTagName('yt:videoId')[0]?.textContent;
        const title = entry.getElementsByTagName('title')[0]?.textContent;
        const published = entry.getElementsByTagName('published')[0]?.textContent;
        const thumbnailUrl = entry.getElementsByTagName('media:thumbnail')[0]?.getAttribute('url');
        if (videoId && title && published && thumbnailUrl) {
            videos.push({ id: { videoId }, snippet: { title, publishedAt: published, thumbnails: { medium: { url: thumbnailUrl } } } });
        }
    }
    return videos;
};

function App() {
  const [activeTab, setActiveTab] = useState('pastEvents');
  const [mamataVideos, setMamataVideos] = useState([]);
  const [abhishekVideos, setAbhishekVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- LIFTED STATE: App now controls the selected leader ---
  const [selectedLeader, setSelectedLeader] = useState('abhishek');

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const mamataUrl = `${CORS_PROXY}${encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${MAMATA_CHANNEL_ID}`)}`;
        const abhishekUrl = `${CORS_PROXY}${encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${ABHISHEK_CHANNEL_ID}`)}`;
        const [mamataRes, abhishekRes] = await Promise.all([axios.get(mamataUrl), axios.get(abhishekUrl)]);
        
        // RSS feeds are already sorted newest first.
        setMamataVideos(parseXmlToVideos(mamataRes.data));
        setAbhishekVideos(parseXmlToVideos(abhishekRes.data));
      } catch (err) {
        setError("Could not load video data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // --- DYNAMIC FEATURED VIDEO LOGIC ---
  let featuredVideo = null;
  if (activeTab === 'pastEvents') {
      const allVideos = [...mamataVideos, ...abhishekVideos];
      allVideos.sort((a, b) => new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt));
      featuredVideo = allVideos[0] || null;
  } else { // activeTab is 'leadersVideo'
      const leaderVideos = selectedLeader === 'abhishek' ? abhishekVideos : mamataVideos;
      featuredVideo = leaderVideos[0] || null;
  }

  // --- Prepare props for child components ---
  const allPastEvents = [...mamataVideos, ...abhishekVideos]
    .sort((a, b) => new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt))
    .filter(video => video.id.videoId !== featuredVideo?.id.videoId);

  const leadersData = {
    mamata: mamataVideos.filter(video => video.id.videoId !== featuredVideo?.id.videoId),
    abhishek: abhishekVideos.filter(video => video.id.videoId !== featuredVideo?.id.videoId),
  };
  

  return (
    <div className="app-container">
      {loading && <p className="status-message">Loading Featured Video...</p>}
      {error && <p className="status-message error">{error}</p>}
      {!loading && !error && <FeaturedVideo video={featuredVideo} />}

      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="content-area">
        {activeTab === 'pastEvents' ? (
          <PastEvents videos={allPastEvents} loading={loading} />
        ) : (
          // Pass the selectedLeader state and its setter function down to the component
          <LeadersVideo 
            leadersData={leadersData} 
            loading={loading}
            selectedLeader={selectedLeader}
            setSelectedLeader={setSelectedLeader}
          />
        )}
      </main>
    </div>
  );
}

export default App;