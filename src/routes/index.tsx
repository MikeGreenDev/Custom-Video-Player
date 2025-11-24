import VideoPlayer from '@/components/Video-Player/VideoPlayer'
import { createFileRoute } from '@tanstack/react-router'
import { Star } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/')({ component: App })

function App() {
    const [favoriteValue, setFavoriteValue] = useState<boolean>(false)

    const videoEndedCallback = () => {
        console.log("Video Ended");
    }

    const favoriteCallback = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setFavoriteValue(prev => !prev)
        // Exp. Could Use a db to add/remove it from a favorites list
    }

    return (
        <VideoPlayer src='test.mkv' videoProps={{ preload: "metadata" }}
            videoPlayerSettingsProps={{ playbackRateOptions: true }}
            onVideoEnd={videoEndedCallback}
            customBtns={[{value: favoriteValue, iconNodeTrue: <Star fill='yellow' color='yellow' />, iconNodeFalse: <Star />, callback: favoriteCallback}]}
            loopBtn
            color='#0C0C0C'
            />
    )
}
