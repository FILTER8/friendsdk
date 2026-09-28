# RF64 V1

A tiny push-your-luck game built around the original on-chain 8x8 Rare Friends Genesis artwork.

## Files

Put these files in the RF64 game folder:

- `index.tsx`
- `style.css`
- `game.json`
- `genesis-art.json`
- `3x5.json`

## Controls

- **A**: start the runner
- **A again**: begin braking
- **B**: bank the current round pot
- Keyboard: `A` / `Space` and `B`

## Rules

- 8 rounds per game.
- Round 1 uses the Friend selected by FriendSDK when it exists in Genesis.
- The remaining rounds use different random Genesis Friends.
- The runner moves through all 64 cells in a snake path.
- Landing on a lit pixel wins the current reward and turns that exact pixel off.
- Rewards double with consecutive successes: 1, 2, 4, 8, 16, ...
- Landing on an unlit pixel busts the current round pot.
- Banked points are safe and all eight rounds sum to the final score.
- All gameplay is local/simulated in V1. No token transfer occurs.

## Run

From the FriendSDK project root, use the SDK game preview command you already used for the starter, for example:

```bash
npm run dev:game -- games/rf64
```
