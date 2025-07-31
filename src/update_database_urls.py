import csv
from supabase import create_client, Client

# CONFIGURATION
SUPABASE_URL = "https://oamszvdnitccgukdtuba.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hbXN6dmRuaXRjY2d1a2R0dWJhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ1NDkzNCwiZXhwIjoyMDY5MDMwOTM0fQ.SUyd2hk7zFOzHDWWlTZ9q1p-dRKYHfIn1W0znfMICO0"
BUCKET_NAME = "ncs-music"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Supabase public storage URL prefix
PUBLIC_STORAGE_URL = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}"

def sanitize(text):
    return text.strip().replace(" ", "_").replace("/", "_").replace(",", "").lower()

def insert_song_record(name, genre, file_path, thumbnail_path):
    file_url = f"{PUBLIC_STORAGE_URL}/{file_path}"
    thumbnail_url = f"{PUBLIC_STORAGE_URL}/{thumbnail_path}"

    data = {
        "name": name,
        "theme": genre,
        "file_url": file_url,
        "thumbnail_url": thumbnail_url
    }

    try:
        res = supabase.table("songs").insert(data).execute()
        print(f"✅ Inserted into DB: {name} ({genre})")
    except Exception as e:
        print(f"❌ DB Insert error for {name}: {e}")

def upload_from_csv(csv_path):
    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            raw_title = row['title'].strip()
            raw_artist = row['artist'].strip()
            genre = row['genre'].strip() or "unknown"

            name = f"{raw_title}"
            title = sanitize(raw_title)
            artist = sanitize(raw_artist)
            genre_folder = sanitize(genre)

            filename_base = f"{artist}_{title}"
            mp3_path = f"{genre_folder}/{filename_base}.mp3"
            png_path = f"{genre_folder}/{filename_base}.png"

            insert_song_record(name, genre, mp3_path, png_path)

if __name__ == "__main__":
    upload_from_csv("ncs_music_data.csv")
