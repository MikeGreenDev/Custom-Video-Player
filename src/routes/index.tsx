import { CaptionColor } from '@/components/Video-Player/utils';
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
        <VideoPlayer src='We Played a 72 Hour Game of Tag Across Europe-q2tJqO6nCSc-Jet Lag： The Game.mkv' videoProps={{ preload: "metadata" }} captions="advanced"
            videoPlayerSettingsProps={{ playbackRateOptions: true }}
            onVideoEnd={videoEndedCallback}
            customBtns={[{ value: favoriteValue, iconNode: favoriteValue ? <Star fill='yellow' color='yellow' /> : <Star />, callback: favoriteCallback }]}
            loopBtn
            captionFiles={[
                { fileSrc: "We Played a 72 Hour Game of Tag Across Europe-q2tJqO6nCSc-Jet Lag： The Game.en.vtt", shorthand: "En", lang: "en", langDisplay: "English" },
                { fileSrc: "FakeEn.en.vtt", shorthand: "En Fake", lang: "en", langDisplay: "Fake Eng" }
            ]}
            defaultCaptionState={
                {
                    "color": CaptionColor.green,
                    "background-color": CaptionColor.black,
                    "background-opacity": "25%",
                    "font-size": "1.5em",
                    "outline-color": CaptionColor.yellow,
                    "character-edge": "None",
                    "edge-color": CaptionColor.black
                }

            }
        />
    )
}
