/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Cloud/CDN umum
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: '*.s3.amazonaws.com', pathname: '/**' },
      { protocol: 'https', hostname: 'blob.vercel-storage.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net', pathname: '/**' },

      // Stock image gratis
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.pixabay.com', pathname: '/**' },
      { protocol: 'https', hostname: 'img.freepik.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.stocksnap.io', pathname: '/**' },
      { protocol: 'https', hostname: 'live.staticflickr.com', pathname: '/**' },
      { protocol: 'https', hostname: 'image.shutterstock.com', pathname: '/**' },
      { protocol: 'https', hostname: 'media.gettyimages.com', pathname: '/**' },
      { protocol: 'https', hostname: 'media.istockphoto.com', pathname: '/**' },
      { protocol: 'https', hostname: 'static.canva.com', pathname: '/**' },

      // Sosial media besar
      { protocol: 'https', hostname: 'platform-lookaside.fbsbx.com', pathname: '/**' }, // Facebook
      { protocol: 'https', hostname: 'scontent.cdninstagram.com', pathname: '/**' },   // Instagram
      { protocol: 'https', hostname: 'pbs.twimg.com', pathname: '/**' },               // Twitter/X
      { protocol: 'https', hostname: 'p16-sign-va.tiktokcdn.com', pathname: '/**' },   // TikTok
      { protocol: 'https', hostname: 'yt3.ggpht.com', pathname: '/**' },               // YouTube
      { protocol: 'https', hostname: 'media.licdn.com', pathname: '/**' },             // LinkedIn
      { protocol: 'https', hostname: 'cdn.discordapp.com', pathname: '/**' },          // Discord
      { protocol: 'https', hostname: 'avatars.slack-edge.com', pathname: '/**' },      // Slack
      { protocol: 'https', hostname: 'avatars.githubusercontent.com', pathname: '/**' }, // GitHub
      { protocol: 'https', hostname: 'secure.gravatar.com', pathname: '/**' },         // Gravatar
      { protocol: 'https', hostname: 'i.pinimg.com', pathname: '/**' },                // Pinterest
      { protocol: 'https', hostname: '64.media.tumblr.com', pathname: '/**' },         // Tumblr
      { protocol: 'https', hostname: 'preview.redd.it', pathname: '/**' },             // Reddit
      { protocol: 'https', hostname: 'miro.medium.com', pathname: '/**' },             // Medium

      // Auth/OAuth avatar
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },   // Google
      { protocol: 'https', hostname: 'img.clerk.com', pathname: '/**' },               // Clerk
    ],
  },
  typescript: { ignoreBuildErrors: true },
  turbopack: { root: __dirname },
};

module.exports = nextConfig;
