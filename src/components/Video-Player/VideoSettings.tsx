import { cn } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"

type Prettify<T> = {
    [K in keyof T]: T[K];
} & {}

enum SettingPages {
    MAIN,
    PLAYBACK_RATE
}

export type VideoSettingsProps = {
    playbackRateOptions?: number[] | boolean
    playbackRateCallback?: (playback: number) => void
}

export default function VideoSettings(props: Prettify<VideoSettingsProps>) {
    const [page, setPage] = useState<SettingPages>(SettingPages.MAIN)

    const settingBtnStyles  = "hover:bg-black hover:text-[#0caadc] rounded-md";
    const settingBtnPadding = "px-8 py-1";

    const getPage = (p: SettingPages) => {
        switch (p) {
            case SettingPages.MAIN:
                return (
                    <>
                        {props.playbackRateOptions &&
                            <button className={cn(settingBtnStyles, settingBtnPadding)} onClick={() => setPage(SettingPages.PLAYBACK_RATE)}>
                                Playback Rate
                            </button>
                        }
                    </>
                )
            case SettingPages.PLAYBACK_RATE:
                return (
                    <>
                        {props.playbackRateOptions &&
                            <div className="flex flex-col">
                                <button className={settingBtnStyles} onClick={() => setPage(SettingPages.MAIN)}>
                                    <div className="flex flex-row gap-1 py-2">
                                        <ArrowLeft className="my-auto"/>
                                        Back
                                    </div>
                                </button>
                                <div className="flex flex-col">
                                    {(Array.isArray(props.playbackRateOptions) ? props.playbackRateOptions : [1, .75, .50, .25]).map((p, i) => (
                                        <button key={p + i} className={cn(settingBtnStyles, settingBtnPadding)} onClick={() => {if (props.playbackRateCallback) props.playbackRateCallback(p)}}>
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        }
                    </>
                )
        }
    }

    return (
        <div id={"Video-Settings-Container"} className="py-2 px-2 w-fit h-fit absolute bottom-14 right-4 rounded-md min-h-20 min-w-20 backdrop-blur-sm bg-black/60 z-10">
            {getPage(page)}
        </div>
    )
}

