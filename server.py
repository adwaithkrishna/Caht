import asyncio
import json
import logging
import secrets

import websockets


logging.basicConfig(level=logging.DEBUG)

KEYS = {}


async def message(websocket, connected):
    async for message in websocket:
        event = json.loads(message)
        if event["type"] == "message":
            message = event["message"]
            event = {"type": "message", "message": message}
            websockets.broadcast(connected, json.dumps(event))


async def create(websocket):
    connected = {websocket}
    key = secrets.token_urlsafe(4)
    KEYS[key] = connected
    event = {"type": "init", "join": key}
    await websocket.send(json.dumps(event))
    await message(websocket, connected)


async def join(websocket, event):
    key = event["join"]
    connected = KEYS[key]
    connected.add(websocket)
    event = {"type": "init", "join": key}
    await websocket.send(json.dumps(event))
    await message(websocket, connected)


async def handler(websocket):
    async for message in websocket:
        event = json.loads(message)
        if event["type"] == "init":
            if "join" in event:
                await join(websocket, event)
            else:
                await create(websocket)


async def main():
    async with websockets.serve(handler, "localhost", 8001):
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
