import React from "react";

interface YouTubeEmbedProps {
    videoId: string; 
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId }) => {
    return (
        <div className="video-container">
            <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
};

export default YouTubeEmbed;
