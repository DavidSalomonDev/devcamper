import { default as NodeGeoCoder } from "node-geocoder";
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });

// temporarily defining env_vars here, as it's not working
const options = {
	provider: process.env.GEOCODER_PROVIDER,
	httpAdapter: "https",
	apiKey: process.env.GEOCODER_API_KEY,
	formatter: null,
};

const geocoder = NodeGeoCoder(options);
export default geocoder;
