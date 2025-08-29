import React from 'react';

// --- SVG Icons for a Professional Look ---
const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
);
const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
);

// Helper function to format the date
const formatDate = (isoString) => {
    try {
        return new Date(isoString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (e) {
        return 'Date not available';
    }
};

const FeaturedVideo = ({ video }) => {
    if (!video) {
        return null; // Return null if there's no video to feature
    }

    const videoId = video.id.videoId;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1&rel=0`;

    const handleShare = async () => {
        const shareData = { title: video.snippet.title, text: video.snippet.title, url: videoUrl };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(videoUrl);
                alert('Video link copied to clipboard!');
            }
        } catch (err) {
            console.error('Share failed:', err);
        }
    };

    return (
        <div className="featured-video-container">
            <div className="featured-video-embed">
                <iframe
                    src={embedUrl}
                    title={video.snippet.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
            <div className="featured-video-details">
                <h2 className="featured-video-title">{video.snippet.title}</h2>
                <div className="social-share-wrapper">
                    <p className="featured-video-date">Published on {formatDate(video.snippet.publishedAt)}</p>
                    <div className="social-share-buttons">
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`} target="_blank" rel="noopener noreferrer" className="social-icon-featured" aria-label="Share on Facebook"><FacebookIcon /></a>
                        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(videoUrl)}&text=${encodeURIComponent(video.snippet.title)}`} target="_blank" rel="noopener noreferrer" className="social-icon-featured" aria-label="Share on Twitter"><TwitterIcon /></a>
                        <button onClick={handleShare} className="social-icon-featured" aria-label="Share link"><ShareIcon /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedVideo;