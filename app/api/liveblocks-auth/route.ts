import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
});

const COLORS = [
  "#E8B4B8", "#EED6D3", "#A49393", "#67595E", 
  "#fecdd3", "#fda4af", "#fb7185", "#f43f5e"
];

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const { room } = await request.json();

    if (!room) {
      return new Response("Room ID is required", { status: 400 });
    }

    // In a full implementation, we would check ShareLink token from cookies here.
    // For MVP Base: Ensure user is logged in, or we assign an anonymous identity
    // if a valid share link was provided.
    
    // We will assign a random color from our soft palette
    const color = COLORS[Math.floor(JSON.stringify(session?.user?.id || Date.now()).length % COLORS.length)];

    let userSession;
    
    if (session?.user?.id) {
      userSession = liveblocks.prepareSession(
        session.user.id,
        {
          userInfo: {
            name: session.user.name || "Anonymous Friend",
            avatar: session.user.image || `https://api.dicebear.com/7.x/notionists/svg?seed=${session.user.id}`,
            color: color
          }
        }
      );
    } else {
      // Anonymous user flow (e.g. they joined via link but are not signed in)
      const anonId = `anon_${Math.random().toString(36).substr(2, 9)}`;
      userSession = liveblocks.prepareSession(
        anonId,
        {
          userInfo: {
            name: "Anonymous Friend",
            avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${anonId}`,
            color: color
          }
        }
      );
    }

    // For MVP: Grant full access to the requested room.
    // Later in TASK-09, we tighten this down based on DB lookups and tokens.
    userSession.allow(room, userSession.FULL_ACCESS);

    const { status, body } = await userSession.authorize();
    return new Response(body, { status });
  } catch (err) {
    console.error(err);
    return new Response("Unauthorized", { status: 403 });
  }
}
