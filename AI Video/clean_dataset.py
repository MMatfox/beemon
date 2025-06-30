import os
import shutil

# Configuration
dataset_path = "dataset"  # Path to the dataset folder (for example, "dataset/train", "dataset/val", etc.)
images_dir = os.path.join(dataset_path, "images")
labels_dir = os.path.join(dataset_path, "labels")
classes_to_keep = [0]  # Keep only these class IDs (for example here, [0] for bees)

# Loop through all label files
removed_labels = 0
removed_images = 0
for label_file in os.listdir(labels_dir):
    label_path = os.path.join(labels_dir, label_file)
    image_name = os.path.splitext(label_file)[0] + ".jpg"
    image_path = os.path.join(images_dir, image_name)

    keep_lines = []

    # Read the label file
    with open(label_path, "r") as f:
        for line in f:
            if line.strip() == "":
                continue
            class_id = int(line.split()[0])
            if class_id in classes_to_keep:
                keep_lines.append(line)

    if keep_lines:
        # Save the filtered label lines
        with open(label_path, "w") as f:
            f.writelines(keep_lines)
    else:
        # If no useful label then delete both the label file and its corresponding image
        os.remove(label_path)
        removed_labels += 1
        if os.path.exists(image_path):
            os.remove(image_path)
            removed_images += 1

print(f"Cleanup complete: {removed_labels} label files deleted, {removed_images} images deleted.")
