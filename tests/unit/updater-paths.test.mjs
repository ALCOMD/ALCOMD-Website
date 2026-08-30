import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const legacyStablePath = new URL(
    "../../public/api/gui/tauri-updater.json",
    import.meta.url,
);
const canonicalUpdatePaths = [
    new URL("../../public/api/v1/updates/stable.json", import.meta.url),
    new URL("../../public/api/v1/updates/beta.json", import.meta.url),
];
const configPath = new URL("../../alcomd.config.json", import.meta.url);
const redirectsPath = new URL("../../public/_redirects", import.meta.url);

test("the website and public updater metadata use the canonical production domain", async () => {
    const config = JSON.parse(await readFile(configPath, "utf8"));
    const legacyManifestText = await readFile(legacyStablePath, "utf8");

    assert.equal(config.homepageUrl, "https://alcomd.vrclearn.com/");
    assert.equal(config.mcpDocumentationRef, "v3.4.0");
    assert.match(legacyManifestText, /alcomd\.vrclearn\.com/);
    assert.doesNotMatch(legacyManifestText, /alcomd3?\.cqmhv\.com/);
});

test("the legacy updater path remains a signed three-platform ALCOMD3 manifest", async () => {
    const manifest = JSON.parse(await readFile(legacyStablePath, "utf8"));
    const platforms = Object.keys(manifest.platforms).sort();

    assert.equal(typeof manifest.version, "string");
    assert.notEqual(manifest.version.trim(), "");
    assert.deepEqual(platforms, [
        "darwin-aarch64",
        "linux-x86_64",
        "windows-x86_64",
    ]);

    for (const platform of Object.values(manifest.platforms)) {
        assert.match(
            platform.url,
            /^https:\/\/github\.com\/ALCOMD\/ALCOMD\/releases\/download\/v[^/]+\//,
        );
        assert.equal(typeof platform.signature, "string");
        assert.notEqual(platform.signature.trim(), "");
        assert.ok(Array.isArray(platform.args));
    }
});

test("the canonical updater channels do not trail the final legacy bridge release", async () => {
    const legacyManifest = JSON.parse(await readFile(legacyStablePath, "utf8"));
    const legacyPublishedAt = Date.parse(legacyManifest.pub_date);

    assert.ok(Number.isFinite(legacyPublishedAt));

    for (const manifestPath of canonicalUpdatePaths) {
        const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
        const publishedAt = Date.parse(manifest.pub_date);

        assert.ok(Number.isFinite(publishedAt));
        assert.ok(
            publishedAt >= legacyPublishedAt,
            `${manifest.version} predates legacy bridge ${legacyManifest.version}`,
        );
    }
});

test("the legacy beta path proxies to the stable migration manifest", async () => {
    const redirects = await readFile(redirectsPath, "utf8");

    assert.match(
        redirects,
        /^\/api\/gui\/tauri-updater-beta\.json \/api\/gui\/tauri-updater\.json 200$/m,
    );
});
