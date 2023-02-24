import * as fs from 'fs-extra';
import util from "util";

export async function unlinkFile(path: string) {
    const unlinker = util.promisify(fs.unlink);
    return unlinker(path);
}