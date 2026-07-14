# Rename ALL jpg files with v2 suffix to bust Vercel CDN cache
$imgDir = "C:\Users\Dell\.openclaw-autoclaw\workspace\a9-website\frontend\public\images"
$v2Dir = "C:\Users\Dell\.openclaw-autoclaw\workspace\a9-website\frontend\public\images_v2"
New-Item -ItemType Directory -Force -Path $v2Dir | Out-Null

$images = Get-ChildItem $imgDir -Filter "*.jpg" | Where-Object { $_.Length -gt 5000 }
Write-Host "Copying $($images.Count) images to v2 directory..."

$nameMap = @{}
foreach ($img in $images) {
    $v2Name = $img.BaseName + "-v2.jpg"
    Copy-Item $img.FullName (Join-Path $v2Dir $v2Name) -Force
    $nameMap[$img.Name] = $v2Name
}
# Also copy PNGs
Get-ChildItem $imgDir -Filter "*.png" | ForEach-Object {
    Copy-Item $_.FullName (Join-Path $v2Dir $_.Name) -Force
}
# Copy SVGs too
Get-ChildItem $imgDir -Filter "*.svg" | ForEach-Object {
    Copy-Item $_.FullName (Join-Path $v2Dir $_.Name) -Force
}

Write-Host "Done copying. Mapping:"
$nameMap.GetEnumerator() | Select-Object -First 10 | ForEach-Object { "  $($_.Key) -> $($_.Value)" }
Write-Host "..."
Write-Host "Total: $($nameMap.Count) files"

# Save mapping for search/replace
$nameMap | ConvertTo-Json | Out-File -FilePath "C:\Users\Dell\.openclaw-autoclaw\workspace\a9-website\image-map.json" -Encoding utf8
Write-Host "Map saved"
