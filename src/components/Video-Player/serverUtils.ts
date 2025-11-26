import fs from "fs"
export function parseVTT(file: string): Promise<{ [key: string]: any }> {
    return new Promise((resolve, reject) => {
        let r: { [key: string]: any } = {}
        let f = fs.createReadStream("public/" + file, { encoding: "utf8", highWaterMark: 6 * 1024 });
        f.on('data', (chunk) => {
            console.log("New Chunk")
            let inStyles: boolean = false
            let lines = chunk.toString().split('\n')
            for (let i = 0; i < lines.length; i++) {
                const l = lines[i];
                r = { l: l }
                if (l.toLowerCase().startsWith("style")){
                    inStyles = true;
                    continue
                }
                if (inStyles){
                    if (l.startsWith("::cue(")){

                    }
                }
                // console.log(i)
                // console.log(l)
                if (l.match("-->") || (inStyles && l.startsWith(""))){
                    f.close()
                    resolve(r)
                }
            }
        })
        // Done reading
        f.on('end', function() {
            resolve(r)
        });

        // Handle any stream errors.
        f.on('error', function() {
            reject({ "Error": "File Error" })
        });
    })
}
