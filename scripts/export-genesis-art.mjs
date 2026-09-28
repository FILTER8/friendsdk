import { createPublicClient, http, parseAbi } from "viem";

const CONTRACT = "0x116EaA62241751E0c98dA43d458600c6C17cD361";
const MAX_SUPPLY = 1024;
const CONCURRENCY = 10;

const RPC_URL = process.env.ROBINHOOD_RPC_URL;

if (!RPC_URL) {
  console.error("Missing ROBINHOOD_RPC_URL");
  console.error(
    'Run with: ROBINHOOD_RPC_URL="https://robinhood-mainnet.g.alchemy.com/v2/YOUR_KEY" node scripts/export-genesis-art.mjs'
  );
  process.exit(1);
}

const client = createPublicClient({
  transport: http(RPC_URL),
});

const abi = parseAbi([
  "function tokenURI(uint256 tokenId) view returns (string)",
]);

function decodeDataJson(uri) {
  const prefix = "data:application/json;base64,";

  if (!uri.startsWith(prefix)) {
    throw new Error("tokenURI is not base64 JSON");
  }

  const encoded = uri.slice(prefix.length);
  const json = Buffer.from(encoded, "base64").toString("utf8");

  return JSON.parse(json);
}

function normalizePixelHex(value) {
  if (typeof value !== "string") {
    throw new Error("properties.pixels missing");
  }

  let hex = value.toLowerCase();

  if (hex.startsWith("0x")) {
    hex = hex.slice(2);
  }

  // 8x8 = exactly 64 bits = 16 hex characters.
  hex = hex.padStart(16, "0");

  if (!/^[0-9a-f]{16}$/.test(hex)) {
    throw new Error(`Invalid 8x8 pixel value: ${value}`);
  }

  return `0x${hex}`;
}

function decodeRows(pixelHex) {
  const bitmap = BigInt(pixelHex);

  return Array.from({ length: 8 }, (_, y) => {
    return Array.from({ length: 8 }, (_, x) => {
      const index = y * 8 + x;
      const on = (bitmap & (1n << BigInt(index))) !== 0n;

      return on ? "#" : ".";
    }).join("");
  });
}

function countLitPixels(pixelHex) {
  let value = BigInt(pixelHex);
  let count = 0;

  while (value !== 0n) {
    count += Number(value & 1n);
    value >>= 1n;
  }

  return count;
}

async function readFriend(tokenId) {
  const tokenURI = await client.readContract({
    address: CONTRACT,
    abi,
    functionName: "tokenURI",
    args: [BigInt(tokenId)],
  });

  const metadata = decodeDataJson(tokenURI);

  const pixels = normalizePixelHex(metadata?.properties?.pixels);

  return {
    id: tokenId,
    name: metadata.name ?? `Genesis #${tokenId}`,
    pixels,
    lit: countLitPixels(pixels),
    rows: decodeRows(pixels),
  };
}

async function runPool(ids, concurrency) {
  const results = new Array(ids.length);
  let next = 0;

  async function worker() {
    while (true) {
      const index = next++;

      if (index >= ids.length) return;

      const tokenId = ids[index];

      try {
        const friend = await readFriend(tokenId);
        results[index] = friend;

        console.log(
          `[${String(tokenId).padStart(4, " ")}/${MAX_SUPPLY}] ${friend.name}  ${friend.pixels}  ${friend.lit} lit`
        );
      } catch (error) {
        console.error(
          `[${tokenId}/${MAX_SUPPLY}] FAILED:`,
          error instanceof Error ? error.message : error
        );

        results[index] = null;
      }
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(concurrency, ids.length) },
      () => worker()
    )
  );

  return results;
}

async function main() {
  const ids = Array.from(
    { length: MAX_SUPPLY },
    (_, index) => index + 1
  );

  console.log(`Reading ${MAX_SUPPLY} Rare Friends Genesis tokens...`);
  console.log(`Contract: ${CONTRACT}`);
  console.log("");

  const results = await runPool(ids, CONCURRENCY);

  const friends = results.filter(Boolean);
  const failed = results
    .map((value, index) => (value ? null : index + 1))
    .filter(Boolean);

  const output = {
    collection: "Rare Friends Genesis",
    contract: CONTRACT,
    chainId: 4663,
    supply: MAX_SUPPLY,
    exported: friends.length,
    failed,
    friends,
  };

  const fs = await import("node:fs/promises");

  await fs.mkdir("games/rf64/data", {
    recursive: true,
  });

  await fs.writeFile(
    "games/rf64/data/genesis-art.json",
    JSON.stringify(output, null, 2)
  );

  console.log("");
  console.log("--------------------------------");
  console.log(`Exported: ${friends.length}`);
  console.log(`Failed:   ${failed.length}`);
  console.log("Output:");
  console.log("games/rf64/data/genesis-art.json");

  if (failed.length) {
    console.log("");
    console.log("Failed token IDs:");
    console.log(failed.join(", "));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
