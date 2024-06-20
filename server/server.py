import asyncio
import websockets
import json
import sqlite3
import nfc_handling


def init_db():
    conn = sqlite3.connect("data.db")
    cursor = conn.cursor()
    cursor.execute(
        """
    CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        status TEXT NOT NULL,
        isOn INTEGER NOT NULL,
        location TEXT NOT NULL,
        nfc TEXT NOT NULL
    )
    """
    )
    conn.commit()
    conn.close()


init_db()
current_nfc = None

async def add_item(id, name, status, isOn, location, websocket):
    global handle_nfc_task, current_nfc
    # if handle_nfc_task is not None:
    #    handle_nfc_task.cancel()
    # nfc = None
    print(f"Current NFC: {current_nfc}")
    while current_nfc is None:
        pass
        # print("Wating for nfc to be scaned")
    #    await asyncio.sleep(0.5)  # Yield control to the event loop

    nfc = current_nfc
    # str(nfc_handling.scan_nfc("Add NFC tag: "))
    conn = sqlite3.connect("data.db")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO items (id, name, status, isOn, location, nfc) VALUES (?, ?, ?, ?, ?, ?)",
        (id, name, status, isOn, location, nfc),
    )
    conn.commit()
    conn.close()

    await notify_clients(websocket, "AVAILABLE-", "false")

def remove_item(id):
    conn = sqlite3.connect("data.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM items WHERE id=?", (id,))
    conn.commit()
    conn.close()


def update_item(id, name, status, isOn, location):
    conn = sqlite3.connect("data.db")
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE items SET name=?, status=?, isOn=?, location=? WHERE id=?",
        (name, status, isOn, location, id),
    )
    conn.commit()
    conn.close()


def get_all_items():
    conn = sqlite3.connect("data.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, status, isOn, location, nfc FROM items")
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "id": row[0],
            "name": row[1],
            "status": "green" if row[3] == 1 else "red",
            "isOn": row[3] == 1,
            "location": json.loads(row[4]),
            # "nfc": row[5]
        }
        for row in rows
    ]


def print_all_items():
    conn = sqlite3.connect("data.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, status, isOn, location, nfc FROM items")
    rows = cursor.fetchall()
    conn.close()
    print(
        [
            {
                "id": row[0],
                "name": row[1],
                "status": "green" if row[3] == 1 else "red",
                "isOn": row[3] == 1,
                "location": json.loads(row[4]),
                "nfc": row[5],
            }
            for row in rows
        ]
    )

def print_item(id):
    conn = sqlite3.connect("data.db")
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, name, status, isOn, location, nfc FROM items WHERE id=?", id
    )
    rows = cursor.fetchall()
    conn.close()
    print(rows[0]["nfc"])

async def process_message(message, websocket):
    print(f"Message is: {message}")
    try:
        code, *item_str = message.split("-")
        print(f"code: {code}, item_str: {item_str}")

        match code:
            case "ADD":
                item = json.loads(item_str[0])

                await add_item(
                    item["id"],
                    item["name"],
                    item["status"],
                    int(item["isOn"]),
                    json.dumps(item["location"]),
                    websocket,
                )

            case "DELETE":
                id = int(item_str[0].strip())
                remove_item(id)
            case "DELETE":
                id = int(item_str[0].strip())
                remove_item(id)

            case "UPDATE":

                id = int(item_str[0].strip())
                item = json.loads(item_str[1])
                update_item(
                    id,
                    item["name"],
                    item["status"],
                    int(item["isOn"]),
                    json.dumps(item["location"]),
                )
                print_all_items()
            case _:
                print("Invalid message")

    except Exception as e:
        print(f"Error: {e}")

    print(f"Message received: {message}")



async def notify_clients(websocket, prefix, message):
    await websocket.send(prefix + message)


async def handle_messages(websocket):
    print("Start waiting for the message")
    async for message in websocket:
        print(f"My Message '{message}' ")
        await process_message(message, websocket)
        all_items = get_all_items()
        await notify_clients(websocket, "DATA-", json.dumps(all_items))


async def handle_nfc(websocket):
    global current_nfc
    while True:
        try:
            nfc_data = await asyncio.to_thread(nfc_handling.scan_nfc)
            # nfc_data = nfc_handling.scan_nfc()
            print(f"NFC: ({str(nfc_data)})")
            if str(nfc_data) == "bytearray(b'')":
                print("This scan is skiped")
                continue

            current_nfc = str(nfc_data)

            with sqlite3.connect("data.db") as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT id, name, status, isOn, location, nfc FROM items WHERE nfc=?",
                    (str(nfc_data),),
                )
                rows = cursor.fetchall()
                print("ROOOOOOWS", rows, current_nfc)
                if rows and len(rows) != 0:
                    for row in rows:
                        item_id, name, status, isOn, location, nfc = row

                        new_isOn = not isOn
                        new_status = "green" if new_isOn else "red"
                        cursor.execute(
                            "UPDATE items SET isOn=?, status=? WHERE nfc=?",
                            (new_isOn, new_status, str(nfc_data)),
                        )
                        conn.commit()

                        print(
                            f"Updated isOn for item '{name}' (ID: {item_id}) from {isOn} to {new_isOn}"
                        )
                else:
                    await notify_clients(websocket, "AVAILABLE-", "true")

            # current_nfc = None
            all_items = get_all_items()
            await notify_clients(websocket, "DATA-", json.dumps(all_items))

        except asyncio.CancelledError:
            print("handle_nfc task cancelled during NFC scan")
            break
        except Exception as e:
            print(f"An error occurred: {e}")
        await asyncio.sleep(0.5)  # Yield control to the event loop

        
async def send_data(websocket, path):
    async def on_scaner_detect():
        try:
            await notify_clients(websocket, "MESSAGE-", "Message")
        except Exception as e:
            print(f"Error: {e}")

        await asyncio.sleep(1)

    while True:
        await on_scaner_detect()
        try:
            all_items = get_all_items()
            await notify_clients(websocket, "DATA-", json.dumps(all_items))

            # handle_messages(websocket)
            message_task = asyncio.create_task(handle_messages(websocket))
            nfc_task = asyncio.create_task(handle_nfc(websocket))

            await asyncio.gather(message_task, nfc_task)
        except websockets.exceptions.ConnectionClosed as e:
            print(f"Connection closed: {e}")


async def main():
    print("The program has started")
    server = await websockets.serve(send_data, "0.0.0.0", 8765)
    print("The webserver has started")
    await server.wait_closed()


asyncio.run(main())
