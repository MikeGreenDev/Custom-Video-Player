import { Dispatch } from "react"
import { CaptionAction, captionColorsToDisplayColors, CaptionState, ColorDisplayNameArray } from "./utils"
import { SettingPages } from "./VideoSettings"
import { ArrowLeft } from "lucide-react"

type CaptionStylesProps = {
    menuString: SettingPages | string
    color: string
    setMenuString: Dispatch<SettingPages | string>
    captionStyles: {
        state: CaptionState
        dispatch: Dispatch<CaptionAction>
    }
}

const fontSizeToDisplaySize = (fs: string): string => {
    const f = Number(fs.slice(0, -2)) / 2
    const s = String(f * 100) + "%"
    return s
}

export default function VideoCaptionStyles(props: CaptionStylesProps) {
    const color = props.color
    const update = (str: string, val: string) => {
        str = str.toLowerCase().replaceAll(" ", "-");
        if (str == "font-color") {
            str = "color"
        }
        props.captionStyles.dispatch({ type: str, payload: val })
    }

    function styleSetting(display: string, v: any, arr: string[]): React.ReactNode {
        return (
            <div className='w-fit min-w-[10em]'>
                <div style={{
                    "--user-color": color,
                } as any}
                    className='cursor-pointer hover:text-(--user-color)'
                    onClick={() => { props.setMenuString(SettingPages.CAPTION_OPTIONS) }}><ArrowLeft /></div>
                <div className='w-max'>{display}</div>
                <hr className='mb-2' />
                {arr.map((a) => (
                    <div key={a}
                        style={{
                            "--user-color": color,
                        } as any}
                        className={`cursor-pointer ${v == a && "text-(--user-color)"} ${v != a && "hover:text-(--user-color)"}`}
                        onClick={() => { update(display, a) }}>
                        <div className='ml-auto w-fit pr-2'>
                            {a}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    function styleInfo(display: string, v: any): React.ReactNode {
        return (
            <div className='flex flex-row cursor-pointer mb-1 group/setting' onClick={() => { props.setMenuString(display) }}>
                <div className='w-max mr-6'>{display}</div>
                <div
                    style={{
                        "--user-color": color,
                    } as any}
                    className='flex-1 text-right group-hover/setting:text-(--user-color)'>{v}</div>
            </div>
        )
    }

    return (
        <div className='w-fit'>
            {props.menuString == SettingPages.CAPTION_OPTIONS &&
                <div>
                    <div
                    style={{
                        "--user-color": color,
                    } as any}
                        className='cursor-pointer hover:text-(--user-color)' onClick={() => { props.setMenuString(SettingPages.CAPTION_LANGUAGE) }}><ArrowLeft /></div>
                    <div className='w-fit text-[.9em] my-4'>
                        {styleInfo("Font Color", captionColorsToDisplayColors(props.captionStyles.state["color"]))}
                        {styleInfo("Font Size", fontSizeToDisplaySize(props.captionStyles.state["font-size"]))}
                        {styleInfo("Background Color", captionColorsToDisplayColors(props.captionStyles.state["background-color"]))}
                        {styleInfo("Background Opacity", props.captionStyles.state["background-opacity"])}
                        {styleInfo("Character Edge", props.captionStyles.state["character-edge"])}
                        {styleInfo("Edge Color", captionColorsToDisplayColors(props.captionStyles.state["edge-color"]))}
                    </div>
                </div>
            }
            {props.menuString == "Font Color" &&
                styleSetting("Font Color", captionColorsToDisplayColors(props.captionStyles.state["color"]), ColorDisplayNameArray)
            }
            {props.menuString == "Font Size" &&
                styleSetting("Font Size", fontSizeToDisplaySize(props.captionStyles.state["font-size"]), ["200%", "175%", "150%", "125%", "100%", "75%", "50%", "25%"])
            }
            {props.menuString == "Background Color" &&
                styleSetting("Background Color", captionColorsToDisplayColors(props.captionStyles.state["background-color"]), ColorDisplayNameArray)
            }
            {props.menuString == "Background Opacity" &&
                styleSetting("Background Opacity", props.captionStyles.state["background-opacity"], ["100%", "75%", "50%", "25%", "0%"])
            }
            {props.menuString == "Character Edge" &&
                styleSetting("Character Edge", props.captionStyles.state["character-edge"], ["None", "Raised", "Depressed", "Uniform", "Drop Shadow"])
            }
            {props.menuString == "Edge Color" &&
                styleSetting("Edge Color", captionColorsToDisplayColors(props.captionStyles.state["edge-color"]), ColorDisplayNameArray)
            }
        </div>
    )
}

