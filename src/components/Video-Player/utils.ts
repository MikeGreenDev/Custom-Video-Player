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
