import ReactPlayer from 'react-player';
import './VideoStream.css';
const URL_VIDEO_SERVER = import.meta.env.VITE_URL_VIDEO_SERVER;
//https://www.npmjs.com/package/react-player
const VideoStream: React.FC = () => {
    return (
        <div id="container">
            <ReactPlayer
                url={
                    URL_VIDEO_SERVER + "/video"
                }
                controls
                autoPlay={true}>

            </ReactPlayer>
        </div>
    );
};

export default VideoStream;
