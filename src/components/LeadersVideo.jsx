import React, { useState, useEffect, useCallback } from 'react';
import VideoCard from './VideoCard';

const VIDEOS_PER_PAGE = 6;

// This component now receives selectedLeader and setSelectedLeader as props
const LeadersVideo = ({ leadersData, loading, selectedLeader, setSelectedLeader }) => {

    const [visibleVideos, setVisibleVideos] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    // Get the correct videos based on the prop
    // eslint-disable-next-line
    const currentVideos = leadersData[selectedLeader] || [];

    useEffect(() => {
        setVisibleVideos(currentVideos.slice(0, VIDEOS_PER_PAGE));
        setHasMore(currentVideos.length > VIDEOS_PER_PAGE);
    }, [currentVideos]);

    const loadMoreVideos = useCallback(() => {
        if (visibleVideos.length >= currentVideos.length) {
            setHasMore(false);
            return;
        }
        const nextVideos = currentVideos.slice(visibleVideos.length, visibleVideos.length + VIDEOS_PER_PAGE);
        setVisibleVideos(prev => [...prev, ...nextVideos]);
    }, [currentVideos, visibleVideos.length]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200) {
                if (hasMore) { loadMoreVideos(); }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, loadMoreVideos]);


    return (
        <div>
            <div className="leader-filter">
                <h3>Select a Leader:</h3>
                {/* The buttons now call the setSelectedLeader function from the App component */}
                <button className={selectedLeader === 'abhishek' ? 'active' : ''} onClick={() => setSelectedLeader('abhishek')}>Abhishek Banerjee</button>
                <button className={selectedLeader === 'mamata' ? 'active' : ''} onClick={() => setSelectedLeader('mamata')}>Mamata Banerjee</button>
            </div>
            
            <div className="video-grid">
                {visibleVideos.map((video) => ( <VideoCard key={video.id.videoId} video={video} /> ))}
            </div>

            {loading && currentVideos.length === 0 && <p className="status-message">Loading Videos...</p>}
            {hasMore && <p className="status-message">Loading more...</p>}
            {!hasMore && !loading && currentVideos.length > 0 && <p className="status-message">You have reached the end.</p>}
        </div>
    );
};

export default LeadersVideo;