"use client"
import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
});

type Presence = {
  cursor: { x: number; y: number } | null;
};

type UserMeta = {
  id: string;
  info: {
    name: string;
    avatar: string;
    color: string;
  };
};

export const {
  suspense: {
    RoomProvider,
    useRoom,
    useUpdateMyPresence,
    useOthers,
    useSelf,
    useBroadcastEvent,
    useEventListener,
  },
} = createRoomContext<Presence, never, UserMeta, never>(client);
