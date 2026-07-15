# Compress images in assets/images/ and assets/team/
$dirs = @("assets\images\shapes", "assets\images\logo", "assets\team")
$totalBefore = 0
$totalAfter = 0

foreach ($dir in $dirs) {
    $files = Get-ChildItem "$dir\*" -Include "*.png","*.jpg","*.jpeg" -ErrorAction SilentlyContinue | Where-Object { $_.Length -gt 50KB }
    foreach ($file in $files) {
        $before = $file.Length
        $totalBefore += $before
        $ext = $file.Extension.ToLower()
        if ($ext -eq ".png") {
            sharp -i $file.FullName -o $file.FullName --quality 80 2>$null
        } else {
            sharp -i $file.FullName -o $file.FullName --quality 78 2>$null
        }
        $after = (Get-Item $file.FullName).Length
        $totalAfter += $after
        $bKB = [math]::Round($before/1KB,1)
        $aKB = [math]::Round($after/1KB,1)
        Write-Host "$($file.Name): ${bKB}KB -> ${aKB}KB"
    }
}
$savedMB = [math]::Round(($totalBefore - $totalAfter)/1MB, 2)
Write-Host "`nSaved: ${savedMB}MB"
