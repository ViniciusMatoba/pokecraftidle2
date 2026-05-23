
$capable = 3, 6, 9, 15, 18, 65, 80, 94, 115, 127, 130, 142, 150, 181, 208, 212, 214, 229, 248, 254, 257, 260, 282, 302, 303, 306, 308, 310, 319, 323, 334, 354, 359, 362, 373, 376, 380, 381, 384, 428, 445, 448, 460, 475, 531, 719, 26, 149, 154, 157, 160, 389, 392, 395, 497, 500, 503, 652, 655, 658, 724, 727, 730, 812, 815, 818, 908, 911, 914, 330, 405, 612, 635, 706, 784, 887, 998, 768, 485, 491, 807, 358, 71, 121, 689, 668, 36, 545, 12, 68

$content = Get-Content src/data/pokedex.js -Raw

foreach ($id in $capable) {
    # Match the line for the ID and capture the evolution field
    if ($content -match "  ${id}:\{id:${id},.*?evolution:(.*?)\}") {
        $evo = $Matches[1]
        Write-Host "ID ${id}: ${evo}"
    } else {
        Write-Host "ID ${id}: NOT FOUND or NO EVO"
    }
}
