import requests
from bs4 import BeautifulSoup
import csv
from time import sleep

BASE_URL = "https://ncs.io/music-search"
OUTPUT_CSV = "ncs_music_data.csv"
HEADERS = {
    "User-Agent": "Mozilla/5.0"
}

def parse_page(html):
    soup = BeautifulSoup(html, "html.parser")
    data = []
    rows = soup.select("table tbody tr")

    for row in rows:
        try:
            play_btn = row.select_one("a.player-play")
            title = row.select_one("td:nth-of-type(4) p").get_text(strip=True)
            artist = row.select_one("td:nth-of-type(4) span").get_text(strip=True)
            genre = play_btn.get("data-genre", "").strip()
            moods = [tag.get_text(strip=True) for tag in row.select("td:nth-of-type(5) a.tag")]
            release_date = row.select("td:nth-of-type(6)")[0].get_text(strip=True)
            version = row.select("td:nth-of-type(7)")[0].get_text(strip=True)
            download_url = play_btn.get("data-url", "").strip()
            cover_url = play_btn.get("data-cover", "").strip()

            data.append({
                "title": title,
                "artist": artist,
                "genre": genre,
                "moods": ", ".join(moods),
                "release_date": release_date,
                "version": version,
                "download_url": download_url,
                "cover_url": cover_url
            })
        except Exception as e:
            print("Error parsing row:", e)

    return data

def main():
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        fieldnames = ["title", "artist", "genre", "moods", "release_date", "version", "download_url", "cover_url"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()

        for page in range(1, 101):
            print(f"Scraping page {page}...")
            try:
                response = requests.get(BASE_URL, params={"page": page}, headers=HEADERS)
                if response.status_code != 200:
                    print(f"Failed to load page {page} (Status {response.status_code})")
                    break
                page_data = parse_page(response.text)
                if not page_data:
                    print(f"No results found on page {page}. Stopping.")
                    break
                for item in page_data:
                    writer.writerow(item)
                sleep(1)  # polite delay
            except Exception as e:
                print(f"Exception on page {page}: {e}")
                break

if __name__ == "__main__":
    main()
