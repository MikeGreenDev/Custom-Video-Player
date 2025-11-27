import { ArrowLeft } from "lucide-react"
import { Dispatch, ReactNode, useState } from "react"
import { CaptionObject } from "./VideoPlayer"
import { CaptionAction, CaptionState } from "./utils"
import VideoCaptionStyles from "./VideoCaptionStyles"

// <div className="flex flex-col">
//     <div className="flex flex-row gap-1 py-2 px-2">
//         <div className="flex flex-col capitalize">
//             <SettingsBtn noPadding onClick={() => setPage(SettingPages.MAIN)}>
//                 <div className="flex flex-row gap-2">
//                     <ArrowLeft className="my-auto" />
//                     <span className="px-2">Back</span>
//                 </div>
//             </SettingsBtn>
//             {CaptionActionTypeArray.map((c) => (
//                 <SettingsBtn>
//                     <div className="capitalize flex flex-row">
//                         {CaptionActionTypeToReadable(c)}
//                         <div className="grow" />
//                     </div>
//                 </SettingsBtn>
//             ))}
//         </div>
//     </div>
// </div>

type Prettify<T> = {
    [K in keyof T]: T[K];
} & {}

export enum SettingPages {
    MAIN,
    PLAYBACK_RATE,
    CAPTION_LANGUAGE,
    CAPTION_OPTIONS,
}

export type VideoSettingsProps = {
    color?: string
    playbackRateOptions?: number[] | boolean
    playbackRateCallback?: (playback: number) => void
    captionFiles?: CaptionObject[]
    captionIdx?: number
    setCaptionIdx?: Dispatch<React.SetStateAction<number>>
    captionStyles?: {
        state: CaptionState
        dispatch: Dispatch<CaptionAction>
    }
}

export default function VideoSettings(props: Prettify<VideoSettingsProps>) {
    const color = props?.color || "#0caadc"

    function SettingsBtn({ children, noPadding, ...props }: { children?: ReactNode | ReactNode[], noPadding?: boolean } & React.ComponentProps<"button">): React.ReactNode {
        return (
            <button
                style={{
                    "--user-color": color,
                } as any}
                className={`hover:bg-black hover:text-(--user-color) rounded-md ${noPadding ? "" : "px-8 py-1"}`}
                {...props}
            >
                {children}
            </button>
        )
    }

    const [page, setPage] = useState<SettingPages | string>(SettingPages.MAIN)

    const getPage = (p: SettingPages | string) => {
        switch (p) {
            case SettingPages.MAIN:
                return (
                    <div className="flex flex-col gap-2 px-2">
                        {props.playbackRateOptions &&
                            <SettingsBtn onClick={() => setPage(SettingPages.PLAYBACK_RATE)}>
                                Playback Rate
                            </SettingsBtn>
                        }
                        <SettingsBtn onClick={() => setPage(SettingPages.CAPTION_LANGUAGE)}>
                            Captions
                        </SettingsBtn>
                    </div>
                )
            case SettingPages.PLAYBACK_RATE:
                return (
                    <>
                        {props.playbackRateOptions &&
                            <div className="flex flex-col">
                                <SettingsBtn noPadding onClick={() => setPage(SettingPages.MAIN)}>
                                    <div className="flex flex-row gap-1 py-2 px-2">
                                        <ArrowLeft className="my-auto" />
                                        Back
                                    </div>
                                </SettingsBtn>
                                <div className="flex flex-col">
                                    {(Array.isArray(props.playbackRateOptions) ? props.playbackRateOptions : [1, .75, .50, .25]).map((p, i) => (
                                        <SettingsBtn key={p + i} onClick={() => { if (props.playbackRateCallback) props.playbackRateCallback(p) }}>
                                            {p}
                                        </SettingsBtn>
                                    ))}
                                </div>
                            </div>
                        }
                    </>
                )
            case SettingPages.CAPTION_LANGUAGE:
                return (
                    <div className="flex flex-col">
                        <div className="flex flex-row gap-1 py-2 px-2">
                            <SettingsBtn noPadding onClick={() => setPage(SettingPages.MAIN)}>
                                <div className="flex flex-row gap-2">
                                    <ArrowLeft className="my-auto" />
                                    <span className="px-2">Back</span>
                                </div>
                            </SettingsBtn>
                            <div className="grow" />
                            <button onClick={() => setPage(SettingPages.CAPTION_OPTIONS)} className="text-slate-500 pl-4 text-sm">Options</button>
                        </div>
                        {props.captionFiles?.map((c, i) => (
                            <SettingsBtn key={c.shorthand + i} onClick={() => { if (props.setCaptionIdx) props.setCaptionIdx(i) }}>
                                <span
                                    style={{
                                        "--user-color": color,
                                    } as any}
                                    className={`${props.captionIdx == i && "text-(--user-color) underline"}`}>{c.shorthand}</span>
                            </SettingsBtn>
                        ))}
                    </div>
                )
            case SettingPages.CAPTION_OPTIONS:
            default:
                return (
                    <>
                        {props.captionStyles &&
                            <VideoCaptionStyles color={color} menuString={page.toString()} setMenuString={setPage} captionStyles={{ state: props.captionStyles.state, dispatch: props.captionStyles.dispatch }} />
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

