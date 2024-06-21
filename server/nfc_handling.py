from py532lib.i2c import Pn532_i2c
from py532lib.frame import Pn532Frame
from py532lib.constants import *
import asyncio


def scan_nfc():
    pn532 = Pn532_i2c()
    pn532.SAMconfigure()
    print("Please scan NFC")
    result = pn532.read_mifare().get_data(); 
    return result


