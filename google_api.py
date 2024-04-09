#!/usr/bin/env python

import os
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2 import service_account

SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]

SPREADSHEET_ID = '1_xsDfFHZSgGANCFFVZGdPMnaCLlDHIB7xi4XYvZz7yQ'
RANGE = 'Tracker!A2:B2'

KEY = os.environ.get('GOOGLE_KEY')

def append_price(values, value_input_option="USER_ENTERED"):
    """
    Add price to spreadsheet
    """
    credentials = service_account.Credentials.from_service_account_file(KEY)
    append_body = {
        "values": values,
        "range": RANGE,
        "majorDimension": "ROWS",
        }
    try:
        service = build("sheets", "v4", credentials=credentials)

        service.spreadsheets().values().append(
            spreadsheetId=SPREADSHEET_ID,
            range=RANGE,
            body=append_body,
            valueInputOption=value_input_option,
        ).execute()

    except HttpError as error:
        print(error)