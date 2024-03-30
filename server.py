import asyncio

import logging
import websockets


logging.basicConfig(level=logging.DEBUG)

connected = set()


async def handler(websocket):
    connected.add(websocket)

    async for message in websocket:
        websockets.broadcast(connected, message)


async def main():
    async with websockets.serve(handler, "localhost", 8001):
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
