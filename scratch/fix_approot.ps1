
$path = "src/AppRoot.jsx"
$lines = Get-Content $path
$start = 2474 # line 2475 index
$end = 2522   # line 2523 index

$newLines = $lines[0..($start-1)] + $lines[($end+1)..($lines.Length-1)]
$newLines | Set-Content $path -Encoding UTF8
