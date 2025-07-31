import requests
from supabase import create_client, Client
import csv
from io import BytesIO

# CONFIGURATION
SUPABASE_URL = "https://oamszvdnitccgukdtuba.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hbXN6dmRuaXRjY2d1a2R0dWJhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ1NDkzNCwiZXhwIjoyMDY5MDMwOTM0fQ.SUyd2hk7zFOzHDWWlTZ9q1p-dRKYHfIn1W0znfMICO0"
BUCKET_NAME = "ncs-music"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def sanitize(text):
    return text.strip().replace(" ", "_").replace("/", "_").replace(",", "").lower()

def upload_to_supabase(file_content, file_path, content_type="audio/mpeg"):
    try:
        # Convert BytesIO to raw bytes for upload
        res = supabase.storage.from_(BUCKET_NAME).upload(file_path, file_content.getvalue(), {
            "content-type": content_type,
            "x-upsert": "true"
        })
        print(f"✅ Uploaded: {file_path}")
        return res
    except Exception as e:
        print(f"❌ Upload error for {file_path}: {e}")
        return None

def download_file(url):
    try:
        r = requests.get(url)
        if r.status_code == 200:
            return BytesIO(r.content)
        else:
            print(f"❌ Failed to download: {url} - Status {r.status_code}")
    except Exception as e:
        print(f"❌ Exception downloading {url}: {e}")
    return None

def upload_all_from_csv(csv_path):
    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            genre = sanitize(row['genre']) or "unknown"
            title = sanitize(row['title'])
            artist = sanitize(row['artist'])
            filename_base = f"{artist}_{title}"

            # Download and upload MP3
            mp3_url = row['download_url']
            mp3_file = download_file(mp3_url)
            if mp3_file:
                mp3_path = f"{genre}/{filename_base}.mp3"
                upload_to_supabase(mp3_file, mp3_path, content_type="audio/mpeg")

            # Download and upload PNG
            png_url = row['cover_url']
            png_file = download_file(png_url)
            if png_file:
                png_path = f"{genre}/{filename_base}.png"
                upload_to_supabase(png_file, png_path, content_type="image/png")

if __name__ == "__main__":
    upload_all_from_csv("ncs_music_data.csv")
