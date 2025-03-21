import ReactPlayer from 'react-player';
import './VideoStream.css';
const URL_VIDEO_SERVER = import.meta.env.VITE_URL_VIDEO_SERVER; //NODE VERSION

const URL_VIDEO_SERVER_B = import.meta.env.VITE_URL_VIDEO_SERVER_B; // JAVA VERSION
//https://www.npmjs.com/package/react-player
const VideoStream: React.FC = () => {
    return (
        <div id="container">
            <ReactPlayer
                url={
                    //URL_VIDEO_SERVER + "/video"
                    URL_VIDEO_SERVER_B + "/videos/stream"
                }
                controls
                autoPlay={true}>

            </ReactPlayer>
            <ReactPlayer
                url={
                    URL_VIDEO_SERVER_B + "/video"
                }
                controls
                autoPlay={true}>

            </ReactPlayer>
        </div>
    );
};

export default VideoStream;
