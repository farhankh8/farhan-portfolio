param(
  [Parameter(Mandatory = $true)][string]$Source,
  [Parameter(Mandatory = $true)][string]$OutDir,
  [int]$SliceHeight = 1500,
  [string]$Prefix = 'slice'
)

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }

$img = [System.Drawing.Bitmap]::FromFile($Source)
$w = $img.Width
$h = $img.Height
$index = 0
$y = 0

while ($y -lt $h) {
  $sliceH = [Math]::Min($SliceHeight, $h - $y)
  $rect = New-Object System.Drawing.Rectangle 0, $y, $w, $sliceH
  $crop = $img.Clone($rect, $img.PixelFormat)

  $name = Join-Path $OutDir ("{0}-{1:d2}.png" -f $Prefix, $index)
  $crop.Save($name, [System.Drawing.Imaging.ImageFormat]::Png)
  $crop.Dispose()

  Write-Output "$name  (y=$y, h=$sliceH)"
  $index++
  $y += $SliceHeight
}

$img.Dispose()
