import VideoPlayer from '@/components/Video-Player/VideoPlayer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
    const videoEndedCallback = () => {
        console.log("Video Ended");
    }

    return (
        <VideoPlayer src='test.mkv' videoProps={{preload: "metadata"}} videoPlayerSettingsProps={{playbackRateOptions:true}} onVideoEnd={videoEndedCallback}/>
    )
}
