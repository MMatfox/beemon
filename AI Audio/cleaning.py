from PIL import Image
import os

def supprimer_images_invalides(dossier):
    for fichier in os.listdir(dossier):
        if fichier.endswith(".png"):
            chemin = os.path.join(dossier, fichier)
            try:
                with Image.open(chemin) as img:
                    img.verify()
            except:
                print(f"❌ Supprimé : {chemin}")
                os.remove(chemin)

supprimer_images_invalides("sounds/Queen_Spectrograms")
supprimer_images_invalides("sounds/NonQueen_Spectrograms")