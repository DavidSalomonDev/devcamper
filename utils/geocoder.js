import { default as NodeGeoCoder } from "node-geocoder";

const options = {
	provider: process.env.GEOCODER_PROVIDER,

	// Optional depending on the providers
	httpAdapter: "https",
	apiKey: process.env.GEOCODER_API_KEY,
	formatter: null,
};

export const geocoder = NodeGeoCoder(options);
