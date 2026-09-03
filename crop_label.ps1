Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\akash\.gemini\antigravity-ide\brain\f0bb3474-5d13-447b-871d-aefaa0f8abb3\.user_uploaded\media_1788243135560.png"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Host "Source Width: $($img.Width), Height: $($img.Height)"

$h = $img.Height
$w = $img.Width

# Let's find the exact bounding box of the blue label
# The bottle is centered horizontally. Let's find the left and right edges of the bottle/label
# and top/bottom edges of the blue label band.
# Blue label has high Blue and lower Red (e.g. B > 100, B > R + 20)
$minY = $h
$maxY = 0
$minX = $w
$maxX = 0

for ($y = [int]($h * 0.25); $y -lt [int]($h * 0.75); $y += 2) {
    for ($x = [int]($w * 0.2); $x -lt [int]($w * 0.8); $x += 2) {
        $pixel = $img.GetPixel($x, $y)
        if ($pixel.A -gt 150 -and $pixel.B -gt 100 -and $pixel.B -gt ($pixel.R + 25)) {
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
        }
    }
}

Write-Host "Detected Blue Label Bounds: X=[$minX, $maxX], Y=[$minY, $maxY]"

$cropX = $minX
$cropY = $minY
$cropW = $maxX - $minX
$cropH = $maxY - $minY

$rect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$cropped = $img.Clone($rect, $img.PixelFormat)

# Save to public/textures and public/assets
$destDir1 = "c:\projects\Futura-Edtech\public\textures"
$destDir2 = "c:\projects\Futura-Edtech\public\assets"
if (!(Test-Path $destDir1)) { New-Item -ItemType Directory -Path $destDir1 }
if (!(Test-Path $destDir2)) { New-Item -ItemType Directory -Path $destDir2 }

$destPath1 = "$destDir1\aquafina_label.png"
$destPath2 = "$destDir2\aquafina_label.png"
$cropped.Save($destPath1, [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Save($destPath2, [System.Drawing.Imaging.ImageFormat]::Png)

Write-Host "Saved cropped label (Width: $($cropped.Width), Height: $($cropped.Height)) to $destPath1 and $destPath2"

$cropped.Dispose()
$img.Dispose()
