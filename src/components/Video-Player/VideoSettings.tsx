import { ArrowLeft } from "lucide-react"
import { ReactNode, useState } from "react"

type Prettify<T> = {
    [K in keyof T]: T[K];
} & {}

enum SettingPages {
    MAIN,
    PLAYBACK_RATE
}

export type VideoSettingsProps = {
    color?: string
    playbackRateOptions?: number[] | boolean
    playbackRateCallback?: (playback: number) => void
}

export default function VideoSettings(props: Prettify<VideoSettingsProps>) {
    const color = props.color || "#0caadc"

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

    const [page, setPage] = useState<SettingPages>(SettingPages.MAIN)

    const getPage = (p: SettingPages) => {
        switch (p) {
            case SettingPages.MAIN:
                return (
                    <>
                        {props.playbackRateOptions &&
                            <SettingsBtn onClick={() => setPage(SettingPages.PLAYBACK_RATE)}>
                                Playback Rate
                            </SettingsBtn>
                        }
                    </>
                )
            case SettingPages.PLAYBACK_RATE:
                return (
                    <>
                        {props.playbackRateOptions &&
                            <div className="flex flex-col">
                                <SettingsBtn noPadding onClick={() => setPage(SettingPages.MAIN)}>
                                    <div className="flex flex-row gap-1 py-2">
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
        }
    }

    return (
        <div id={"Video-Settings-Container"} className="py-2 px-2 w-fit h-fit absolute bottom-14 right-4 rounded-md min-h-20 min-w-20 backdrop-blur-sm bg-black/60 z-10">
            {getPage(page)}
        </div>
    )
}

