import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [react(), svgr()],
        define: {
            "process.env.REACT_APP_RECAPTCHA_SITE_KEY": JSON.stringify(
                env.REACT_APP_RECAPTCHA_SITE_KEY
            ),
        },
        envPrefix: ["VITE_", "REACT_APP_"],
    };
});
