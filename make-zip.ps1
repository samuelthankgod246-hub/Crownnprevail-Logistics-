param([string]$SourceDir, [string]$ZipPath)
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
if (Test-Path $ZipPath) { Remove-Item $ZipPath -Force }
$zip = [System.IO.Compression.ZipFile]::Open($ZipPath, 'Create')
try {
  $base = (Resolve-Path $SourceDir).Path.TrimEnd('\')
  Get-ChildItem -LiteralPath $base -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($base.Length + 1) -replace '\\', '/'
    $entry = $zip.CreateEntry($rel, [System.IO.Compression.CompressionLevel]::Optimal)
    $es = $entry.Open()
    $fs = [System.IO.File]::OpenRead($_.FullName)
    $fs.CopyTo($es)
    $fs.Dispose(); $es.Dispose()
  }
} finally {
  $zip.Dispose()
}
# verify separators
$z = [System.IO.Compression.ZipFile]::OpenRead($ZipPath)
$bad = @($z.Entries | Where-Object { $_.FullName -match '\\' })
"ENTRIES: $($z.Entries.Count) | BACKSLASH-ENTRIES: $($bad.Count)"
$z.Dispose()
