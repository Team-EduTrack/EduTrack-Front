// orval.config.js
module.exports = {
  edutrack: {
    input: "./orval/openapi.yaml",
    output: {
      target: "./src/api/generated/edutrack.ts",
      client: "react-query",
      httpClient: "axios",
      baseUrl: "",
    },
  },
};
