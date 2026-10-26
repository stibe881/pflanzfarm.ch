<?php

namespace App\Support;

use App\Models\GuideArticle;
use App\Models\GuideCategory;
use App\Models\Product;

/**
 * Grundbestand des Ratgebers: Kategorien und Tipps.
 * install() ist wiederholbar – vorhandene Artikel (gleiche Adresse) werden nicht überschrieben,
 * nur fehlende Kategorie- und Produktzuordnungen werden ergänzt.
 */
class GuideContent
{
    public const CATEGORIES = [
        'Heckenpflanzen',
        'Immergrüne Gehölze',
        'Säulenobst',
        'Beerensträucher',
        'Gartenbau & Gestaltung',
        'Pflege & Boden',
    ];

    /** Kategorie der bestehenden Grund-Artikel (aus dem DatabaseSeeder) */
    public const EXISTING = [
        'thuja-hecke-pflanzen' => 'Heckenpflanzen',
        'photinia-schneiden' => 'Heckenpflanzen',
        'beerenstraeucher-pflanzen' => 'Beerensträucher',
        'richtig-giessen' => 'Pflege & Boden',
        'hecke-schneiden' => 'Heckenpflanzen',
    ];

    public static function install(): void
    {
        $categories = [];
        foreach (self::CATEGORIES as $i => $name) {
            $categories[$name] = GuideCategory::query()->firstOrCreate(['name' => $name], ['sort' => $i]);
        }

        foreach (self::EXISTING as $slug => $category) {
            GuideArticle::query()->where('slug', $slug)->whereNull('guide_category_id')->update(['guide_category_id' => $categories[$category]->id]);
        }

        $sort = max(100, (int) GuideArticle::query()->max('sort')); // hinter den Grund-Artikeln einreihen
        foreach (self::articles() as [$category, $slug, $title, $excerpt, $paras, $product]) {
            $productId = $product ? Product::query()->where('slug', $product)->value('id') : null;
            $article = GuideArticle::query()->where('slug', $slug)->first();
            if (! $article) {
                GuideArticle::query()->create([
                    'title' => $title, 'slug' => $slug, 'excerpt' => $excerpt, 'body' => implode("\n\n", $paras),
                    'guide_category_id' => $categories[$category]->id, 'product_id' => $productId, 'published' => true, 'sort' => ++$sort,
                ]);
            } elseif ($productId && ! $article->product_id) {
                $article->update(['product_id' => $productId]);
            }
        }
    }

    /** @return array<int, array{0: string, 1: string, 2: string, 3: string, 4: array<int, string>, 5: ?string}> */
    public static function articles(): array
    {
        return [
            ['Säulenobst', 'saeulenobst-im-topf', 'Säulenobst im Topf: Obst ernten auf kleinstem Raum',
                'Säulenäpfel, -birnen und -kirschen wachsen schlank nach oben und passen auch auf Balkon und Terrasse.',
                [
                    'Säulenobst bildet statt ausladender Äste nur kurze Fruchttriebe entlang eines Mitteltriebs. Ein Baum braucht deshalb kaum mehr als 50 Zentimeter Breite und eignet sich für Terrasse, Balkon und schmale Beete.',
                    'Wählen Sie einen Topf mit mindestens 30 bis 40 Litern Inhalt und Abzugslöchern. Eine Drainageschicht aus Blähton am Boden verhindert Staunässe, darauf kommt hochwertige Kübelpflanzenerde. Alle zwei bis drei Jahre im Frühling in ein etwas grösseres Gefäss umtopfen oder die oberste Erdschicht ersetzen.',
                    'Im Topf trocknet die Erde schneller aus als im Garten: Giessen Sie im Sommer regelmässig, bei Hitze auch täglich, und düngen Sie von April bis Juli mit einem Obst- oder Beerendünger. Ein sonniger, windgeschützter Platz sorgt für süsse Früchte.',
                ], null],
            ['Säulenobst', 'saeulenaepfel-pflanzen', 'Säulenäpfel pflanzen: Standort, Abstand und Befruchtung',
                'Mit dem richtigen Partner und genug Sonne tragen Säulenäpfel schon ab dem zweiten Jahr.',
                [
                    'Säulenäpfel lieben einen sonnigen Standort mit lockerem, nährstoffreichem Boden. Im Garten pflanzen Sie sie am besten im Herbst oder zeitigen Frühling mit etwa 60 bis 80 Zentimetern Abstand – so entsteht auch eine essbare, schmale Gartenabgrenzung.',
                    'Die meisten Apfelsorten brauchen zur Befruchtung eine zweite Apfelsorte, die zur gleichen Zeit blüht. Steht in der Nachbarschaft kein Apfelbaum, pflanzen Sie zwei verschiedene Säulenäpfel nebeneinander. Fragen Sie uns nach passenden Partnersorten.',
                    'Setzen Sie den Baum so tief wie im Topf und schlagen Sie einen Stützpfahl ein, damit der schlanke Stamm bei Wind nicht wackelt. Danach kräftig angiessen und eine Mulchschicht auftragen.',
                ], null],
            ['Säulenobst', 'saeulenobst-schneiden', 'Säulenobst schneiden: wenig, aber richtig',
                'Ein kurzer Sommerschnitt hält Säulenobst schlank und fördert Blütenknospen für das nächste Jahr.',
                [
                    'Säulenobst braucht nur einen leichten Schnitt. Der wichtigste Zeitpunkt ist der Sommer, etwa Ende Juni bis Juli: Kürzen Sie seitlich abstehende, längere Triebe auf zwei bis drei Blätter oder Knospen ein. So bleibt die Säule schmal und es bilden sich neue Fruchtknospen.',
                    'Den Mitteltrieb lassen Sie wachsen, bis die gewünschte Höhe erreicht ist. Ist der Baum zu hoch geworden, können Sie ihn im Spätsommer über einem Seitentrieb einkürzen.',
                    'Entfernen Sie Triebe, die steil nach oben in Konkurrenz zum Mitteltrieb wachsen, möglichst früh. Schneiden Sie mit einer scharfen, sauberen Schere, damit die Wunden schnell verheilen.',
                ], null],
            ['Säulenobst', 'saeulenobst-ausduennen', 'Früchte ausdünnen für grössere Äpfel',
                'Wer im Juni einen Teil der jungen Früchte entfernt, erntet grössere und aromatischere Äpfel.',
                [
                    'Junge Säulenbäume setzen oft mehr Früchte an, als sie gut versorgen können. Die Folge sind kleine Äpfel und ein Ertrag, der von Jahr zu Jahr stark schwankt.',
                    'Warten Sie den natürlichen Fruchtfall im Juni ab. Danach lassen Sie pro Fruchtbüschel nur ein bis zwei Früchte hängen und entfernen beschädigte oder kleine Früchte. Als Faustregel tragen junge Säulenäpfel in den ersten Jahren 15 bis 30 Früchte.',
                    'Drehen Sie die überzähligen Früchte vorsichtig ab oder schneiden Sie sie mit einer kleinen Schere ab, ohne die übrigen Stiele zu verletzen.',
                ], null],
            ['Immergrüne Gehölze', 'eibe-taxus', 'Eibe (Taxus): langlebig, schnittverträglich und schattentauglich',
                'Die Eibe gehört zu den vielseitigsten Gehölzen für Hecken und Formschnitt – auch an schattigen Stellen.',
                [
                    'Eiben wachsen langsam, werden dafür sehr dicht und können viele Jahrzehnte alt werden. Sie gedeihen in Sonne, Halbschatten und sogar im Schatten und vertragen auch kalkhaltige Böden gut.',
                    'Anders als viele Nadelgehölze treibt die Eibe auch aus altem Holz wieder aus. Sie eignet sich deshalb für Formschnitt, Kugeln und Kegel und lässt sich bei Bedarf kräftig zurückschneiden. Ein Schnitt im Juni und bei Bedarf ein zweiter im August genügen.',
                    'Wichtig: Fast alle Teile der Eibe sind giftig, ausgenommen der rote Samenmantel. Pflanzen Sie Eiben nicht dort, wo kleine Kinder oder Weidetiere unbeaufsichtigt daran knabbern können.',
                ], null],
            ['Immergrüne Gehölze', 'immergruene-winter', 'Immergrüne im Winter: Frosttrocknis vermeiden',
                'Braune Nadeln im Frühling sind oft kein Frostschaden, sondern Trockenheit – so beugen Sie vor.',
                [
                    'Immergrüne Pflanzen wie Thuja, Eibe oder Photinia verdunsten auch im Winter Wasser über Blätter und Nadeln. Ist der Boden gefroren, können die Wurzeln keinen Nachschub aufnehmen. Besonders bei Wintersonne und kaltem Wind vertrocknen dann Triebe.',
                    'Giessen Sie Immergrüne im Herbst vor dem ersten Frost noch einmal durchdringend und an frostfreien Wintertagen bei Trockenheit erneut. Eine Mulchschicht schützt die Wurzeln vor tiefem Bodenfrost.',
                    'Frisch gepflanzte Gehölze an sonnigen, windigen Standorten schützen Sie in den ersten Wintern mit einem Vlies oder einer Schattiermatte. Leichte Schäden wachsen im Frühling meist wieder zu.',
                ], 'thuja-smaragd'],
            ['Immergrüne Gehölze', 'buchs-alternativen', 'Alternativen zum Buchs: Ilex crenata, Eibe und Co.',
                'Buchsbaumzünsler und Triebsterben machen dem Buchs zu schaffen. Diese Pflanzen bieten einen ähnlichen Look.',
                [
                    'Viele Gartenbesitzer ersetzen ihren Buchs, weil Zünsler und Pilzkrankheiten immer wieder Probleme machen. Für niedrige Einfassungen und Kugeln gibt es gute Alternativen.',
                    'Die Japanische Stechpalme (Ilex crenata) sieht dem Buchs mit ihren kleinen, glänzenden Blättern sehr ähnlich und lässt sich gut schneiden. Sie bevorzugt allerdings leicht sauren, humosen Boden. Auf kalkhaltigen Böden ist die Eibe die robustere Wahl.',
                    'Auch Zwergformen der Eibe, Spindelstrauch (Euonymus) oder niedrige Heckenmyrte eignen sich je nach Standort. Wir beraten Sie gern, welche Pflanze zu Ihrem Boden und Ihrer Gestaltung passt.',
                ], null],
            ['Immergrüne Gehölze', 'formgehoelze-pflegen', 'Formgehölze in Kugel und Kegel pflegen',
                'Mit zwei Schnitten pro Jahr und einer einfachen Schablone bleiben Kugeln und Kegel in Form.',
                [
                    'Formgehölze wie Eiben, Ilex oder Thuja schneiden Sie am besten zweimal im Jahr: Ende Mai bis Juni nach dem ersten Austrieb und bei Bedarf noch einmal leicht im August. Später geschnittene Triebe reifen vor dem Winter nicht mehr aus.',
                    'Für gleichmässige Kugeln hilft eine Schablone aus Karton oder Draht. Schneiden Sie in kleinen Schritten von oben nach unten und treten Sie zwischendurch zurück, um die Form zu prüfen.',
                    'Wählen Sie für den Schnitt einen bedeckten Tag, damit die frischen Schnittflächen nicht in der Sonne verbrennen. Nach dem Schnitt freuen sich Formgehölze über etwas Dünger und ausreichend Wasser.',
                ], null],
            ['Beerensträucher', 'himbeeren-schneiden', 'Himbeeren schneiden: Sommer- und Herbstsorten',
                'Sommer- und Herbsthimbeeren tragen an unterschiedlichem Holz – deshalb werden sie verschieden geschnitten.',
                [
                    'Sommerhimbeeren tragen an den Ruten, die im Vorjahr gewachsen sind. Schneiden Sie direkt nach der Ernte alle abgetragenen Ruten bodennah ab. Von den jungen Ruten lassen Sie pro Laufmeter etwa acht bis zehn kräftige stehen – sie tragen im nächsten Sommer.',
                    'Herbsthimbeeren fruchten an den diesjährigen Ruten. Bei ihnen schneiden Sie im Spätwinter einfach alle Ruten bodennah ab. Im Frühling treiben neue Ruten aus, die ab August Früchte tragen.',
                    'Himbeeren wurzeln flach und mögen keine Staunässe. Eine Mulchschicht aus Laub oder Rasenschnitt hält den Boden feucht und locker.',
                ], 'diverse-beerenstraeucher'],
            ['Beerensträucher', 'heidelbeeren-boden', 'Heidelbeeren brauchen sauren Boden',
                'Gartenheidelbeeren gedeihen nur in saurer Erde. Mit dem richtigen Substrat gelingen sie auch in normalen Gärten.',
                [
                    'Heidelbeeren benötigen einen sauren Boden mit einem pH-Wert von etwa 4 bis 5. In normaler Gartenerde bekommen sie gelbe Blätter und wachsen kaum.',
                    'Heben Sie ein grosses Pflanzloch aus, etwa 60 Zentimeter breit und 40 Zentimeter tief, und füllen Sie es mit Rhododendron- oder Moorbeeterde. Noch einfacher ist die Kultur in einem grossen Kübel.',
                    'Giessen Sie möglichst mit Regenwasser, da kalkhaltiges Leitungswasser den Boden mit der Zeit neutralisiert. Für eine gute Befruchtung und mehr Ertrag pflanzen Sie mindestens zwei verschiedene Sorten.',
                ], null],
            ['Beerensträucher', 'brombeeren-spalier', 'Brombeeren am Spalier ziehen',
                'An Drähten gezogen bleiben Brombeeren übersichtlich, gesund und leicht zu ernten.',
                [
                    'Spannen Sie zwischen zwei stabilen Pfosten drei Drähte auf etwa 50, 100 und 150 Zentimetern Höhe. Pflanzen Sie die Brombeere in die Mitte und binden Sie die Ruten fächerförmig an.',
                    'Brombeeren tragen wie Sommerhimbeeren an den Ruten des Vorjahres. Nach der Ernte schneiden Sie die abgetragenen Ruten bodennah ab und binden die neuen, kräftigen Ruten an ihrer Stelle an.',
                    'Ein sonniger Platz sorgt für süsse Früchte. Dornenlose Sorten machen Schnitt und Ernte deutlich angenehmer.',
                ], null],
            ['Gartenbau & Gestaltung', 'sichtschutz-planen', 'Sichtschutz planen: Hecke, Zaun oder beides?',
                'Höhe, Platz, Pflegeaufwand und Budget: Diese Fragen sollten Sie vor der Planung Ihres Sichtschutzes klären.',
                [
                    'Überlegen Sie zuerst, wie hoch der Sichtschutz werden soll und wie viel Platz zur Verfügung steht. Eine geschnittene Hecke braucht je nach Pflanze rund 50 bis 80 Zentimeter Breite – ein Zaun deutlich weniger.',
                    'Eine Hecke ist lebendig, bietet Vögeln und Insekten Lebensraum und wird mit den Jahren immer dichter. Ein Zaun schützt dafür sofort. Oft ist die Kombination ideal: ein schmaler Zaun für den Anfang, davor eine Hecke, die ihn später ersetzt.',
                    'Klären Sie vor dem Pflanzen die Grenzabstände und zulässigen Höhen mit Ihrer Gemeinde ab – sie sind kantonal geregelt. Wir beraten Sie gern zu Pflanzenwahl, Grösse und Menge.',
                ], 'thuja-smaragd'],
            ['Gartenbau & Gestaltung', 'pflanzloch-vorbereiten', 'Das Pflanzloch richtig vorbereiten',
                'Ein gut vorbereitetes Pflanzloch ist die halbe Miete – so wachsen Gehölze schneller an.',
                [
                    'Heben Sie das Pflanzloch etwa doppelt so breit und etwas tiefer als den Wurzelballen aus. Lockern Sie die Sohle und die Wände mit einer Grabgabel, damit die Wurzeln leicht in den umliegenden Boden wachsen können.',
                    'Schwere, lehmige Böden verbessern Sie mit etwas Kompost und Sand, sehr sandige Böden mit Kompost. Mischen Sie diese Zusätze mit der Aushuberde – reine Pflanzerde im Loch führt dazu, dass die Wurzeln nicht in den Gartenboden wachsen.',
                    'Tauchen Sie den Ballen vor dem Pflanzen in einen Kübel Wasser, bis keine Luftblasen mehr aufsteigen. Setzen Sie die Pflanze so tief wie zuvor im Topf, füllen Sie die Erde ein, treten Sie sie leicht an und giessen Sie kräftig.',
                ], null],
            ['Gartenbau & Gestaltung', 'mulchen', 'Mulchen: weniger giessen, weniger jäten',
                'Eine Mulchschicht hält den Boden feucht, unterdrückt Unkraut und fördert das Bodenleben.',
                [
                    'Mulch ist eine Abdeckung des Bodens mit organischem Material wie Rindenmulch, Holzhäcksel, Laub oder Rasenschnitt. Sie schützt vor Austrocknung, Erosion und starken Temperaturschwankungen.',
                    'Tragen Sie die Schicht etwa 5 bis 7 Zentimeter dick auf, aber lassen Sie rund um den Stamm einige Zentimeter frei, damit die Rinde nicht fault.',
                    'Rindenmulch entzieht dem Boden beim Verrotten Stickstoff. Streuen Sie deshalb vor dem Mulchen etwas Hornspäne oder einen organischen Dünger. Für Beerensträucher eignen sich Laub und Rasenschnitt besonders gut.',
                ], null],
            ['Gartenbau & Gestaltung', 'kleiner-garten', 'Kleiner Garten, grosse Wirkung',
                'Mit schmalen Gehölzen, Säulenobst und Kübeln wirkt auch ein kleiner Garten grün und grosszügig.',
                [
                    'In kleinen Gärten zählt jeder Zentimeter. Setzen Sie auf schlank wachsende Pflanzen wie Thuja Smaragd, Säuleneiben oder Säulenobst – sie geben Struktur und Sichtschutz, ohne viel Fläche zu beanspruchen.',
                    'Wiederholen Sie wenige Pflanzenarten, statt viele verschiedene zu kombinieren. Das wirkt ruhiger und lässt den Garten grösser erscheinen. Immergrüne sorgen dafür, dass der Garten auch im Winter nicht kahl aussieht.',
                    'Kübel und Hochbeete bringen Grün auf befestigte Flächen. Achten Sie bei Gefässen auf genügend Volumen und Abzugslöcher – dann gedeihen auch Beerensträucher und Obst auf der Terrasse.',
                ], null],
            ['Heckenpflanzen', 'hainbuche-liguster', 'Hainbuche und Liguster: Hecken mit Jahreszeiten',
                'Nicht jede Hecke muss immergrün sein. Hainbuche und Liguster sind robuste, heimische Alternativen.',
                [
                    'Die Hainbuche ist sommergrün, behält aber einen Teil ihres braunen Laubes bis in den Frühling. Sie verträgt Schnitt sehr gut, wächst auf fast allen Böden und bietet Vögeln Nistplätze.',
                    'Liguster ist je nach Sorte winter- bis halbimmergrün und wächst rasch zu einer dichten Hecke heran. Seine Blüten sind bei Insekten beliebt; die schwarzen Beeren sind für Menschen giftig.',
                    'Beide Hecken pflanzen Sie am besten im Herbst mit etwa drei bis vier Pflanzen pro Laufmeter. Ein Schnitt im Juni und bei Bedarf im Spätsommer hält sie in Form.',
                ], null],
            ['Heckenpflanzen', 'hecke-luecken', 'Lückenhafte Hecke wieder dicht bekommen',
                'Lücken in der Hecke haben meist eine Ursache. Wer sie kennt, kann gezielt nachhelfen.',
                [
                    'Prüfen Sie zuerst, warum die Lücke entstanden ist: Trockenheit, Staunässe, ein zu später Schnitt, Wildverbiss oder eine abgestorbene Pflanze. Nur wenn die Ursache behoben ist, wächst die Hecke wieder dicht.',
                    'Thuja und viele andere Nadelgehölze treiben aus altem, kahlem Holz nicht mehr aus. Bei ihnen schliessen Sie grössere Lücken am besten mit einer neuen Pflanze in passender Grösse. Eibe, Hainbuche und Liguster hingegen treiben nach einem Rückschnitt auch aus älterem Holz neu aus.',
                    'Geben Sie der Nachpflanzung gute Startbedingungen: Lockern Sie den Boden, verbessern Sie ihn mit Kompost und giessen Sie im ersten Jahr regelmässig – die Wurzeln der Nachbarpflanzen sind starke Konkurrenten.',
                ], 'thuja-smaragd'],
            ['Pflege & Boden', 'duengen', 'Richtig düngen: wann und womit?',
                'Düngen im Frühling stärkt das Wachstum – ab dem Spätsommer sollten Sie damit aufhören.',
                [
                    'Die meisten Gehölze düngen Sie im Frühling, wenn der Austrieb beginnt, etwa von März bis Juni. Organische Dünger wie Hornspäne oder gut verrotteter Kompost geben die Nährstoffe langsam ab und fördern das Bodenleben.',
                    'Ab August sollten Sie keinen stickstoffbetonten Dünger mehr geben. Sonst bilden die Pflanzen weiche Triebe, die vor dem Winter nicht mehr ausreifen und leicht erfrieren.',
                    'Viel hilft nicht viel: Halten Sie sich an die Mengenangaben auf der Packung. Frisch gepflanzte Gehölze brauchen im ersten Jahr meist keinen zusätzlichen Dünger, wenn Sie den Boden beim Pflanzen mit Kompost verbessert haben.',
                ], null],
            ['Pflege & Boden', 'container-ballenware', 'Container oder Ballen: Was ist der Unterschied?',
                'Gehölze gibt es im Topf oder mit Erdballen im Tuch. Das beeinflusst, wann und wie Sie pflanzen.',
                [
                    'Containerpflanzen wachsen im Topf heran und haben ein vollständiges Wurzelwerk. Sie können fast das ganze Jahr gepflanzt werden, solange der Boden nicht gefroren ist und keine extreme Hitze herrscht.',
                    'Ballenware wird im Feld gezogen und mit einem Erdballen in Jutetuch, teils zusätzlich mit Drahtkorb, ausgegraben. Sie wird vor allem im Herbst und Frühling gepflanzt. Das Jutetuch kann im Boden bleiben, öffnen Sie es aber oben am Wurzelhals. Ein Drahtkorb wird ebenfalls oben geöffnet.',
                    'Ballenware ist bei grösseren Pflanzen oft günstiger und wächst gut an, wenn sie rasch gepflanzt und gut gewässert wird. Wir sagen Ihnen gern, in welcher Form Ihre Wunschpflanzen verfügbar sind.',
                ], null],
            ['Pflege & Boden', 'kuebelpflanzen-winter', 'Pflanzen im Topf gut durch den Winter bringen',
                'Im Kübel sind die Wurzeln dem Frost stärker ausgesetzt als im Gartenboden. So schützen Sie sie.',
                [
                    'Im Gartenboden sind Wurzeln gut vor Frost geschützt, im Topf hingegen kann der ganze Ballen durchfrieren. Stellen Sie Kübel deshalb an eine geschützte Hauswand und auf Füsse oder eine Styroporplatte, damit Wasser abfliessen kann und die Kälte nicht von unten eindringt.',
                    'Umwickeln Sie den Topf mit Jute, Kokosmatten oder Luftpolsterfolie. Bei Immergrünen wie Thuja, Eibe oder Ilex schützt ein Vlies zusätzlich vor Wintersonne.',
                    'Vergessen Sie das Giessen nicht: Immergrüne verdunsten auch im Winter Wasser. Giessen Sie an frostfreien Tagen mässig, aber vermeiden Sie Staunässe.',
                ], null],
        ];
    }
}
