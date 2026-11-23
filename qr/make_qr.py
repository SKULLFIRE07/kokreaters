"""Static QR for https://kokreaters.com — the URL is encoded directly in the pattern (no redirect/short-link
service), so it never expires. Brand colours: sapphire modules on white. Error correction H so it survives print wear."""
import segno
from pathlib import Path
URL = "https://kokreaters.com"
out = Path(__file__).parent
qr = segno.make(URL, error="h", micro=False)
for ext, kw in (("png", {"scale": 40}), ("svg", {"scale": 10}), ("pdf", {"scale": 10})):
    qr.save(out / f"kokreaters-qr.{ext}", border=4, dark="#2C509E", light="#FFFFFF", **kw)
qr.save(out / "kokreaters-qr-black.png", scale=40, border=4)
print("version", qr.version, "error", qr.error, "->", URL)
