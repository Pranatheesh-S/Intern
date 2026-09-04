from PIL import Image

def process_image(input_path, output_path):
    # Open the original image
    img = Image.open(input_path).convert("RGBA")
    
    # Get dimensions
    width, height = img.size
    
    # Crop the top-left quadrant (where the first wedge is)
    # The image might have some padding or watermarks (like the dreamstime watermark)
    # Let's crop exactly the top-left quadrant
    cropped = img.crop((0, 0, width // 2, height // 2))
    
    # We want to remove the white background.
    # Any pixel that is close to white (R>240, G>240, B>240) becomes transparent
    data = cropped.getdata()
    new_data = []
    
    for item in data:
        # item is (R, G, B, A)
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((255, 255, 255, 0)) # transparent
        else:
            new_data.append(item)
            
    cropped.putdata(new_data)
    
    # Save the resulting image
    cropped.save(output_path, "PNG")
    print(f"Saved processed image to {output_path}")

input_img = r"C:\Users\Varun\.gemini\antigravity-ide\brain\813be2b2-4869-427b-a906-fd4e8132d62b\.user_uploaded\media_1788281186529.png"
output_img = r"c:\futurax\Futura-Edtech\public\single_orange_wedge.png"

process_image(input_img, output_img)
