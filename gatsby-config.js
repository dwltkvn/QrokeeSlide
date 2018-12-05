module.exports = {
  siteMetadata: {
    title: "Qrokee Slider",
    version: "1.0.35"
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "qrokee-slider",
        short_name: "qslider",
        start_url: "/",
        background_color: "#7986cb",
        theme_color: "#3f51b5",
        display: "standalone",
        orientation: "portrait",
        icon: "src/images/gatsby-icon.png" // This path is relative to the root of the site.
      }
    },
    "gatsby-plugin-offline",
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        // Setting a color is optional.
        color: `tomato`,
        // Disable the loading spinner.
        showSpinner: true
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images/`
      }
    }
  ]
};
