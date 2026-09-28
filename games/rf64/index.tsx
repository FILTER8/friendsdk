"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { GameComponentProps } from "@rarefriends/friendsdk/runtime";
import genesisData from "./genesis-art.json";
import fontData from "./3x5.json";
import "./style.css";

type FriendArt = {
  id: number;
  name: string;
  pixels: string;
  lit: number;
  rows: string[];
};

type GenesisData = {
  collection: string;
  contract: string;
  chainId: number;
  supply: number;
  exported: number;
  failed: number[];
  friends: FriendArt[];
};

type FontData = {
  title: string;
  description?: string;
  lineHeight?: number;
  characterSpacing?: number;
  fallback: string[];
  characters: Record<string, string[]>;
};

type Phase =
  | "start"
  | "roundIntro"
  | "message"
  | "ready"
  | "running"
  | "braking"
  | "results";

const GENESIS = genesisData as GenesisData;
const FONT = fontData as FontData;

const ROUND_COUNT = 8;
const RUN_SPEED_MS = 45;
const SCROLL_SPEED_MS = 92;
const START_SCROLL_SPEED_MS = 165;


/* =========================================================
   SNAKE PATH
   ========================================================= */

const SNAKE_PATH = Array.from({ length: 64 }, (_, i) => {
  const y = Math.floor(i / 8);
  const xInRow = i % 8;
  const x = y % 2 === 0 ? xInRow : 7 - xInRow;

  return y * 8 + x;
});


/* =========================================================
   ART
   ========================================================= */

function rowsToBoard(rows: string[]): boolean[] {
  const board = Array<boolean>(64).fill(false);

  for (let y = 0; y < 8; y += 1) {
    const row = rows[y] ?? "........";

    for (let x = 0; x < 8; x += 1) {
      board[y * 8 + x] = row[x] === "#";
    }
  }

  return board;
}


function pickRoundFriends(): FriendArt[] {
  const pool = [...GENESIS.friends];

  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));

    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, ROUND_COUNT);
}


/* =========================================================
   FONT
   ========================================================= */

function textColumns(text: string): boolean[][] {
  const columns: boolean[][] = [];

  const spacing = Math.max(
    1,
    FONT.characterSpacing ?? 1,
  );

  const blank = () =>
    Array<boolean>(8).fill(false);

  for (const rawChar of text.toUpperCase()) {
    const glyph =
      FONT.characters[rawChar] ??
      FONT.fallback;

    const width = Math.max(
      1,
      ...glyph.map((row) => row.length),
    );

    for (let gx = 0; gx < width; gx += 1) {
      const column = blank();

      for (
        let gy = 0;
        gy < glyph.length && gy < 7;
        gy += 1
      ) {
        const row = glyph[gy] ?? "";

        const on =
          row[gx] &&
          row[gx] !== " ";

        if (on) {
          column[gy + 1] = true;
        }
      }

      columns.push(column);
    }

    for (let s = 0; s < spacing; s += 1) {
      columns.push(blank());
    }
  }

  return columns;
}


function frameFromColumns(
  columns: boolean[][],
  offset: number,
  inverted = false,
): boolean[] {
  const frame =
    Array<boolean>(64).fill(inverted);

  for (let x = 0; x < 8; x += 1) {
    const source = offset + x;
    const column = columns[source];

    if (!column) continue;

    for (let y = 0; y < 8; y += 1) {
      if (inverted) {
        if (column[y]) {
          frame[y * 8 + x] = false;
        }
      } else {
        frame[y * 8 + x] =
          Boolean(column[y]);
      }
    }
  }

  return frame;
}


function staticTextFrame(
  text: string,
  inverted = false,
): boolean[] {
  const chars = [
    ...text.toUpperCase(),
  ];

  const glyphs = chars.map(
    (char) =>
      FONT.characters[char] ??
      FONT.fallback,
  );

  const widths = glyphs.map((glyph) =>
    Math.max(
      1,
      ...glyph.map((row) => row.length),
    ),
  );

  const spacing = 1;

  const totalWidth =
    widths.reduce(
      (sum, width) => sum + width,
      0,
    ) +
    Math.max(
      0,
      chars.length - 1,
    ) *
      spacing;

  const frame =
    Array<boolean>(64).fill(inverted);

  let cursorX = Math.max(
    0,
    Math.floor(
      (8 - totalWidth) / 2,
    ),
  );

  for (
    let characterIndex = 0;
    characterIndex < glyphs.length;
    characterIndex += 1
  ) {
    const glyph =
      glyphs[characterIndex];

    const width =
      widths[characterIndex];

    const height =
      Math.min(
        7,
        glyph.length,
      );

    const offsetY =
      Math.max(
        0,
        Math.floor(
          (8 - height) / 2,
        ),
      );

    for (
      let y = 0;
      y < height;
      y += 1
    ) {
      const row =
        glyph[y] ?? "";

      for (
        let x = 0;
        x < width;
        x += 1
      ) {
        const on =
          row[x] &&
          row[x] !== " ";

        if (!on) continue;

        const px =
          cursorX + x;

        const py =
          offsetY + y;

        if (
          px < 0 ||
          px >= 8 ||
          py < 0 ||
          py >= 8
        ) {
          continue;
        }

        frame[py * 8 + px] =
          !inverted;
      }
    }

    cursorX +=
      width + spacing;
  }

  return frame;
}


/* =========================================================
   RESULT HELPERS
   ========================================================= */

function bestRoundIndex(
  scores: number[],
): number {
  let best = 0;

  for (
    let i = 1;
    i < scores.length;
    i += 1
  ) {
    if (
      (scores[i] ?? 0) >
      (scores[best] ?? 0)
    ) {
      best = i;
    }
  }

  return best;
}


/* =========================================================
   GAME
   ========================================================= */

export default function RF64({
  friendId,
  client,
  paused,
}: GameComponentProps) {
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkError, setSdkError] = useState("");

  const [
    roundFriends,
    setRoundFriends,
  ] =
    useState<FriendArt[]>([]);

  const [
    roundIndex,
    setRoundIndex,
  ] =
    useState(0);

  const [
    board,
    setBoard,
  ] =
    useState<boolean[]>(
      Array(64).fill(false),
    );

  const [
    phase,
    setPhase,
  ] =
    useState<Phase>("start");

  const [
    cursor,
    setCursor,
  ] =
    useState<number | null>(
      null,
    );

  const [
    textFrame,
    setTextFrame,
  ] =
    useState<boolean[] | null>(
      null,
    );

  const [
    pot,
    setPot,
  ] =
    useState(0);

  const [
    total,
    setTotal,
  ] =
    useState(0);

  const [
    streak,
    setStreak,
  ] =
    useState(0);

  const [
    roundScores,
    setRoundScores,
  ] =
    useState<number[]>(
      Array(ROUND_COUNT).fill(0),
    );


  /* =========================================================
     REFS
     ========================================================= */

  const phaseRef =
    useRef<Phase>("start");

  const boardRef =
    useRef<boolean[]>(board);

  const potRef =
    useRef(0);

  const totalRef =
    useRef(0);

  const streakRef =
    useRef(0);

  const roundScoresRef =
    useRef<number[]>(
      Array(ROUND_COUNT).fill(0),
    );

  const roundFriendsRef =
    useRef<FriendArt[]>([]);

  const roundIndexRef =
    useRef(0);

  const pathPositionRef =
    useRef(0);

  const cursorRef =
    useRef<number | null>(
      null,
    );

  const runIntervalRef =
    useRef<
      ReturnType<
        typeof setInterval
      > | null
    >(null);

  const timerRef =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);

  const sequenceRef =
    useRef(0);

  const mountedRef =
    useRef(true);


  /* =========================================================
     FRIENDSDK SESSION
     ========================================================= */

  useEffect(() => {
    let alive = true;

    setSdkReady(false);
    setSdkError("");

    void client
      .read()
      .then((snapshot) => {
        if (!alive) return;

        if (snapshot.friendId !== friendId) {
          setSdkError("Friend session mismatch.");
          return;
        }

        setSdkReady(true);
      })
      .catch((error) => {
        if (!alive) return;

        setSdkError(
          error instanceof Error
            ? error.message
            : "Could not load Friend session.",
        );
      });

    return () => {
      alive = false;
    };
  }, [client, friendId]);


  /* =========================================================
     CURRENT FRIEND
     ========================================================= */

  const currentFriend =
    roundFriends[
      roundIndex
    ] ??
    null;


  /* =========================================================
     DISPLAY
     ========================================================= */

  const display =
    useMemo(() => {
      if (textFrame) {
        return textFrame;
      }

      const next = [
        ...board,
      ];

      if (
        (
          phase === "running" ||
          phase === "braking"
        ) &&
        cursor !== null
      ) {
        next[cursor] =
          !next[cursor];
      }

      return next;
    }, [
      board,
      cursor,
      phase,
      textFrame,
    ]);


  /* =========================================================
     STATE HELPERS
     ========================================================= */

  function setGamePhase(
    next: Phase,
  ) {
    phaseRef.current = next;
    setPhase(next);
  }


  function clearMotionTimers() {
    if (
      runIntervalRef.current
    ) {
      clearInterval(
        runIntervalRef.current,
      );

      runIntervalRef.current =
        null;
    }

    if (
      timerRef.current
    ) {
      clearTimeout(
        timerRef.current,
      );

      timerRef.current =
        null;
    }
  }


  function applyBoard(
    next: boolean[],
  ) {
    boardRef.current = next;
    setBoard(next);
  }


  function applyPot(
    next: number,
  ) {
    potRef.current = next;
    setPot(next);
  }


  function applyTotal(
    next: number,
  ) {
    totalRef.current = next;
    setTotal(next);
  }


  function applyStreak(
    next: number,
  ) {
    streakRef.current = next;
    setStreak(next);
  }


  function setCursorCell(
    next: number | null,
  ) {
    cursorRef.current = next;
    setCursor(next);
  }


  function applyRoundScores(
    next: number[],
  ) {
    roundScoresRef.current =
      next;

    setRoundScores(next);
  }


  function recordRoundScore(
    score: number,
  ) {
    const next = [
      ...roundScoresRef.current,
    ];

    next[
      roundIndexRef.current
    ] = score;

    applyRoundScores(next);
  }


  function advanceCursor() {
    pathPositionRef.current =
      (
        pathPositionRef.current +
        1
      ) %
      SNAKE_PATH.length;

    setCursorCell(
      SNAKE_PATH[
        pathPositionRef.current
      ],
    );
  }


  /* =========================================================
     SCROLLING MESSAGE
     ========================================================= */

  function scrollText(
    text: string,
    speed =
      SCROLL_SPEED_MS,
  ): Promise<boolean> {
    const sequence =
      sequenceRef.current;

    const columns =
      textColumns(text);

    const padded = [
      ...Array.from(
        { length: 8 },
        () =>
          Array<boolean>(8).fill(
            false,
          ),
      ),

      ...columns,

      ...Array.from(
        { length: 8 },
        () =>
          Array<boolean>(8).fill(
            false,
          ),
      ),
    ];

    setTextFrame(
      Array(64).fill(false),
    );

    setGamePhase("message");

    return new Promise(
      (resolve) => {
        let offset = 0;

        const maxOffset =
          Math.max(
            0,
            padded.length - 8,
          );

        const tick = () => {
          if (
            !mountedRef.current ||
            sequence !==
              sequenceRef.current
          ) {
            resolve(false);
            return;
          }

          setTextFrame(
            frameFromColumns(
              padded,
              offset,
            ),
          );

          if (
            offset >= maxOffset
          ) {
            timerRef.current =
              setTimeout(() => {
                if (
                  sequence ===
                  sequenceRef.current
                ) {
                  setTextFrame(
                    null,
                  );
                }

                resolve(
                  sequence ===
                    sequenceRef.current,
                );
              }, speed);

            return;
          }

          offset += 1;

          timerRef.current =
            setTimeout(
              tick,
              speed,
            );
        };

        tick();
      },
    );
  }


  /* =========================================================
     START / ATTRACT SCREEN
     ========================================================= */

  function startAttractMode() {
    clearMotionTimers();

    sequenceRef.current += 1;

    const sequence =
      sequenceRef.current;

    setGamePhase("start");

    const columns =
      textColumns("RF64");

    const spacing =
      Array.from(
        { length: 8 },
        () =>
          Array<boolean>(8).fill(
            false,
          ),
      );

    const loopColumns = [
      ...spacing,
      ...columns,
      ...spacing,
    ];

    let offset = 0;

    const tick = () => {
      if (
        !mountedRef.current ||
        sequence !==
          sequenceRef.current ||
        phaseRef.current !==
          "start"
      ) {
        return;
      }

      setTextFrame(
        frameFromColumns(
          loopColumns,
          offset,
          true,
        ),
      );

      offset =
        (
          offset + 1
        ) %
        loopColumns.length;

      timerRef.current =
        setTimeout(
          tick,
          START_SCROLL_SPEED_MS,
        );
    };

    tick();
  }


  /* =========================================================
     ROUND INTRO
     ========================================================= */

  function showRoundIntro(
    index: number,
  ) {
    clearMotionTimers();

    setCursorCell(null);

    setTextFrame(
      staticTextFrame(
        `R${index + 1}`,
        true,
      ),
    );

    setGamePhase(
      "roundIntro",
    );
  }


  function revealRound() {
    if (
      phaseRef.current !==
      "roundIntro"
    ) {
      return;
    }

    setTextFrame(null);
    setCursorCell(null);

    setGamePhase("ready");
  }


  /* =========================================================
     BEGIN ROUND
     ========================================================= */

  function beginRound(
    index: number,
  ) {
    const friend =
      roundFriendsRef.current[
        index
      ];

    if (!friend) return;

    clearMotionTimers();

    roundIndexRef.current =
      index;

    setRoundIndex(index);

    applyBoard(
      rowsToBoard(
        friend.rows,
      ),
    );

    applyPot(0);
    applyStreak(0);

    pathPositionRef.current =
      0;

    setCursorCell(null);

    showRoundIntro(index);
  }


  /* =========================================================
     FINISH GAME
     ========================================================= */

  function finishGame() {
    clearMotionTimers();

    setCursorCell(null);
    setTextFrame(null);

    setGamePhase("results");
  }


  function nextRound() {
    const next =
      roundIndexRef.current +
      1;

    if (
      next >=
      ROUND_COUNT
    ) {
      finishGame();
      return;
    }

    beginRound(next);
  }


  /* =========================================================
     STOP RESULT
     ========================================================= */

  async function resolveStop() {
    const stopped =
      cursorRef.current;

    if (
      stopped === null
    ) {
      return;
    }

    await new Promise<void>(
      (resolve) => {
        timerRef.current =
          setTimeout(
            resolve,
            360,
          );
      },
    );

    if (
      !mountedRef.current
    ) {
      return;
    }

    const hit =
      Boolean(
        boardRef.current[
          stopped
        ],
      );

    setCursorCell(null);


    /* BUST */

    if (!hit) {
      applyPot(0);
      applyStreak(0);

      recordRoundScore(0);

      const ok =
        await scrollText(
          "BUST",
        );

      if (!ok) return;

      nextRound();

      return;
    }


    /* HIT */

    const reward =
      2 **
      streakRef.current;

    const nextPot =
      potRef.current +
      reward;

    const nextBoard = [
      ...boardRef.current,
    ];

    nextBoard[
      stopped
    ] = false;

    applyBoard(
      nextBoard,
    );

    applyPot(
      nextPot,
    );

    applyStreak(
      streakRef.current +
        1,
    );

    const ok =
      await scrollText(
        `+${reward} P${nextPot}`,
      );

    if (!ok) return;


    /* CLEARED */

    if (
      !nextBoard.some(
        Boolean,
      )
    ) {
      const nextTotal =
        totalRef.current +
        nextPot;

      applyTotal(
        nextTotal,
      );

      recordRoundScore(
        nextPot,
      );

      const cleared =
        await scrollText(
          `CLEAR ${nextPot}`,
        );

      if (!cleared) {
        return;
      }

      nextRound();

      return;
    }


    setTextFrame(null);

    setGamePhase(
      "ready",
    );
  }


  /* =========================================================
     RUN
     ========================================================= */

  function startRun() {
    if (
      paused ||
      phaseRef.current !==
        "ready"
    ) {
      return;
    }

    setTextFrame(null);

    setGamePhase(
      "running",
    );

    setCursorCell(
      SNAKE_PATH[
        pathPositionRef.current
      ],
    );

    runIntervalRef.current =
      setInterval(() => {
        if (
          paused ||
          phaseRef.current !==
            "running"
        ) {
          return;
        }

        advanceCursor();
      }, RUN_SPEED_MS);
  }


  /* =========================================================
     BRAKE
     ========================================================= */

  function startBrake() {
    if (
      paused ||
      phaseRef.current !==
        "running"
    ) {
      return;
    }

    if (
      runIntervalRef.current
    ) {
      clearInterval(
        runIntervalRef.current,
      );

      runIntervalRef.current =
        null;
    }

    setGamePhase(
      "braking",
    );

    const steps =
      7 +
      Math.floor(
        Math.random() * 7,
      );

    let step = 0;

    const brakeStep = () => {
      if (
        !mountedRef.current ||
        phaseRef.current !==
          "braking"
      ) {
        return;
      }

      if (
        step >= steps
      ) {
        void resolveStop();

        return;
      }

      advanceCursor();

      step += 1;

      const progress =
        step / steps;

      const delay =
        Math.round(
          55 +
          210 *
            progress *
            progress,
        );

      timerRef.current =
        setTimeout(
          brakeStep,
          delay,
        );
    };

    brakeStep();
  }


  /* =========================================================
     BANK
     ========================================================= */

  async function bankRound() {
    if (
      paused ||
      phaseRef.current !==
        "ready" ||
      potRef.current <= 0
    ) {
      return;
    }

    const banked =
      potRef.current;

    const nextTotal =
      totalRef.current +
      banked;

    applyTotal(
      nextTotal,
    );

    recordRoundScore(
      banked,
    );

    applyPot(0);
    applyStreak(0);

    const ok =
      await scrollText(
        `BANK ${banked}`,
      );

    if (!ok) return;

    nextRound();
  }


  /* =========================================================
     NEW GAME
     ========================================================= */

  function startNewGame() {
    clearMotionTimers();

    sequenceRef.current += 1;

    const picked =
      pickRoundFriends();

    roundFriendsRef.current =
      picked;

    setRoundFriends(
      picked,
    );

    roundIndexRef.current =
      0;

    setRoundIndex(0);

    applyTotal(0);
    applyPot(0);
    applyStreak(0);

    const scores =
      Array(
        ROUND_COUNT,
      ).fill(0);

    applyRoundScores(
      scores,
    );

    setCursorCell(null);
    setTextFrame(null);

    beginRound(0);
  }


  /* =========================================================
     BUTTONS
     ========================================================= */

  function pressA() {
    if (paused) return;


    if (
      phaseRef.current ===
      "start"
    ) {
      startNewGame();

      return;
    }


    if (
      phaseRef.current ===
      "roundIntro"
    ) {
      revealRound();

      return;
    }


    if (
      phaseRef.current ===
      "ready"
    ) {
      startRun();

      return;
    }


    if (
      phaseRef.current ===
      "running"
    ) {
      startBrake();

      return;
    }


    if (
      phaseRef.current ===
      "results"
    ) {
      startAttractMode();
    }
  }


  function pressB() {
    if (paused) return;


    if (
      phaseRef.current ===
      "start"
    ) {
      startNewGame();

      return;
    }


    if (
      phaseRef.current ===
      "ready"
    ) {
      void bankRound();
    }
  }


  /* =========================================================
     KEYBOARD
     ========================================================= */

  useEffect(() => {
    const onKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.repeat
      ) {
        return;
      }

      if (
        event.key.toLowerCase() ===
          "a" ||
        event.code ===
          "Space"
      ) {
        event.preventDefault();

        pressA();
      } else if (
        event.key.toLowerCase() ===
        "b"
      ) {
        event.preventDefault();

        pressB();
      }
    };

    window.addEventListener(
      "keydown",
      onKeyDown,
    );

    return () =>
      window.removeEventListener(
        "keydown",
        onKeyDown,
      );
  });


  /* =========================================================
     INITIALIZE
     ========================================================= */

  useEffect(() => {
    mountedRef.current =
      true;

    startAttractMode();

    return () => {
      mountedRef.current =
        false;

      sequenceRef.current +=
        1;

      clearMotionTimers();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /* =========================================================
     RESULT FRIEND
     ========================================================= */

  const resultFriendIndex =
    bestRoundIndex(
      roundScores,
    );

  const resultFriend =
    roundFriends[
      resultFriendIndex
    ] ??
    roundFriends[0] ??
    null;


  /* =========================================================
     EXPORT PNG
     SAME VISUAL STRUCTURE AS RESULT SCREEN
     ========================================================= */

  function exportResult() {
    if (!resultFriend) {
      return;
    }

    const canvas =
      document.createElement(
        "canvas",
      );

    canvas.width =
      1200;

    canvas.height =
      1200;

    const ctx =
      canvas.getContext(
        "2d",
      );

    if (!ctx) {
      return;
    }

    const W =
      canvas.width;

    const H =
      canvas.height;


    /* BASE */

    ctx.fillStyle =
      "#ececec";

    ctx.fillRect(
      0,
      0,
      W,
      H,
    );


    /* CARD SHADOW */

    ctx.fillStyle =
      "#777777";

    ctx.fillRect(
      72,
      72,
      1068,
      1068,
    );


    /* CARD */

    ctx.fillStyle =
      "#ffffff";

    ctx.fillRect(
      54,
      54,
      1068,
      1068,
    );


    /* CARD BORDER */

    ctx.strokeStyle =
      "#111111";

    ctx.lineWidth =
      10;

    ctx.strokeRect(
      54,
      54,
      1068,
      1068,
    );


    ctx.fillStyle =
      "#111111";

    ctx.textBaseline =
      "top";


    /* TITLE */

    ctx.font =
      "900 110px monospace";

    ctx.textAlign =
      "left";

    ctx.fillText(
      "RF64",
      105,
      90,
    );


    /* FINAL */

    ctx.font =
      "900 28px monospace";

    ctx.textAlign =
      "right";

    ctx.fillText(
      "FINAL",
      1070,
      130,
    );

    ctx.textAlign =
      "left";


    /* TOP DIVIDER */

    ctx.fillRect(
      105,
      215,
      965,
      7,
    );


    /* FRIEND LABEL */

    ctx.font =
      "900 26px monospace";

    ctx.fillText(
      `GENESIS #${resultFriend.id}`,
      105,
      265,
    );


    /* FRIEND ART */

    const artX =
      105;

    const artY =
      315;

    const artSize =
      465;

    const artShadow =
      10;


    /* ART SHADOW */

    ctx.fillStyle =
      "#777777";

    ctx.fillRect(
      artX + artShadow,
      artY + artShadow,
      artSize,
      artSize,
    );


    /* ART BACKGROUND */

    ctx.fillStyle =
      "#111111";

    ctx.fillRect(
      artX,
      artY,
      artSize,
      artSize,
    );


    const gap = 6;

    const cell =
      (
        artSize -
        gap * 7 -
        50
      ) /
      8;

    const gridX =
      artX + 25;

    const gridY =
      artY + 25;


    for (
      let y = 0;
      y < 8;
      y += 1
    ) {
      const row =
        resultFriend.rows[y] ??
        "........";

      for (
        let x = 0;
        x < 8;
        x += 1
      ) {
        ctx.fillStyle =
          row[x] === "#"
            ? "#ffffff"
            : "#252525";

        ctx.fillRect(
          gridX +
            x *
              (
                cell +
                gap
              ),

          gridY +
            y *
              (
                cell +
                gap
              ),

          cell,
          cell,
        );
      }
    }


    /* SCORES */

    const scoreX =
      625;

    const scoreRight =
      1070;

    const scoreStartY =
      270;

    const scoreGap =
      67;


    for (
      let i = 0;
      i <
      ROUND_COUNT;
      i += 1
    ) {
      const y =
        scoreStartY +
        i *
          scoreGap;

      ctx.fillStyle =
        "#111111";

      ctx.font =
        "900 32px monospace";

      ctx.textAlign =
        "left";

      ctx.fillText(
        `R${i + 1}`,
        scoreX,
        y,
      );

      ctx.textAlign =
        "right";

      ctx.fillText(
        String(
          roundScores[i] ??
            0,
        ),
        scoreRight,
        y,
      );


      /* SCORE DIVIDER */

      ctx.fillStyle =
        "#111111";

      ctx.fillRect(
        scoreX,
        y + 43,
        scoreRight -
          scoreX,
        3,
      );
    }


    ctx.textAlign =
      "left";


    /* TOTAL DIVIDER */

    ctx.fillStyle =
      "#111111";

    ctx.fillRect(
      105,
      845,
      965,
      7,
    );


    /* TOTAL LABEL */

    ctx.font =
      "900 34px monospace";

    ctx.fillText(
      "TOTAL",
      105,
      930,
    );


    /* TOTAL VALUE */

    ctx.font =
      "900 118px monospace";

    ctx.textAlign =
      "right";

    ctx.fillText(
      String(total),
      1070,
      870,
    );

    ctx.textAlign =
      "left";


    /* BOTTOM DIVIDER */

    ctx.fillRect(
      105,
      1045,
      965,
      7,
    );


    /* FOOTER */

    ctx.font =
      "900 24px monospace";

    ctx.fillText(
      "8 ROUNDS / 64 PIXELS",
      105,
      1070,
    );


    /* DOWNLOAD */

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return;
        }

        const url =
          URL.createObjectURL(
            blob,
          );

        const anchor =
          document.createElement(
            "a",
          );

        anchor.href =
          url;

        anchor.download =
          `rf64-${total}.png`;

        document.body.appendChild(
          anchor,
        );

        anchor.click();

        anchor.remove();

        setTimeout(
          () =>
            URL.revokeObjectURL(
              url,
            ),
          1000,
        );
      },
      "image/png",
    );
  }


  if (sdkError) {
    return (
      <section className="rf64-shell" aria-label="RF64 error">
        <p role="alert">{sdkError}</p>
      </section>
    );
  }

  if (!sdkReady) {
    return (
      <section className="rf64-shell" aria-label="RF64 loading">
        <p role="status">Loading RF64…</p>
      </section>
    );
  }


  /* =========================================================
     RESULTS SCREEN
     ========================================================= */

  if (
    phase ===
    "results"
  ) {
    return (
      <section
        className="rf64-shell"
        aria-label="RF64 results"
      >
        <div
          style={{
            width:
              "min(92vw, 620px)",

            background:
              "#fff",

            border:
              "5px solid #111",

            boxShadow:
              "10px 10px 0 #777",

            padding:
              "28px",

            color:
              "#111",

            display:
              "grid",

            gap:
              "24px",
          }}
        >

          {/* HEADER */}

          <header
            style={{
              display:
                "flex",

              alignItems:
                "baseline",

              justifyContent:
                "space-between",

              borderBottom:
                "5px solid #111",

              paddingBottom:
                "16px",
            }}
          >
            <strong
              style={{
                fontSize:
                  "clamp(38px, 9vw, 68px)",

                lineHeight:
                  1,

                letterSpacing:
                  "-0.07em",
              }}
            >
              RF64
            </strong>

            <span
              style={{
                fontSize:
                  "14px",

                fontWeight:
                  900,
              }}
            >
              FINAL
            </span>
          </header>


          {/* FRIEND + SCORES */}

          <div
            style={{
              display:
                "grid",

              gridTemplateColumns:
                "minmax(140px, 1fr) minmax(170px, .9fr)",

              gap:
                "24px",

              alignItems:
                "start",
            }}
          >

            {/* FRIEND */}

            <div>
              <div
                style={{
                  fontSize:
                    "13px",

                  fontWeight:
                    900,

                  marginBottom:
                    "9px",
                }}
              >
                {resultFriend
                  ? `GENESIS #${resultFriend.id}`
                  : "RARE FRIEND"}
              </div>

              <div
                style={{
                  width:
                    "100%",

                  aspectRatio:
                    "1",

                  background:
                    "#111",

                  padding:
                    "7%",

                  display:
                    "grid",

                  gridTemplateColumns:
                    "repeat(8, 1fr)",

                  gridTemplateRows:
                    "repeat(8, 1fr)",

                  gap:
                    "2.3%",

                  boxShadow:
                    "6px 6px 0 #777",
                }}
              >
                {(
                  resultFriend
                    ? rowsToBoard(
                        resultFriend.rows,
                      )
                    : Array(64).fill(
                        false,
                      )
                ).map(
                  (
                    on,
                    index,
                  ) => (
                    <span
                      key={
                        index
                      }
                      style={{
                        display:
                          "block",

                        background:
                          on
                            ? "#fff"
                            : "#222",
                      }}
                    />
                  ),
                )}
              </div>
            </div>


            {/* SCORE LIST */}

            <div
              style={{
                display:
                  "grid",

                gap:
                  "9px",
              }}
            >
              {roundScores.map(
                (
                  score,
                  index,
                ) => (
                  <div
                    key={
                      index
                    }
                    style={{
                      display:
                        "flex",

                      justifyContent:
                        "space-between",

                      alignItems:
                        "center",

                      borderBottom:
                        "2px solid #111",

                      padding:
                        "5px 0",

                      fontWeight:
                        900,

                      fontSize:
                        "18px",
                    }}
                  >
                    <span>
                      R
                      {index +
                        1}
                    </span>

                    <span>
                      {score}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>


          {/* TOTAL */}

          <div
            style={{
              borderTop:
                "5px solid #111",

              borderBottom:
                "5px solid #111",

              padding:
                "16px 0",

              display:
                "flex",

              justifyContent:
                "space-between",

              alignItems:
                "baseline",
            }}
          >
            <strong
              style={{
                fontSize:
                  "20px",
              }}
            >
              TOTAL
            </strong>

            <strong
              style={{
                fontSize:
                  "clamp(54px, 13vw, 92px)",

                lineHeight:
                  0.9,
              }}
            >
              {total}
            </strong>
          </div>


          {/* ACTIONS */}

          <div
            style={{
              display:
                "grid",

              gridTemplateColumns:
                "1fr 1fr",

              gap:
                "14px",
            }}
          >
            <button
              type="button"
              onClick={
                exportResult
              }
              style={{
                appearance:
                  "none",

                border:
                  "4px solid #111",

                borderRadius:
                  0,

                background:
                  "#111",

                color:
                  "#fff",

                minHeight:
                  "54px",

                font:
                  "inherit",

                fontWeight:
                  900,

                cursor:
                  "pointer",

                boxShadow:
                  "0 6px 0 #777",
              }}
            >
              EXPORT PNG
            </button>

            <button
              type="button"
              onClick={
                startAttractMode
              }
              style={{
                appearance:
                  "none",

                border:
                  "4px solid #111",

                borderRadius:
                  0,

                background:
                  "#fff",

                color:
                  "#111",

                minHeight:
                  "54px",

                font:
                  "inherit",

                fontWeight:
                  900,

                cursor:
                  "pointer",

                boxShadow:
                  "0 6px 0 #777",
              }}
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      </section>
    );
  }


  /* =========================================================
     DEVICE
     ========================================================= */

  return (
    <section
      className="rf64-shell"
      aria-label="RF64"
    >
      <div
        className="rf64-device"
      >

        {/* MATRIX */}

        <div
          className="rf64-matrix"
          role="img"
          aria-label={
            currentFriend
              ? `${currentFriend.name}, round ${roundIndex + 1} of 8`
              : "RF64 display"
          }
        >
          {display.map(
            (
              on,
              index,
            ) => (
              <span
                key={
                  index
                }
                className={`rf64-led ${
                  on
                    ? "is-on"
                    : ""
                }`}
              />
            ),
          )}
        </div>


        {/* CONTROLS */}

        <div
          className="rf64-controls"
          aria-label="RF64 controls"
        >

          {/* A */}

          <div
            className="rf64-control"
          >
            <button
              type="button"
              className="rf64-button"

              aria-label={
                phase ===
                "start"
                  ? "A: start"
                  : phase ===
                      "roundIntro"
                    ? "A: enter round"
                    : phase ===
                        "running"
                      ? "A: brake"
                      : "A: run"
              }

              disabled={
                paused ||
                phase ===
                  "message" ||
                phase ===
                  "braking"
              }

              onPointerDown={(
                event,
              ) => {
                event.preventDefault();

                pressA();
              }}
            />

            <span>
              A
            </span>
          </div>


          {/* B */}

          <div
            className="rf64-control"
          >
            <button
              type="button"
              className="rf64-button"

              aria-label={
                phase ===
                "start"
                  ? "B: start"
                  : "B: bank"
              }

              disabled={
                paused ||
                (
                  phase !==
                    "start" &&
                  (
                    phase !==
                      "ready" ||
                    pot <= 0
                  )
                )
              }

              onPointerDown={(
                event,
              ) => {
                event.preventDefault();

                pressB();
              }}
            />

            <span>
              B
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}