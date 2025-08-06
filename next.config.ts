
/** @type {import('next').NextConfig} */
interface WebpackConfig {
    resolve: {
        fallback: {
            fs: boolean;
            net: boolean;
            tls: boolean;
        };
    };
}

interface NextConfig {
    webpack: (config: WebpackConfig) => WebpackConfig;
}

const nextConfig: NextConfig = {
    webpack: (config) => {
        config.resolve.fallback = { fs: false, net: false, tls: false };
        return config;
    },
};

export default nextConfig;
