// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///C:/Users/kipsa/Desktop/Sandbox/platonus-vue-app/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/kipsa/Desktop/Sandbox/platonus-vue-app/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueDevTools from "file:///C:/Users/kipsa/Desktop/Sandbox/platonus-vue-app/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import mkcert from "file:///C:/Users/kipsa/Desktop/Sandbox/platonus-vue-app/node_modules/vite-plugin-mkcert/dist/mkcert.mjs";
var __vite_injected_original_import_meta_url = "file:///C:/Users/kipsa/Desktop/Sandbox/platonus-vue-app/vite.config.ts";
var vite_config_default = defineConfig({
  base: "/",
  plugins: [
    vue(),
    vueDevTools(),
    // Creates a custom SSL certificate valid for the local machine.
    // Using this plugin requires admin rights on the first dev-mode launch.
    // https://www.npmjs.com/package/vite-plugin-mkcert
    process.env.HTTPS ? mkcert() : void 0
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  publicDir: "./public",
  server: {
    // Exposes your dev server and makes it accessible for the devices in the same network.
    host: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxraXBzYVxcXFxEZXNrdG9wXFxcXFNhbmRib3hcXFxccGxhdG9udXMtdnVlLWFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxca2lwc2FcXFxcRGVza3RvcFxcXFxTYW5kYm94XFxcXHBsYXRvbnVzLXZ1ZS1hcHBcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2tpcHNhL0Rlc2t0b3AvU2FuZGJveC9wbGF0b251cy12dWUtYXBwL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcblxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IHZ1ZURldlRvb2xzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29scydcclxuaW1wb3J0IG1rY2VydCBmcm9tICd2aXRlLXBsdWdpbi1ta2NlcnQnXHJcblxyXG4vLyBodHRwczovL3ZpdGUuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBiYXNlOiAnLycsXHJcbiAgcGx1Z2luczogW1xyXG4gICAgdnVlKCksXHJcbiAgICB2dWVEZXZUb29scygpLFxyXG4gICAgLy8gQ3JlYXRlcyBhIGN1c3RvbSBTU0wgY2VydGlmaWNhdGUgdmFsaWQgZm9yIHRoZSBsb2NhbCBtYWNoaW5lLlxyXG4gICAgLy8gVXNpbmcgdGhpcyBwbHVnaW4gcmVxdWlyZXMgYWRtaW4gcmlnaHRzIG9uIHRoZSBmaXJzdCBkZXYtbW9kZSBsYXVuY2guXHJcbiAgICAvLyBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS92aXRlLXBsdWdpbi1ta2NlcnRcclxuICAgIHByb2Nlc3MuZW52LkhUVFBTID8gbWtjZXJ0KCkgOiB1bmRlZmluZWQsXHJcbiAgXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKVxyXG4gICAgfSxcclxuICB9LFxyXG4gIHB1YmxpY0RpcjogJy4vcHVibGljJyxcclxuICBzZXJ2ZXI6IHtcclxuICAgIC8vIEV4cG9zZXMgeW91ciBkZXYgc2VydmVyIGFuZCBtYWtlcyBpdCBhY2Nlc3NpYmxlIGZvciB0aGUgZGV2aWNlcyBpbiB0aGUgc2FtZSBuZXR3b3JrLlxyXG4gICAgaG9zdDogdHJ1ZSxcclxuICB9LFxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJVLFNBQVMsZUFBZSxXQUFXO0FBRTlXLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLFlBQVk7QUFMOEwsSUFBTSwyQ0FBMkM7QUFRbFEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBLEVBQ04sU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osWUFBWTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBSVosUUFBUSxJQUFJLFFBQVEsT0FBTyxJQUFJO0FBQUEsRUFDakM7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQUEsRUFDQSxXQUFXO0FBQUEsRUFDWCxRQUFRO0FBQUE7QUFBQSxJQUVOLE1BQU07QUFBQSxFQUNSO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
