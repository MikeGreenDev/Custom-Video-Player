import { FullscreenIcon, Pause, Play, Repeat, Settings, Volume, Volume1Icon, Volume2Icon, VolumeX } from "lucide-react"
import { DetailedHTMLProps, ReactNode, useEffect, useRef, useState, VideoHTMLAttributes } from "react"
import { secondsToHHMMSS } from "./utils"
import VideoSettings, { VideoSettingsProps } from "./VideoSettings"

// Unhides types in LSP.
// Exp. Instead of the LSP saying VideoPlayerProps. It becomes { src: string, videoProps?: HTMLVideoProps, ...}
type Prettify<T> = {
    [K in keyof T]: T[K];
} & {}

export type VideoPlayerCustomBtn = {
    value: boolean
    iconNodeTrue: ReactNode | ReactNode[]
    iconNodeFalse: ReactNode | ReactNode[]
    callback: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export type VideoPlayerProps = {
    src: string
    onVideoEnd?: () => void
    videoProps?: Prettify<Partial<DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>>>
    videoPlayerSettingsProps?: Prettify<Omit<VideoSettingsProps, "playbackRateCallback">>
    customBtns?: VideoPlayerCustomBtn[]
    loopBtn?: boolean
    color?: string
}

export default function VideoPlayer(props: Prettify<VideoPlayerProps>) {
    const [_playing, setPlaying] = useState<boolean>(false)
    const [_fullscreen, setFullscreen] = useState<boolean>(false)
    const [muted, setMuted] = useState<boolean>(false)
    const [volume, setVolume] = useState<number>(1)
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false)
    const [playbackRate, setPlaybackRate] = useState<number>(1)
    const [loop, setLoop] = useState<boolean>(props.videoProps?.loop || false)
    const color = props.color || "#0caadc"

    const videoRef = useRef<HTMLVideoElement>(null)
    const videoContainerRef = useRef<HTMLDivElement>(null)
    const timelineRef = useRef<HTMLDivElement>(null)
    const thumbRef = useRef<HTMLDivElement>(null)
    const progressRef = useRef<HTMLDivElement>(null)
    const bufferRef = useRef<HTMLDivElement>(null)
    const volumeInputRef = useRef<HTMLInputElement>(null)

    const [currentTime, setCurrentTime] = useState<number>(videoRef.current?.currentTime || 0);
    const [duration, setDuration] = useState<number>(videoRef.current?.duration || 0);

    const playbackRateCallback = (p: number) => {
        setPlaybackRate(p);
    }

    const handlePlayPauseClick = () => {
        if (videoRef.current) {
            if (!videoRef.current.paused) {
                videoRef.current.pause();
                setPlaying(false)
            } else {
                videoRef.current.play();
                setPlaying(true)
            }
        }
    };

    const toggleFullscreen = () => {
        if (!videoRef.current && !videoContainerRef.current) return;

        if (!document.fullscreenElement) {
            if (videoContainerRef.current !== null && videoContainerRef.current.requestFullscreen) {
                videoContainerRef.current.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    const onFullScreenChange = () => {
        if (document.fullscreenElement !== null) {
            setFullscreen(true);
        } else {
            setFullscreen(false);
        }
    };

    const updateTimelineUI = () => {
        if (!videoRef.current || !timelineRef.current || !progressRef.current || !bufferRef.current || !thumbRef.current) {
            return;
        }
        progressRef.current.style.width = (videoRef.current.currentTime / videoRef.current.duration * 100).toString() + "%"
        thumbRef.current.style.left = (progressRef.current.getBoundingClientRect().right) - thumbRef.current.getBoundingClientRect().width + "px"
    }

    const placeVideoTime = (e: MouseEvent) => {
        if (!videoRef.current || !timelineRef.current) return;
        const rect = timelineRef.current.getBoundingClientRect()
        const percent = Math.min(Math.max(0, e.clientX - rect.x), rect.width) / rect.width
        videoRef.current.currentTime = percent * videoRef.current.duration;
    }

    const timelineMouseDown = (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!videoRef.current || !timelineRef.current) return;
        videoRef.current.classList.add("Video-Scrubbing")
        // placeVideoTime(e);
        updateTimelineUI();
    }

    const documentTimelineUp = (e: MouseEvent) => {
        if (videoRef.current && videoRef.current.classList.contains("Video-Scrubbing")) {
            videoRef.current.classList.remove("Video-Scrubbing")
            placeVideoTime(e);
            updateTimelineUI();
        }
    }

    const documentTimelineMove = (e: MouseEvent) => {
        if (videoRef.current && videoRef.current.classList.contains("Video-Scrubbing")) {
            placeVideoTime(e);
            updateTimelineUI();
        }
    }

    const onTimeUpdate = () => {
        setCurrentTime(videoRef.current?.currentTime || 0);
        updateTimelineUI();
    }

    useEffect(() => {
        if (!videoRef.current) return;
        videoRef.current.playbackRate = playbackRate
    }, [playbackRate])

    useEffect(() => {
        if (!videoRef.current) return;
        if (muted) {
            if (videoRef.current.volume === 0) return;
            videoRef.current.volume = 0;
        } else {
            videoRef.current.volume = volume;
        }
    }, [muted, volume]);

    useEffect(() => {
        if (!videoRef.current) {
            return
        }

        const vid = videoRef.current;

        setDuration(vid.duration);

        const keyHolds = (e: any) => {
            const tagName = document.activeElement?.tagName.toLowerCase();
            if (tagName === 'input') return;
            switch (e.key.toLowerCase()) {
                case 'arrowright':
                case 'l':
                    vid.currentTime += 5;
                    break;
                case 'arrowleft':
                case 'j':
                    vid.currentTime -= 5;
                    break;
                case 'arrowup':
                    setVolume(prev => {
                        let v = Math.min(prev + .1, 1)
                        if (volumeInputRef.current) volumeInputRef.current.value = (v * 100).toString()
                        return v;
                    });
                    break;
                case 'arrowdown':
                    setVolume(prev => {
                        let v = Math.max(prev - .1, 0)
                        if (volumeInputRef.current) volumeInputRef.current.value = (v * 100).toString()
                        return v;
                    });
                    break;
                default:
                    break;
            }
        }

        const keyPresses = (e: any) => {
            e.preventDefault()
            const tagName = document.activeElement?.tagName.toLowerCase();
            if (tagName === 'input') return;
            switch (e.key.toLowerCase()) {
                case ' ':
                    if (tagName === 'button') return;
                    handlePlayPauseClick();
                    break;
                case 'k':
                    handlePlayPauseClick()
                    break;
                case 'm':
                    setMuted((prev) => !prev)
                    break;
                case 'f':
                    toggleFullscreen()
                    break;
                default:
                    break;
            }
        }

        const onEnded = () => {
            if (props.onVideoEnd) {
                props.onVideoEnd();
            }
        }

        document.addEventListener("keyup", keyPresses)
        document.addEventListener("keydown", keyHolds)
        document.addEventListener("fullscreenchange", onFullScreenChange);
        document.addEventListener("mozfullscreenchange", onFullScreenChange);
        document.addEventListener("webkitfullscreenchange", onFullScreenChange);
        document.addEventListener("msfullscreenchange", onFullScreenChange);

        vid.addEventListener("ended", onEnded);

        vid.addEventListener("timeupdate", onTimeUpdate);

        if (timelineRef.current) {
            timelineRef.current.addEventListener("mousedown", timelineMouseDown)
            document.addEventListener("mouseup", documentTimelineUp)
            document.addEventListener("mousemove", documentTimelineMove)
        }

        return () => {
            document.removeEventListener("keyup", keyPresses);
            document.removeEventListener("keyhold", keyHolds)
            document.removeEventListener("fullscreenchange", onFullScreenChange);
            document.removeEventListener("mozfullscreenchange", onFullScreenChange);
            document.removeEventListener("webkitfullscreenchange", onFullScreenChange);
            document.removeEventListener("msfullscreenchange", onFullScreenChange);
            if (timelineRef.current) {
                timelineRef.current.removeEventListener("mousedown", timelineMouseDown)
                document.removeEventListener("mouseup", documentTimelineUp)
                document.removeEventListener("mousemove", documentTimelineMove)
            }
            vid.removeEventListener("ended", onEnded);

            vid.removeEventListener("timeupdate", onTimeUpdate);
        }
    }, [])

    return (
        <div className="h-fit">
            <div ref={videoContainerRef} className='flex h-fit bg-[rgb(41,41,41)] flex-col items-center justify-center relative overflow-hidden group' id="videoContainer">
                <video ref={videoRef} onClick={handlePlayPauseClick} {...props.videoProps} loop={loop}>
                    <source src={props.src || props.videoProps?.src} />
                </video>
                <div className="Bottom-Controls block w-full absolute bottom-0 px-2">
                    <div
                        className='group/timelineBar relative flex cursor-pointer overflow-visible w-full transiton-[height] duration-[0.1s] ease-linear h-[6px]
                                mb-[.5rem] bg-[rgba(193,193,193,0.5)] hover:h-[10px] rounded-md'
                        ref={timelineRef}>
                        <div className={`absolute opacity-0 w-[1em] h-[1em] overflow-visible rounded-full bottom-[-75%]
                                group-hover/timelineBar:bottom-[-25%] group-hover/timelineBar:opacity-100 z-10 pointer-events-none`} ref={thumbRef}
                            style={{ background: color }}
                        />
                        <div className='progressBarColors flex relative w-full h-full overflow-hidden'>
                            <div
                                className={`playProgress h-full z-[1] relative rounded-md`}
                                style={{ background: color }}
                                ref={progressRef}
                            >
                            </div>

                            <div
                                className='bufferProgress absolute h-full bg-slate-400 rounded-md'
                                ref={bufferRef}
                            />
                        </div>
                    </div>
                    <div id="buttons" className="flex flex-row gap-2 text-foreground">
                        <button
                            className='playBtn flex items-center cursor-pointer p-0 w-fit'
                            onClick={handlePlayPauseClick}>
                            {!videoRef.current?.paused ? (
                                <Pause />
                            ) : (
                                <Play />
                            )}
                        </button>
                        <div>
                            <span>{secondsToHHMMSS(currentTime || 0)}</span>
                            <span>/</span>
                            <span>{secondsToHHMMSS(duration || 0)}</span>
                        </div>
                        <div className="group/volume flex flex-row gap-2 w-fit">
                            <button
                                className='flex items-center cursor-pointer p-0'
                                onClick={() => setMuted(prev => !prev)}
                            >
                                {muted ? (
                                    <VolumeX />
                                ) : (
                                    volume > .7 ? (
                                        <Volume2Icon />
                                    ) : (
                                        volume > .35 ? (
                                            <Volume1Icon />
                                        ) : (
                                            <Volume />
                                        )
                                    )
                                )}
                            </button>
                            <div className='group-hover/volume:opacity-100 group-hover/volume:w-full group-hover/volume:block w-0 opacity-0 hidden'>
                                <input
                                    id="volumeInput"
                                    ref={volumeInputRef}
                                    className={`cursor-pointer border-1 border-slate-400 rounded-xl accent-(--user-color)`}
                                    style={{
                                        "--user-color": color,
                                    } as any}
                                    type="range"
                                    min="0"
                                    max="100"
                                    defaultValue="100"
                                    onChange={(e) => setVolume(e.target.valueAsNumber / 100)}></input>
                            </div>
                        </div>
                        <div className="grow" />
                        {props.customBtns &&
                            <div className="flex flex-row gap-2 w-fit">
                                {props.customBtns.map((v, i) => {
                                    if (v.value) {
                                        return (
                                            <button key={"Custom-Buttons-" + i} onClick={v.callback} className="relative">
                                                {v.iconNodeTrue}
                                            </button>
                                        )
                                    } else {
                                        return (
                                            <button key={"Custom-Buttons-" + i} onClick={v.callback} className="relative">
                                                {v.iconNodeFalse}
                                            </button>
                                        )
                                    }
                                })}
                            </div>
                        }
                        {props.loopBtn &&
                            <div className="flex flex-row gap-2 w-fit">
                                <button onClick={() => setLoop(prev => !prev)} className="relative">
                                    <Repeat color={loop ? color : "currentColor"} />
                                </button>
                            </div>
                        }
                        <div className="flex flex-row gap-2 w-fit">
                            <button onClick={() => setSettingsOpen(!settingsOpen)} id={"Video-Player-Settings-Btn"} className="relative">
                                <Settings />
                            </button>
                            {settingsOpen &&
                                <VideoSettings {...props.videoPlayerSettingsProps} playbackRateCallback={playbackRateCallback} />
                            }
                        </div>
                        <button title="Fullscreen" onClick={toggleFullscreen}>
                            <FullscreenIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

