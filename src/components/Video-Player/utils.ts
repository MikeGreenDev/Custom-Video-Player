export const CaptionActionTypeArray = ["color", "background-color", "background-opacity", "font-size", "outline-color", "character-edge", "edge-color"] as const;
type CaptionActionType = typeof CaptionActionTypeArray[number];

export function CaptionActionTypeToReadable(c: CaptionActionType): string {
    return c.replaceAll("-", " ")
}

export function CaptionReadableToActionType(c: string): CaptionActionType {
    return c.replaceAll(" ", "-") as CaptionActionType
}

// An interface for our actions
export type CaptionAction = {
    type: "color" | "background-color" | "outline-color" | "edge-color";
    payload: CaptionColor
} | {
    type: string;
    payload: string
}

export enum CaptionColor {
    white = 'rgb(255,255,255)',
    black = 'rgb(0,0,0)',
    red = 'rgb(255,0,0)',
    green = 'rgb(0,255,0)',
    blue = 'rgb(0,0,255)',
    yellow = 'rgb(255,255,0)',
    magenta = 'rgb(255,0,255)',
    cyan = 'rgb(0,255,255)',
    transparent = 'transparent'
}

export const defaultCaptionState: CaptionState = {
    "color": CaptionColor.white,
    "background-color": CaptionColor.black,
    "background-opacity": "75%",
    "font-size": "2em",
    "outline-color": CaptionColor.black,
    "character-edge": "None",
    "edge-color": CaptionColor.black
}

// An interface for our state
export type CaptionState = {
    "color": CaptionColor
    "background-color": CaptionColor
    "background-opacity": string
    "font-size": string
    "outline-color": CaptionColor
    "character-edge": string
    "edge-color": CaptionColor
}

export function captionReducer(state: CaptionState, action: CaptionAction) {
    if (action.type == "font-size") {
        const str = action.payload.slice(0, -1)
        const num = 2 * (Number(str) / 100)
        const s = String(num) + "em"
        return { ...state, [action.type]: s };
    } else if (action.type == "color" || action.type == "background-color" || action.type == "outline-color" || action.type == "edge-color") {
        return { ...state, [action.type]: displayColorsToCaptionColors(action.payload) };
    } else {
        return { ...state, [action.type]: action.payload }
    }
}

export const characterEdgeTextShadow = (s: string, edgeColor: string): string => {
    if (s == "Raised") {
        return `-1px -1px 4px ${edgeColor}, 1px -1px 4px ${edgeColor},
            -1px 1px 4px ${edgeColor}, 1px 1px 4px ${edgeColor}`
    } else if (s == "Depressed") {
        return `0px -3px 2px ${edgeColor}`
    } else if (s == "Uniform") {
        return `2px 0 ${edgeColor}, -2px 0 ${edgeColor}, 0 2px ${edgeColor}, 0 -2px ${edgeColor},
             1px 1px ${edgeColor}, -1px -1px ${edgeColor}, 1px -1px ${edgeColor}, -1px 1px ${edgeColor}`
    } else if (s == "Drop Shadow") {
        return `-3px 0 2px ${edgeColor}`
    }
    return "";
}

export const ColorDisplayNameArray = ["White", "Black", "Red", "Green", "Blue", "Yellow", "Magenta", "Cyan"]

export const displayColorsToCaptionColors = (s: string): string => {
    switch (s) {
        case "White":
            return CaptionColor.white
        case "Black":
            return CaptionColor.black
        case "Red":
            return CaptionColor.red
        case "Blue":
            return CaptionColor.blue
        case "Green":
            return CaptionColor.green
        case "Yellow":
            return CaptionColor.yellow
        case "Magenta":
            return CaptionColor.magenta
        case "Cyan":
            return CaptionColor.cyan
        case "Transparent":
            return CaptionColor.transparent
        default:
            break;
    }
    return "Error"
}

export const captionColorsToDisplayColors = (s: string): string => {
    switch (s) {
        case CaptionColor.white:
            return "White"
        case CaptionColor.black:
            return "Black"
        case CaptionColor.red:
            return "Red"
        case CaptionColor.green:
            return "Green"
        case CaptionColor.blue:
            return "Blue"
        case CaptionColor.yellow:
            return "Yellow"
        case CaptionColor.magenta:
            return "Magenta"
        case CaptionColor.cyan:
            return "Cyan"
        case CaptionColor.transparent:
            return "Transparent"
        default:
            break;
    }
    return "Error"
}

export const AddAlphaToRGBColor = (color: string, opacity: string): string => {
    if (color == CaptionColor.transparent) return color
    const i = color.lastIndexOf(")")
    const rgb = color.slice(0, i);
    const opc = String(Number(opacity.slice(0, -1)) / 100)
    const str = rgb + "," + opc + ")"
    return str
}

export function secondsToHHMMSS(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    let returnStr: string = "";

    if (hours > 0) {
        returnStr = returnStr.concat(hours.toString().padStart(2, '0') + ":");
    }

    // Pad each value to ensure two digits
    const paddedMinutes = minutes.toString().padStart(2, '0');
    const paddedSeconds = seconds.toString().padStart(2, '0');
    returnStr = returnStr.concat(paddedMinutes + ":" + paddedSeconds);

    return returnStr;
}
