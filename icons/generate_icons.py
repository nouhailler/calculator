#!/usr/bin/env python3
"""
Script pour générer les icônes de la calculatrice PWA
"""
import os
from PIL import Image, ImageDraw, ImageFont

def create_icon(size, output_path):
    # Créer une image carrée
    img = Image.new('RGBA', (size, size), (28, 30, 48, 255))
    draw = ImageDraw.Draw(img)
    
    # Calculer les dimensions du bouton
    button_size = size // 3
    button_padding = size // 12
    
    # Dessiner 4 boutons de calculatrice
    buttons = [
        ('7', button_padding, button_padding),
        ('8', button_padding * 2 + button_size, button_padding),
        ('9', button_padding * 3 + button_size * 2, button_padding),
        ('/', button_padding * 4 + button_size * 3, button_padding),
        ('4', button_padding, button_padding * 2 + button_size),
        ('5', button_padding * 2 + button_size, button_padding * 2 + button_size),
        ('6', button_padding * 3 + button_size * 2, button_padding * 2 + button_size),
        ('*', button_padding * 4 + button_size * 3, button_padding * 2 + button_size),
    ]
    
    for text, x, y in buttons:
        # Dessiner le bouton
        draw.rounded_rectangle(
            [x, y, x + button_size, y + button_size],
            fill=(74, 85, 104, 255),
            radius=button_size // 6
        )
        
        # Dessiner le texte
        try:
            font_size = button_size // 2
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
        except:
            font = ImageFont.load_default()
            
        text_width, text_height = draw.textsize(text, font=font)
        text_x = x + (button_size - text_width) // 2
        text_y = y + (button_size - text_height) // 2
        draw.text((text_x, text_y), text, fill=(255, 255, 255, 255), font=font)
    
    # Sauvegarder l'image
    img.save(output_path)
    print(f"Créé: {output_path}")

def main():
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    
    # Créer le dossier s'il n'existe pas
    os.makedirs('icons', exist_ok=True)
    
    for size in sizes:
        output_path = f"icons/icon-{size}x{size}.png"
        create_icon(size, output_path)

if __name__ == '__main__':
    main()
