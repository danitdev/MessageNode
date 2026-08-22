import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname_utils = path.dirname(__filename);
const __dirname_project = path.dirname(__dirname_utils);

export default __dirname_project;