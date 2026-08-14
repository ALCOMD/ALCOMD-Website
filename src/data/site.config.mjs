import alcomdConfig from "../../alcomd.config.json" with { type: "json" };
import stableUpdaterManifest from "../../public/api/v1/updates/stable.json" with { type: "json" };
import betaUpdaterManifest from "../../public/api/v1/updates/beta.json" with { type: "json" };
import {
    createDownloadCatalog,
    createStableDownloadCatalog,
} from "./downloads.mjs";
import { themeColors, themeSeedColor } from "./theme.mjs";

const homepageUrl = alcomdConfig.homepageUrl.replace(/\/$/, "");
const repositoryUrl = `https://github.com/${alcomdConfig.repository}`;
const websiteRepositoryUrl = `https://github.com/${alcomdConfig.websiteRepository}`;
const contributorsApiUrl = new URL(
    `/repos/${alcomdConfig.repository}/contributors`,
    "https://api.github.com",
);
contributorsApiUrl.searchParams.set("per_page", "100");

const publisherRepositoryOwner = alcomdConfig.repository.split("/")[0];
const stableRelease = createStableDownloadCatalog(alcomdConfig, stableUpdaterManifest);
const betaDownloads = createDownloadCatalog(alcomdConfig, betaUpdaterManifest, {
    allowEmpty: true,
    channel: "beta",
    unavailableOnContractMismatch: true,
});

export const siteConfig = {
    url: homepageUrl,
    name: alcomdConfig.productName,
    shortName: alcomdConfig.productName,
    googleAnalyticsMeasurementId: alcomdConfig.googleAnalyticsMeasurementId,
    authorName: alcomdConfig.publisherName,
    authorUrl: `https://github.com/${publisherRepositoryOwner}`,
    repositoryUrl,
    websiteRepositoryUrl,
    contributorsApiUrl: contributorsApiUrl.href,
    downloadPath: "download",
    mcpDocsPath: "mcp",
    mcpToolsPath: "mcp/tools",
    ogImagePath: "/assets/og-banner.png",
    ogImageWidth: 2048,
    ogImageHeight: 2048,
    ogImageType: "image/png",
    logoPath: "/assets/logo.png",
    icon192Path: "/assets/icon-192.png",
    icon512Path: "/assets/icon-512.png",
    themeSeedColor,
    themeColorLight: themeColors.light,
    themeColorDark: themeColors.dark,
    externalLinks: alcomdConfig.externalLinks,
    stableRelease,
    betaDownloads,
    downloadChannels: [stableRelease, betaDownloads],
};
