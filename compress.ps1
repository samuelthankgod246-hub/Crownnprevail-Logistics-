$imgDir = "assets\img"
$totalBefore = 0
$totalAfter = 0

# Get all PNG and JPG files over 150KB
$files = Get-ChildItem "$imgDir\*" -Include "*.png","*.jpg","*.jpeg" | Where-Object { $_.Length -gt 150KB }

foreach ($file in $files) {
    $before = [math]::Round($file.Length / 1KB, 1)
    $totalBefore += $file.Length

    # Compress with sharp: quality 78 for JPG/JPEG, quality 80 for PNG
    $ext = $file.Extension.ToLower()
    if ($ext -eq ".png") {
        sharp -i $file.FullName -o $file.FullName --quality 80 2>$null
    } else {
        sharp -i $file.FullName -o $file.FullName --quality 78 2>$null
    }

    $after = [math]::Round((Get-Item $file.FullName).Length / 1KB, 1)
    $totalAfter += (Get-Item $file.FullName).Length
    $saved = $before - $after
    Write-Host "$($file.Name): ${before}KB -> ${after}KB (saved ${saved}KB)"
}

$savedMB = [math]::Round(($totalBefore - $totalAfter) / 1MB, 2)
$beforeMB = [math]::Round($totalBefore / 1MB, 2)
$afterMB = [math]::Round($totalAfter / 1MB, 2)
Write-Host "`nTotal: ${beforeMB}MB -> ${afterMB}MB (saved ${savedMB}MB)"
