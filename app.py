from dotenv import load_dotenv
from flask import Flask, jsonify, make_response, render_template, request
from flask_caching import Cache
from waitress import serve

from datetime import datetime
import json
import os
import sys
import urllib.request

load_dotenv()

config = {
    "DEBUG": False,
    "CACHE_TYPE": "simple",
    "CACHE_DEFAULT_TIMEOUT": 300
}

app = Flask(__name__)
app.logger.setLevel("INFO")
app.config.from_mapping(config)
cache = Cache(app)

# Retrieve service id from env var
if "DBG_SERVICE_ID" not in os.environ:
    sys.exit()
service_id = os.environ["DBG_SERVICE_ID"]


@app.route('/')
@app.route('/player')
@cache.cached(timeout=3600)
def homepage():
    return render_template('homepage.html')


@app.route('/player/<name>')
@cache.cached()
def player(name=None):
    if name is not None:

        # Get basic character information
        app.logger.info("Querying Census API for character '%s'" % name)
        character_str = (
            urllib.request.urlopen(
                "http://census.daybreakgames.com/%s/get/ps2:v2/character/?name.first_lower=%s&c:resolve=stat&c:show=character_id,name,faction_id" % (service_id, name.lower())).read()
        ).decode("utf8")

        try:
            character = json.loads(character_str)["character_list"][0]
        except:
            return render_template('player_dne.html', search_name=name), 404

        # Get week start/end times
        curDatetime = datetime.now()
        weekStart = curDatetime.replace(
            day=curDatetime.day - curDatetime.weekday(), hour=0, minute=0, second=0)
        weekEnd = weekStart.replace(
            day=weekStart.day + 7, hour=23, minute=59, second=59)

        # Get kill/death events for the character, filtering out vehicle kills/deaths
        events_str = (
            urllib.request.urlopen("http://census.daybreakgames.com/%s/get/ps2:v2/characters_event/?character_id=%s&type=KILL,DEATH&after=%s&before=%s&c:limit=1000" %
                                   (service_id, character["character_id"], int(weekStart.timestamp()), int(weekEnd.timestamp()))).read()
        ).decode("utf8")
        events = json.loads(events_str)
        events["characters_event_list"] = list(filter(
            lambda e: e["attacker_vehicle_id"] == "0", events["characters_event_list"]))

        if len(events["characters_event_list"]) is 0:
            return render_template('player_inactive.html', character_name=character["name"]["first"])

        return render_template('player.html',
                               character_name=character["name"]["first"],
                               character_data=character_str,
                               events_data=json.dumps(events)
                               )


if __name__ == "__main__":
    serve(app, host="localhost", port="8080")
