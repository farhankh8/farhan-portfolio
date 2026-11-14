Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$W = 1200
$H = 630
$out = Join-Path $root 'og-image.png'

$dot = [char]0x00B7

$bmp = New-Object System.Drawing.Bitmap $W, $H
$g = [System.Drawing.Graphics]::FromImage($bmp)

$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

function Hex([string]$hex) {
  return [System.Drawing.ColorTranslator]::FromHtml($hex)
}

$bg      = Hex '#0c0e13'
$bar     = Hex '#1e232d'
$accent  = Hex '#d9a441'
$text    = Hex '#eef1f6'
$soft    = Hex '#a8b0bf'
$dim     = Hex '#7c8698'

$g.Clear($bg)

# Ledger bars: the signature detail, one bar in the accent.
$bars = @(56, 34, 72, 46, 94, 62)
$barX = 900
foreach ($barH in $bars) {
  $barW = 34
  $barY = 560 - $barH
  $brush = New-Object System.Drawing.SolidBrush $bar
  if ($barH -eq 94) { $brush.Dispose(); $brush = New-Object System.Drawing.SolidBrush $accent }
  $g.FillRectangle($brush, $barX, $barY, $barW, $barH)
  $brush.Dispose()
  $barX += 52
}

# Accent rule above the name.
$rule = New-Object System.Drawing.SolidBrush $accent
$g.FillRectangle($rule, 80, 176, 56, 4)
$rule.Dispose()

$fontName  = 'Segoe UI'
$fontMono  = 'Consolas'

$mono = New-Object System.Drawing.Font $fontMono, 19, ([System.Drawing.FontStyle]::Regular)
$name = New-Object System.Drawing.Font $fontName, 62, ([System.Drawing.FontStyle]::Bold)
$sub  = New-Object System.Drawing.Font $fontName, 27, ([System.Drawing.FontStyle]::Regular)

$dimBrush    = New-Object System.Drawing.SolidBrush $dim
$textBrush   = New-Object System.Drawing.SolidBrush $text
$softBrush   = New-Object System.Drawing.SolidBrush $soft
$accentBrush = New-Object System.Drawing.SolidBrush $accent

$g.DrawString("PORTFOLIO $dot BENGALURU, INDIA", $mono, $dimBrush, 80, 118)
$g.DrawString('KH Mohammad Farhan', $name, $textBrush, 76, 218)
$g.DrawString('Full stack software, business intelligence', $sub, $softBrush, 80, 312)
$g.DrawString('and enterprise systems', $sub, $softBrush, 80, 348)
$g.DrawString("5 platforms   $dot   2,061 automated tests   $dot   54 DAX measures   $dot   CGPA 8.10", $mono, $dimBrush, 80, 420)
$g.DrawString('farhan-portfolio-seven-opal.vercel.app', $mono, $accentBrush, 80, 500)

# Hairline frame, drawn as fills so the geometry is unambiguous.
$frame = New-Object System.Drawing.SolidBrush (Hex '#1e232d')
$g.FillRectangle($frame, 0, 0, $W, 2)
$g.FillRectangle($frame, 0, ($H - 2), $W, 2)
$g.FillRectangle($frame, 0, 0, 2, $H)
$g.FillRectangle($frame, ($W - 2), 0, 2, $H)
$frame.Dispose()

$g.Dispose()
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

Write-Output "wrote $out"
