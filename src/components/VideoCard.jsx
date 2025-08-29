import React from 'react';

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// --- SVG Icons for Social Sharing ---
const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
);

const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
);


const VideoCard = ({ video }) => {
  const { snippet } = video;
  const videoId = video.id.videoId;
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const handleShare = async (e) => {
    e.preventDefault(); // Prevent link navigation
    const shareData = { title: snippet.title, text: snippet.title, url: videoUrl };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(videoUrl);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  return (
    <div className="video-card">
      <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="video-thumbnail-link">
        <img src={snippet.thumbnails.medium.url} alt={snippet.title} />
        <div className="play-icon"></div>
      </a>
      <div className="video-info">
        <p className="video-date">{formatDate(snippet.publishedAt)}</p>
        <h3 className="video-title">
             <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                {snippet.title}
            </a>
        </h3>
        <div className="card-footer">
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`} target="_blank" rel="noopener noreferrer" className="social-icon"><FacebookIcon /></a>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(videoUrl)}&text=${encodeURIComponent(snippet.title)}`} target="_blank" rel="noopener noreferrer" className="social-icon"><TwitterIcon /></a>
            <button onClick={handleShare} className="social-icon share-button"><ShareIcon /></button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;