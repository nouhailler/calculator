#!/bin/bash

# Créer des icônes simples pour la PWA
# Utilisation de convert (ImageMagick) ou création de fichiers PNG basiques

create_icon() {
    local size=$1
    local file="icon-${size}x${size}.png"
    
    # Créer une image carrée avec un fond bleu foncé
    # Utiliser un outil simple si ImageMagick n'est pas disponible
    
    # Méthode alternative: créer un fichier PNG minimal avec Python
    python3 -c "
import struct
import zlib

def create_png(width, height, filename):
    # Créer un PNG simple avec un fond bleu foncé
    def png_chunk(chunk_type, data):
        chunk_len = struct.pack('>I', len(data))
        chunk_crc = struct.pack('>I', zlib.crc32(chunk_type + data) & 0xffffffff)
        return chunk_len + chunk_type + data + chunk_crc
    
    # En-tête PNG
    signature = b'\x89PNG\r\n\x1a\n'
    
    # Chunk IHDR
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr = png_chunk(b'IHDR', ihdr_data)
    
    # Chunk IDAT (données de l'image)
    raw_data = b''
    for y in range(height):
        raw_data += b'\x00'  # Filter byte
        for x in range(width):
            # Couleur bleu foncé (42, 62, 80)
            raw_data += bytes([42, 62, 80])
    
    compressed = zlib.compress(raw_data, 9)
    idat = png_chunk(b'IDAT', compressed)
    
    # Chunk IEND
    iend = png_chunk(b'IEND', b'')
    
    with open(filename, 'wb') as f:
        f.write(signature + ihdr + idat + iend)

create_png($size, $size, '$file')
print('Créé: $file')
"
}

# Créer toutes les tailles d'icônes
sizes=(72 96 128 144 152 192 384 512)

for size in "${sizes[@]}"; do
    create_icon $size
done

echo "Toutes les icônes ont été créées"
