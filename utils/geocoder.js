import { default as NodeGeoCoder } from "node-geocoder";

// temporarily defining env_vars here, as it's not working
const options = {
	provider: process.env.GEOCODER_PROVIDER || "mapquest",
	httpAdapter: "https",
	apiKey: process.env.GEOCODER_API_KEY || "3w9nnAcMlOivaAbXLivBSOG9aYXz14Sc",
	formatter: null,
};

const geocoder = NodeGeoCoder(options);
export default geocoder;
