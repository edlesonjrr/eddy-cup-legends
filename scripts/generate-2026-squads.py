import json
import math
import re
import unicodedata
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "tmp" / "pdfs" / "SquadLists-English.pdf"
OUTPUT = ROOT / "assets" / "js" / "players-2026.js"

QUALIFIED = {
    "Algeria": "Argelia", "Argentina": "Argentina", "Australia": "Australia",
    "Austria": "Austria", "Belgium": "Belgica", "Bosnia And Herzegovina": "Bosnia e Herzegovina",
    "Brazil": "Brasil", "Cabo Verde": "Cabo Verde", "Canada": "Canada",
    "Colombia": "Colombia", "Congo DR": "RD Congo", "Cote D'Ivoire": "Costa do Marfim",
    "Croatia": "Croacia", "Ecuador": "Equador", "Egypt": "Egito", "England": "Inglaterra",
    "France": "Franca", "Germany": "Alemanha", "Ghana": "Gana", "Japan": "Japao",
    "Mexico": "Mexico", "Morocco": "Marrocos", "Netherlands": "Holanda", "Norway": "Noruega",
    "Paraguay": "Paraguai", "Portugal": "Portugal", "Senegal": "Senegal",
    "South Africa": "Africa do Sul", "Spain": "Espanha", "Sweden": "Suecia",
    "Switzerland": "Suica", "USA": "Estados Unidos",
}

POSITION_ROTATION = {
    "GK": ["GK"],
    "DF": ["CB", "RB", "CB", "LB", "CB"],
    "MF": ["CM", "CDM", "CAM", "RM", "LM"],
    "FW": ["ST", "RW", "LW", "CF"],
}

ELITE_CLUBS = ("Real Madrid", "Barcelona", "Liverpool", "Manchester City", "Bayern", "Arsenal", "Paris Saint-Germain")
TOP_CLUBS = ("Chelsea", "Manchester United", "Tottenham", "Inter Milan", "Juventus", "AC Milan", "Napoli", "Atletico", "Dortmund", "Leverkusen")


def clean(value):
    return unicodedata.normalize("NFKC", value.replace("\x00", "")).strip()


def ascii_key(value):
    return unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode().lower()


def display_name(line, pos):
    before_date = re.split(r"\d{2}/\d{2}/\d{4}", line, 1)[0][len(pos):].strip()
    match = re.match(r"([A-ZÀ-ÖØ-Þ.' -]+?)\s*([A-ZÀ-ÖØ-Þ][a-zà-öø-ÿ.'-]+)", before_date)
    surname = (match.group(1) if match else before_date.split()[0]).strip()
    given = match.group(2) if match else ""
    surname = " ".join(piece.capitalize() if len(piece) > 3 else piece.title() for piece in surname.split())
    return f"{given} {surname}".strip()


def overall(pos, caps, goals, club):
    base = {"GK": 75, "DF": 75, "MF": 76, "FW": 76}[pos]
    experience = min(9, math.log2(caps + 1) * 1.25)
    production = min(8, goals * ({"GK": .08, "DF": .18, "MF": .25, "FW": .32}[pos]))
    club_bonus = 4 if any(club_name in club for club_name in ELITE_CLUBS) else 2 if any(club_name in club for club_name in TOP_CLUBS) else 0
    return max(72, min(99, round(base + experience + production + club_bonus)))


reader = PdfReader(SOURCE)
players = []
counts = {}
position_indexes = {}
for page in reader.pages:
    lines = [clean(line) for line in page.extract_text().splitlines() if clean(line)]
    english_country = re.sub(r"\s*\([A-Z]{3}\)$", "", lines[0])
    country = QUALIFIED.get(ascii_key(english_country).title()) or QUALIFIED.get(english_country)
    if not country:
        continue
    counts[country] = 0
    position_indexes[country] = {key: 0 for key in POSITION_ROTATION}
    for line in lines:
        match = re.match(r"^(GK|DF|MF|FW)\s*(.+?\d{2}/\d{2}/\d{4})(.*?)(\d{3})([0-9 ]+)$", line)
        if not match:
            continue
        pos, body, club, height, numbers = match.groups()
        columns = numbers.split()
        if len(columns) >= 2:
            caps, goals = int(columns[-2]), int(columns[-1])
        else:
            packed = columns[0]
            goal_digits = 2 if len(packed) >= 4 and pos in ("MF", "FW") else 1
            caps, goals = int(packed[:-goal_digits] or 0), int(packed[-goal_digits:])
        date_match = re.search(r"\d{2}/\d{2}/\d{4}", body)
        club = club.strip()
        index = position_indexes[country][pos]
        game_pos = POSITION_ROTATION[pos][index % len(POSITION_ROTATION[pos])]
        position_indexes[country][pos] += 1
        name = display_name(line, pos)
        players.append({"name": name, "country": country, "year": 2026, "position": game_pos, "overall": overall(pos, caps, goals, club)})
        counts[country] += 1

bad = {country: count for country, count in counts.items() if count != 26}
if len(counts) != 32 or bad:
    raise SystemExit(f"Expected 32 squads with 26 players; got {len(counts)} squads, invalid={bad}")

payload = json.dumps(players, ensure_ascii=False, separators=(",", ":"))
OUTPUT.write_text(
    "// Convocacoes oficiais FIFA 2026 dos 32 classificados ao mata-mata.\n"
    "// Overall estimado pelo jogo com base em experiencia internacional, gols e clube em 2026.\n"
    f"export const WORLD_CUP_2026_PLAYERS={payload};\n",
    encoding="utf-8",
)
print(f"Generated {len(players)} players from {len(counts)} knockout squads.")
