# Seed all local images into Upstash Redis via Vercel upload API
$apiBase = "https://a9travel.com/api/upload"
# Also try vercel URL as fallback
$apiBase2 = "https://frontend-opal-eight-38.vercel.app/api/upload"

$imgDir = "C:\Users\Dell\.openclaw-autoclaw\workspace\a9-website\frontend\public\images"
$images = Get-ChildItem $imgDir -Filter "*.jpg" | Where-Object { $_.Length -gt 5000 } | Sort-Object Name

Write-Host "Seeding $($images.Count) images to Upstash Redis..."
Write-Host "API: $apiBase"
Write-Host ""

$success = 0; $fail = 0; $total = $images.Count; $batch = 0

foreach ($img in $images) {
    $batch++
    $name = $img.Name
    try {
        # Use multipart form upload
        $fileBytes = [System.IO.File]::ReadAllBytes($img.FullName)
        $fileContent = [System.Convert]::ToBase64String($fileBytes)
        
        $boundary = [Guid]::NewGuid().ToString()
        $LF = "`r`n"
        
        $bodyLines = @()
        $bodyLines += "--$boundary"
        $bodyLines += "Content-Disposition: form-data; name=`"file`"; filename=`"$name`""
        $bodyLines += "Content-Type: image/jpeg"
        $bodyLines += ""
        $bodyLines += $fileContent
        $bodyLines += "--$boundary--"
        
        $body = $bodyLines -join $LF
        
        $result = Invoke-WebRequest -Uri $apiBase -Method POST `
            -ContentType "multipart/form-data; boundary=$boundary" `
            -Body $body -UseBasicParsing -TimeoutSec 30
        
        Write-Host "[$batch/$total] OK: $name ($($img.Length) bytes)"
        $success++
    } catch {
        # Try fallback URL
        try {
            $result = Invoke-WebRequest -Uri $apiBase2 -Method POST `
                -ContentType "multipart/form-data; boundary=$boundary" `
                -Body $body -UseBasicParsing -TimeoutSec 30
            Write-Host "[$batch/$total] OK(v2): $name"
            $success++
        } catch {
            Write-Host "[$batch/$total] FAIL: $name - $($_.Exception.Message.Substring(0, [Math]::Min(60, $_.Exception.Message.Length)))"
            $fail++
        }
    }
    
    # Rate limit: 5 images per batch, then wait
    if ($batch % 5 -eq 0) { Start-Sleep -Seconds 2 }
}

Write-Host "`n=== RESULT ==="
Write-Host "Success: $success | Failed: $fail | Total: $total"
