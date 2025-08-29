import React, { useState, useEffect, useCallback } from 'react';
import VideoCard from './VideoCard';

const VIDEOS_PER_PAGE = 6;

const PastEvents = ({ videos, loading }) => {
    // --- State is now simpler: just for lazy loading ---
    const [visibleVideos, setVisibleVideos] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    // --- EFFECT to reset videos when the main data changes ---
    useEffect(() => {
        setVisibleVideos(videos.slice(0, VIDEOS_PER_PAGE));
        setHasMore(videos.length > VIDEOS_PER_PAGE);
    }, [videos]);

    const loadMoreVideos = useCallback(() => {
        if (visibleVideos.length >= videos.length) {
            setHasMore(false);
            return;
        }
        const nextVideos = videos.slice(visibleVideos.length, visibleVideos.length + VIDEOS_PER_PAGE);
        setVisibleVideos(prev => [...prev, ...nextVideos]);
    }, [videos, visibleVideos.length]);

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
        <>
            <div className="video-grid">
                {visibleVideos.map((video) => (
                    <VideoCard key={video.id.videoId + Math.random()} video={video} />
                ))}
            </div>
            {loading && videos.length === 0 && <p className="status-message">Loading Events...</p>}
            {hasMore && <p className="status-message">Loading more...</p>}
            {!hasMore && !loading && videos.length > 0 && <p className="status-message">You have reached the end.</p>}
        </>
    );
};

export default PastEvents;