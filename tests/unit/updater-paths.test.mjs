import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const legacyStablePath = new URL(
    "../../public/api/gui/tauri-updater.json",
    import.meta.url,
);
const redirectsPath = new URL("../../public/_redirects", import.meta.url);

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
            /^https:\/\/github\.com\/ALCOMD3\/ALCOMD3\/releases\/download\/v[^/]+\//,
        );
        assert.equal(typeof platform.signature, "string");
        assert.notEqual(platform.signature.trim(), "");
        assert.ok(Array.isArray(platform.args));
    }
});

test("the legacy beta path proxies to the stable migration manifest", async () => {
    const redirects = await readFile(redirectsPath, "utf8");

    assert.match(
        redirects,
        /^\/api\/gui\/tauri-updater-beta\.json \/api\/gui\/tauri-updater\.json 200$/m,
    );
});
