# Compress large logo PNGs using sharp with correct CLI syntax
$logos = @(
    "assets\images\logo\logo plain background.png",
    "assets\images\logo\Footer Image.png",
    "assets\images\logo\new logo.png"
)

foreach ($logo in $logos) {
    if (Test-Path $logo) {
        $before = [math]::Round((Get-Item $logo).Length / 1KB, 1)
        # Use -f png and quality flag for PNG
        $tmp = $logo -replace '\.png$', '_tmp.png'
        & sharp -i $logo -o $tmp -f png --png.quality 80 --png.compressionLevel 9 2>$null
        if (Test-Path $tmp) {
            $after = [math]::Round((Get-Item $tmp).Length / 1KB, 1)
            if ((Get-Item $tmp).Length -lt (Get-Item $logo).Length) {
                Move-Item $tmp $logo -Force
                Write-Host "$logo : ${before}KB -> ${after}KB (SAVED)"
            } else {
                Remove-Item $tmp
                Write-Host "$logo : ${before}KB (skipped - already optimal)"
            }
        } else {
            Write-Host "$logo : failed"
        }
    }
}
Write-Host "Done."
