import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";
import dns from "dns";

dns.setDefaultResultOrder("verbatim");

export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
  server: {
    port: 3000,
    open: true,
    host: "localhost",
  },
  optimizeDeps: {
    include: ['@mui/icons-material'],
  }
});
