"""Crop every player photo into a consistent, face-centred 4:5 headshot.

The source photos in images/players/ come from all over: full-body action
shots, tight close-ups, landscape interviews. Showing them in a fixed card
frame with one object-position meant some cards showed only a forehead.
This script finds the face in each photo and cuts a crop where the head sits
at the same size and height every time.

    pip install opencv-python-headless pillow
    python3 tools/make_headshots.py

Writes images/players/headshots/<name>.jpg (400x500).
"""
import glob
import os

import cv2
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), '..', 'images', 'players')
OUT = os.path.join(ROOT, 'headshots')
OUT_W, OUT_H = 400, 500

# Face width as a share of the crop width, and where the face centre sits
# vertically (0 = top, 1 = bottom). Gives head-and-shoulders framing.
FACE_SHARE = 0.36
FACE_Y = 0.40

# Photos where the detector picks the wrong thing: (x, y, w, h) in source pixels.
OVERRIDES = {
    'benzema.jpg': (88, 18, 84, 84),  # detector latches on to his hand
    # Action shots where the face is too small for the default detector settings
    'carvalho.jpg': (157, 126, 129, 129),
    'ceballos.jpg': (139, 109, 130, 130),
    'mariano.jpg': (80, 42, 66, 66),
    'helguera.jpg': (98, 12, 48, 48),
    'van-der-vaart.jpg': (330, 58, 52, 52),
    'baptista.jpg': (145, 8, 66, 66),
    'odriozola.jpg': (162, 60, 115, 115),
}

cascades = [cv2.CascadeClassifier(cv2.data.haarcascades + name) for name in (
    'haarcascade_frontalface_default.xml',
    'haarcascade_frontalface_alt2.xml',
)]
profile = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')


def find_face(path):
    name = os.path.basename(path)
    if name in OVERRIDES:
        return OVERRIDES[name]
    grey = cv2.equalizeHist(cv2.cvtColor(cv2.imread(path), cv2.COLOR_BGR2GRAY))
    h, w = grey.shape
    min_size = (int(w * 0.08),) * 2
    faces = []
    for c in cascades:
        faces += [tuple(f) for f in c.detectMultiScale(grey, 1.05, 6, minSize=min_size)]
    if not faces:
        faces += [tuple(f) for f in profile.detectMultiScale(grey, 1.05, 4, minSize=min_size)]
        flipped = profile.detectMultiScale(cv2.flip(grey, 1), 1.05, 4, minSize=min_size)
        faces += [(w - x - fw, y, fw, fh) for x, y, fw, fh in flipped]
    if not faces:
        return None
    return max(faces, key=lambda f: f[2] * f[3])


def crop_box(img_w, img_h, face):
    fx, fy, fw, fh = face
    cx, cy = fx + fw / 2, fy + fh / 2
    aspect = OUT_W / OUT_H
    cw = fw / FACE_SHARE
    ch = cw / aspect
    # Close-ups can't be zoomed out past the edges of the photo: shrink the
    # crop until it fits, keeping the aspect ratio.
    scale = min(1, img_w / cw, img_h / ch)
    cw, ch = cw * scale, ch * scale
    left = min(max(cx - cw / 2, 0), img_w - cw)
    top = min(max(cy - ch * FACE_Y, 0), img_h - ch)
    return int(left), int(top), int(left + cw), int(top + ch)


def main():
    os.makedirs(OUT, exist_ok=True)
    for path in sorted(glob.glob(os.path.join(ROOT, '*.jpg'))):
        name = os.path.basename(path)
        img = Image.open(path).convert('RGB')
        face = find_face(path)
        if face is None:
            print(f'{name}: no face found, centre crop')
            face = (img.width * 0.3, img.height * 0.1, img.width * 0.4, img.width * 0.4)
        box = crop_box(img.width, img.height, face)
        img.crop(box).resize((OUT_W, OUT_H), Image.LANCZOS).save(
            os.path.join(OUT, name), 'JPEG', quality=86, optimize=True, progressive=True)
        print(f'{name}: face {tuple(int(v) for v in face)} -> crop {box}')


if __name__ == '__main__':
    main()
