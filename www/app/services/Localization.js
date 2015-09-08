/**
 * Created by storskel on 07.09.2015.
 */
angular
    .module('Varsom')
    .factory('Localization', function Localization(AppSettings) {
        var service = {};

        var translations = {
            nb: {
                api: {
                    // AVALANCHE

                    "DangerLevelName-0": "Ikke vurdert",
                    "DangerLevelName-1": "Liten",
                    "DangerLevelName-2": "Moderat",
                    "DangerLevelName-3": "Betydelig",
                    "DangerLevelName-4": "Stor",
                    "DangerLevelName-5": "Meget stor",

                    // Old
                    "AvalancheExt-10": "Tørre løssnøskred",
                    "AvalancheExt-15": "Våte løssnøskred",
                    "AvalancheExt-20": "Tørre flakskred",
                    "AvalancheExt-25": "Våte flakskred",
                    "AvalancheExt-30": "Sørpeskred",
                    "AvalancheExt-40": "Skavl",

                    // New
                    "AvalancheExt-0": "Ikke gitt",
                    "AvalancheExt-50": "Fokksnø",
                    "AvalancheExt-51": "Nysnø",
                    "AvalancheExt-52": "Vedvarende svakt lag",
                    "AvalancheExt-53": "Vedvarende svakt lag ved bakken",
                    "AvalancheExt-54": "Våt snø",
                    "AvalancheExt-55": "Nysnø",
                    "AvalancheExt-56": "Våt snø",

                    "AvalCause-0": "Ikke gitt",
                    "AvalCause-10": "Nedsnødd eller nedføyket svakt lag med løs nysnø.",
                    "AvalCause-11": "Nedsnødd eller nedføyket svakt lag med overflaterim.",
                    "AvalCause-12": "Nedsnødd eller nedføyket svakt lag med sprøhagl.",
                    "AvalCause-13": "Nedsnødd eller nedføyket svakt lag med kantkornet snø.",
                    "AvalCause-14": "Dårlig binding mellom glatt skare og overliggende snø.",
                    "AvalCause-15": "Dårlig binding mellom lag i fokksnøen.",
                    "AvalCause-16": "Svakt lag av kantkornet snø ved bakken.",
                    "AvalCause-17": "Svakt lag av kantkornet snø rundt vegetasjon.",
                    "AvalCause-18": "Svakt lag av kantkornet snø over skarelag.",
                    "AvalCause-19": "Svakt lag av kantkornet snø under skarelag.",
                    "AvalCause-20": "Snødekket er gjennomfuktet og ustabilt fra bakken.",
                    "AvalCause-21": "Snødekket gjennomfuktet og ustabilt fra overflaten.",
                    "AvalCause-22": "Opphopning av vann over skarelag.",
                    "AvalCause-23": "Snødekket er overmettet av vann.",
                    "AvalCause-24": "Ubundet løs snø.",
                    // New
                    "AvalCause-25": "Regn og/eller oppvarming.",
                    "AvalCause-26": "Smelting fra bakken.",
                    "AvalCause-27": "Vannmettet snø.",
                    "AvalCause-28": "Løs tørr snø.",
                    "AvalCause-29": "Regn / temperatutstigning / soloppvarming.",

                    "AvalProbability-Label": "Sannsynlighet",
                    "AvalProbability-0": "Ikke gitt",
                    "AvalProbability-2": "Lite sannsynlig",
                    "AvalProbability-3": "Mulig",
                    "AvalProbability-5": "Sannsynlig",
                    "AvalProbability-7": "Meget sannsynlig",

                    "AvalTriggerSimple-0": "Ikke gitt",
                    "AvalTriggerSimple-10": "Stor tilleggsbelastning",
                    "AvalTriggerSimple-21": "Liten tilleggsbelastning",
                    "AvalTriggerSimple-22": "Naturlig utløst",

                    "DestructiveSizeExt-Label": "Skredstørrelse",
                    "DestructiveSizeExt-0": "Ikke gitt",
                    "DestructiveSizeExt-1": "Harmløst",
                    "DestructiveSizeExt-2": "Små skred",
                    "DestructiveSizeExt-3": "Middels skred",
                    "DestructiveSizeExt-4": "Store skred",
                    "DestructiveSizeExt-5": "Svært store skred",
                    "DestructiveSizeExt-9": "Ukjent",

                    "AvalPropagation-0": "Ikke vurdert",
                    "AvalPropagation-1": "Isolerte faresoner",
                    "AvalPropagation-2": "Noen bratte heng",
                    "AvalPropagation-3": "Mange bratte heng",
                    "AvalPropagation-4": "De fleste bratte heng",
                    "AvalPropagation-5": "Også i mindre bratte terreng",

                    "AvalancheType-0": "Ikke gitt",
                    "AvalancheType-10": "Flakskred",
                    "AvalancheType-20": "Løssnøskred",

                    "AvalancheProblemType-0": "Ikke gitt",
                    "AvalancheProblemType-10": "Fokksnø",
                    "AvalancheProblemType-20": "Nysnø",
                    "AvalancheProblemType-30": "Vedvarende svakt lag",
                    "AvalancheProblemType-40": "Våt snø",

                    "AvalancheExposition-non-given": "Ikke gitt",
                    "AvalancheExposition-0": "N",
                    "AvalancheExposition-1": "NØ",
                    "AvalancheExposition-2": "Ø",
                    "AvalancheExposition-3": "SØ",
                    "AvalancheExposition-4": "S",
                    "AvalancheExposition-5": "SV",
                    "AvalancheExposition-6": "V",
                    "AvalancheExposition-7": "NV",

                    "ExposedHeightFill-0": "Ikke gitt",
                    "ExposedHeightFill-1": "Over %@ moh",
                    "ExposedHeightFill-2": "Under %@ moh",
                    "ExposedHeightFill-3": "Over %@ og under %@ moh",
                    "ExposedHeightFill-4": "Mellom %@ og %@ moh",

                    // LANDSLIDE AND FLOOD

                    "cause list": "Problemer",
                    "cause singular": "Problem",

                    "CauseName-0": "Ikke gitt",
                    "CauseName-1": "Regn",
                    "CauseName-2": "Intens regn (bygenedbør)",
                    "CauseName-3": "Snøsmelting",
                    "CauseName-4": "Isgang",
                    "CauseName-5": "Frost og is",
                    "CauseName-6": "Vannmetning (i jord)",
                    "CauseName-7": "Dambrudd/jøkulhlaup",

                    "LandslideTypeName-0": "Ikke gitt",
                    "LandslideTypeName-1": "Utgliding",
                    "LandslideTypeName-2": "Jordskred",
                    "LandslideTypeName-3": "Flomskred",
                    "LandslideTypeName-4": "Sørpeskred"
                },
                infoPage: {

                    "warning levels": "Aktsomhetsnivåer",
                    "avalanche warning levels": "Snøskredfareskala",

                    "contact information": "Kontaktinformasjon",

                    "all hours": "Døgnbemannet",
                    "work hours": "(i arbeidstiden)",

                    "varsom.no facebook": "Varsom på Facebook",
                    "varsom.no facebook comment": "Søk etter \"varsom.no\"",
                    "avalanche facebook": "Snøskredvarslingen på Facebook",
                    "avalanche facebook comment": "Søk etter \"Snøskredvarslingen i Norge\"",
                    "avalanche school": "Snøskredskolen",
                    "avalanche school comment": "En del av varsom.no",

                    "call": "Ring nå",
                    "open": "Åpne",

                    "FloodWarningDescription-0": "Ikke vurdert",

                    "FloodWarningDescription-1": "Generelt trygge forhold/ingen spesiell fare.",

                    "FloodWarningDescription-2": "Raskt økende vannføring som kan medføre lokale oversvømmelser. Spesielt stor vannføring/vannstand for årstiden, fare for isgang etc. Det kan forekomme store problemer/flomskader lokalt. Vannføring opp til 5 års gjentaksintervall.",

                    "FloodWarningDescription-3": "Vannføring som kan medføre omfattende oversvømmelser og flomskader på utsatte steder. Vannføring mellom 5 og 50 års gjentaksintervall.",

                    "FloodWarningDescription-4": "Vannføring som kan medføre omfattende oversvømmelser og flomskader på bebyggelse og infrastruktur over store områder. Vannføring med mer enn 50 års gjentaksintervall.",

                    "LandslideWarningDescription-0": "Ikke vurdert.",

                    "LandslideWarningDescription-1": "Generelt trygge forhold. Ingen spesielle forholdsregler er nødvendig.",

                    "LandslideWarningDescription-2": "Det ventes noen jordskred og/eller sørpeskred. Enkelte store hendelser kan forekomme. Vær oppmerksom i utsatte områder (oftest bratt terreng og langs bekker og elveløp). Hold deg oppdatert om utviklingen av været og den hydrologiske situasjonen. Forebyggende tiltak, som rensing av dreneringsveier i spesielt utsatte områder, anbefales.",

                    "LandslideWarningDescription-3": "Det ventes flere store og små jordskred og/eller sørpeskred. Vær oppmerksom og følg oppfordringer fra myndighetene. Forebyggende tiltak som rensing av dreneringsveier bør utføres.",

                    "LandslideWarningDescription-4": "Det ventes mange store jordskred og/eller sørpeskred. Følg med i media, og følg oppfordringer og råd fra myndighetene. Sikkerhetstiltak som vegstenging og evakuering kan skje på kort varsel.",

                    "AvalancheWarningDescription-0": "Ikke vurdert",

                    "AvalancheWarningTitle-1": "Liten",
                    "AvalancheWarningDescription-1": "Enkelte spesielt utsatte områder vil kunne være skredutsatte. I disse områdene, vær oppmerksom på mulig skredproblem. Generelt stabile forhold. Generelt sterke bindinger og stabilt. Utløsning generelt kun mulig ved stor tilleggsbelastning i noen få ekstreme heng. Kun små naturlig utløste skred er mulig.",

                    "AvalancheWarningTitle-2": "Moderat",
                    "AvalancheWarningDescription-2": "Ferdsel i skredterreng krever kunnskap, erfaring i rutevalg og evne til å identifisere skredproblem. Generelt anbefales det å unngå terreng brattere enn 30 grader. Lokalt ustabile forhold. Moderate bindinger i noen brattheng, for øvrig sterke bindinger. Utløsning mulig, spesielt ved stor tilleggsbelastning i brattheng. Store naturlig utløste skred forventes ikke.",

                    "AvalancheWarningTitle-3": "Betydelig",
                    "AvalancheWarningDescription-3": "Ferdsel i skredterreng krever solid kunnskap, erfaring i rutevalg og evne til å identifisere skredproblem. Generelt anbefales det å unngå terreng brattere enn 30 grader og holde avstand til utløpsområder. Generelt ustabile forhold. Moderat til svake bindinger i mange brattheng. Utløsning mulig, selv ved liten tilleggsbelastning i brattheng. Fjernutløsning mulig. Under spesielle forhold kan det forekomme noen middels store og enkelte store naturlig utløste skred.",

                    "AvalancheWarningTitle-4": "Stor",
                    "AvalancheWarningDescription-4": "Ferdsel i skredterreng anbefales ikke. Skred som løsner av seg selv forventes. Unngå løsne- og utløpsområder. Omfattende ustabile forhold. Svake bindinger i de fleste brattheng. Utløsning sannsynlig selv ved liten tilleggsbelastning i mange brattheng. Fjernutløsning sannsynlig. Under spesielle forhold forventes det mange middels store og noen store naturlig utløste skred.",

                    "AvalancheWarningTitle-5": "Meget stor",
                    "AvalancheWarningDescription-5": "Ferdsel i skredterreng frarådes! Ekstremt ustabile forhold. Generelt svake bindinger og svært ustabilt. Mange store, også svært store, naturlig utløste skred forventes, selv i moderat bratt terreng. Fjernutløsning meget sannsynlig."

                },
                general: {
                    "loading...": "Laster...",

                    "avalanche tab title": "Snøskred",
                    "flood tab title": "Flom",
                    "landslide tab title": "Jordskred",
                    "favorites tab title": "Favoritter",

                    "overview view title": "Oversikt",
                    "favorites view title": "Favoritter",

                    "map view": "I kart",
                    "table view": "Som liste",

                    "favorites header for warningType 1": "Flom",
                    "favorites header for warningType 2": "Jordskred",
                    "favorites header for warningType 3": "Snøskred",

                    "published": "Publisert: %@",
                    "next warning": "Neste varsel før: %@",

                    "no main text": "Ingen oppsummering",

                    "warning text back button title": "Varsel",

                    "empty favorites table": "Dine stjernede favorittområder vil dukke opp i denne listen.",

                    "empty avalanche warnings table": "Kom tilbake etter 1. desember",
                    "empty flood warnings table": "Ingen flomvarsel for i dag eller de neste to dagene",
                    "empty landslide warnings table": "Ingen jordskredvarsel for i dag eller de neste to dagene",

// PUSH WARNINGS

                    "AvalancheWarning problem changed": "%@ - snøskred: Endring i det viktigste snøskredproblemet.",
                    "AvalancheWarning forecast changed": "%@ - snøskred: Høyeste varslingsnivå endret fra %@ til %@ for de neste tre dagene.",
                    "FloodWarning forecast changed": "%@ - flom: Høyeste varslingsnivå endret fra %@ til %@ for de neste tre dagene.",
                    "LandSlideWarning forecast changed": "%@ - jordskred: Høyeste varslingsnivå endret fra %@ til %@ for de neste tre dagene.",
                    "FloodWarning MicroBlogPosts have changed": "%@ - flom: Ny varslingsoppdatering.",
                    "LandSlideWarning MicroBlogPosts have changed": "%@ - jordskred: Ny varslingsoppdatering.",

// AVALANCHE

                    "regobs link": "Gå til regionen på regobs.no",

                    "emergency warning": "Beredskapsmelding",

                    "avalanche problems": "Skredproblemer",
                    "avalanche problem": "Skredproblem",

// LANDSLIDE AND FLOOD

                    "cause list": "Problemer",
                    "cause singular": "Problem",

                    "landslide types": "Skredtyper",
                    "landslide type": "Skredtype",

                    "micro blog posts": "Oppdateringer",
                    "micro blog post": "Oppdatering"
                }
            },
            en: {
                api: {

// AVALANCHE

                    "DangerLevelName-0": "Not given",
                    "DangerLevelName-1": "Low",
                    "DangerLevelName-2": "Moderate",
                    "DangerLevelName-3": "Considerable",
                    "DangerLevelName-4": "High",
                    "DangerLevelName-5": "Extreme",

//Old
                    "AvalancheExt-0": "Not given",
                    "AvalancheExt-10": "Loose dry avalanche",
                    "AvalancheExt-15": "Loose wet avalanche",
                    "AvalancheExt-20": "Dry slab avalanche",
                    "AvalancheExt-25": "Wet slab avalanche",
                    "AvalancheExt-30": "Slush avalanche",
                    "AvalancheExt-40": "Cornice",

//New
                    "AvalancheExt-0": "Not given",
                    "AvalancheExt-50": "Wind slab",
                    "AvalancheExt-51": "New snow",
                    "AvalancheExt-52": "Persistent weak layer",
                    "AvalancheExt-53": "Persistent weak layer",
                    "AvalancheExt-54": "Wet snow",
                    "AvalancheExt-55": "New snow",
                    "AvalancheExt-56": "Wet snow",

                    "AvalCause-0": "Not given",
                    "AvalCause-10": "Buried weak layer of new snow.",
                    "AvalCause-11": "Buried weak layer of surface hoar.",
                    "AvalCause-12": "Buried weak layer of graupel.",
                    "AvalCause-13": "Buried weak layer of faceted snow near surface.",
                    "AvalCause-14": "Poor bonding between buried crust and overlying snow.",
                    "AvalCause-15": "Poor bonding between layers in wind deposited snow.",
                    "AvalCause-16": "Buried weak layer of faceted snow near the ground.",
                    "AvalCause-17": "Buried weak layer of faceted snow near vegetation.",
                    "AvalCause-18": "Buried weak layer of faceted snow above a crust.",
                    "AvalCause-19": "Buried weak layer of faceted snow under a crust.",
                    "AvalCause-20": "Snødekket er gjennomfuktet og ustabilt fra bakken.",
                    "AvalCause-21": "Wet snow on the surface.",
                    "AvalCause-22": "Free water above crusts.",
                    "AvalCause-23": "Water-saturated snow.",
                    "AvalCause-24": "Loose snow.",
// New
                    "AvalCause-25": "Rain and/or heating",
                    "AvalCause-26": "Mealting from the ground up.",
                    "AvalCause-27": "Water-saturated snow.",
                    "AvalCause-28": "Loose dry snow.",
                    "AvalCause-29": "Rain / rise in temperature / solar heating.",

                    "AvalTriggerSimple-0": "Not given",
                    "AvalTriggerSimple-10": "Large additional load",
                    "AvalTriggerSimple-21": "Small additional load",
                    "AvalTriggerSimple-22": "Naturally released",

                    "AvalProbability-Label": "Likelihood",
                    "AvalProbability-0": "Not given",
                    "AvalProbability-2": "Low probability",
                    "AvalProbability-3": "Possible",
                    "AvalProbability-5": "Probable",
                    "AvalProbability-7": "Very probable",

                    "DestructiveSizeExt-Label": "Expected Size",
                    "DestructiveSizeExt-0": "Not given",
                    "DestructiveSizeExt-1": "Harmless aval",
                    "DestructiveSizeExt-2": "Small aval",
                    "DestructiveSizeExt-3": "Medium aval",
                    "DestructiveSizeExt-4": "Large aval",
                    "DestructiveSizeExt-5": "Very large aval",
                    "DestructiveSizeExt-9": "Unknown",

                    "AvalPropagation-0": "Not given",
                    "AvalPropagation-1": "Single hazard sites",
                    "AvalPropagation-2": "Some steep slopes",
                    "AvalPropagation-3": "Many steep slopes",
                    "AvalPropagation-4": "Most steep slopes",
                    "AvalPropagation-5": "Also in moderately steep slopes",

                    "AvalancheType-0": "Not given",
                    "AvalancheType-10": "Slab avalanche",
                    "AvalancheType-20": "Loose snow avalanche",

                    "AvalancheProblemType-0": "Not given",
                    "AvalancheProblemType-10": "Wind slab",
                    "AvalancheProblemType-20": "New snow",
                    "AvalancheProblemType-30": "Persistent weak layer",
                    "AvalancheProblemType-40": "Wet snow",

                    "AvalancheExposition-non-given": "Ikke gitt",
                    "AvalancheExposition-0": "N",
                    "AvalancheExposition-1": "NØ",
                    "AvalancheExposition-2": "Ø",
                    "AvalancheExposition-3": "SØ",
                    "AvalancheExposition-4": "S",
                    "AvalancheExposition-5": "SV",
                    "AvalancheExposition-6": "V",
                    "AvalancheExposition-7": "NV",

                    "ExposedHeightFill-0": "Ikke gitt",
                    "ExposedHeightFill-1": "Over %@ moh",
                    "ExposedHeightFill-2": "Under %@ moh",
                    "ExposedHeightFill-3": "Over %@ og under %@ moh",
                    "ExposedHeightFill-4": "Mellom %@ og %@ moh",

                    "AvalancheExt-0": "Ikke gitt",
                    "AvalancheExt-10": "Tørre løssnøskred",
                    "AvalancheExt-15": "Våte løssnøskred",
                    "AvalancheExt-20": "Tørre flakskred",
                    "AvalancheExt-25": "Våte flakskred",
                    "AvalancheExt-30": "Sørpeskred",
                    "AvalancheExt-40": "Skavl",

// LANDSLIDE AND FLOOD

                    "CauseName-0": "Ikke gitt",
                    "CauseName-1": "Regn",
                    "CauseName-2": "Intens regn (bygenedbør)",
                    "CauseName-3": "Snøsmelting",
                    "CauseName-4": "Isgang",
                    "CauseName-5": "Frost og is",
                    "CauseName-6": "Vannmetning (i jord)",
                    "CauseName-7": "Dambrudd/jøkulhlaup",

                    "LandslideTypeName-0": "Ikke gitt",
                    "LandslideTypeName-1": "Utgliding",
                    "LandslideTypeName-2": "Jordskred",
                    "LandslideTypeName-3": "Flomskred",
                    "LandslideTypeName-4": "Sørpeskred"
                },
                infoPage: {
                    /*
                     InfoPage.strings
                     varsom

                     Created by Benedicte Raae on 09.04.14.
                     Copyright (c) 2014 NVE. All rights reserved.
                     */

                    "warning levels": "Warning Levels",
                    "avalanche warning levels": "Avalanche Danger Scale",

                    "phone numbers": "Contact Information",

                    "all hours": "All hours",
                    "work hours": "Work hours",

                    "varsom.no facebook": "Varsom Facebook Page",
                    "varsom.no facebook comment": "Search for \"varsom.no\"",
                    "avalanche facebook": "Avalanche Facebook Page",
                    "avalanche facebook comment": "Search for \"Snøskredvarslingen i Norge\"",
                    "avalanche school": "The avalanche school",
                    "avalanche school comment": "@ varsom.no (in norwegian only)",

                    "call": "Call now",
                    "open": "Open",

                    "FloodWarningDescription-0": "Ikke vurdert",

                    "FloodWarningDescription-1": "Generelt trygge forhold/ingen spesiell fare.",

                    "FloodWarningDescription-2": "Raskt økende vannføring som kan medføre lokale oversvømmelser. Spesielt stor vannføring/vannstand for årstiden, fare for isgang etc. Det kan forekomme store problemer/flomskader lokalt. Vannføring opp til 5 års gjentaksintervall.",

                    "FloodWarningDescription-3": "Vannføring som kan medføre omfattende oversvømmelser og flomskader på utsatte steder. Vannføring mellom 5 og 50 års gjentaksintervall.",

                    "FloodWarningDescription-4": "Vannføring som kan medføre omfattende oversvømmelser og flomskader på bebyggelse og infrastruktur over store områder. Vannføring med mer enn 50 års gjentaksintervall.",

                    "LandslideWarningDescription-0": "Ikke vurdert.",

                    "LandslideWarningDescription-1": "Generelt trygge forhold. Ingen spesielle forholdsregler er nødvendig.",

                    "LandslideWarningDescription-2": "Det ventes noen jordskred og/eller sørpeskred. Enkelte store hendelser kan forekomme. Vær oppmerksom i utsatte områder (oftest bratt terreng og langs bekker og elveløp). Hold deg oppdatert om utviklingen av været og den hydrologiske situasjonen. Forebyggende tiltak, som rensing av dreneringsveier i spesielt utsatte områder, anbefales.",

                    "LandslideWarningDescription-3": "Det ventes flere store og små jordskred og/eller sørpeskred. Vær oppmerksom og følg oppfordringer fra myndighetene. Forebyggende tiltak som rensing av dreneringsveier bør utføres.",

                    "LandslideWarningDescription-4": "Det ventes mange store jordskred og/eller sørpeskred. Følg med i media, og følg oppfordringer og råd fra myndighetene. Sikkerhetstiltak som vegstenging og evakuering kan skje på kort varsel.",

                    "AvalancheWarningDescription-0": "No rating",

                    "AvalancheWarningTitle-1": "Low",
                    "AvalancheWarningDescription-1": "The snowpack is well bonded and stable in general. Triggering is generally possible only from high additional loads in isolated areas of very steep, extreme terrain. Only sluffs and small-sized natural avalanches are possible.",

                    "AvalancheWarningTitle-2": "Moderate",
                    "AvalancheWarningDescription-2": "The snowpack is only moderately well bonded on some steep slopes, otherwise well bonded in general. Triggering is possible primarily from high additional loads, particularly on the indicated steep slopes*. Large-sized natural avalanches are unlikely.",

                    "AvalancheWarningTitle-3": "Considerable",
                    "AvalancheWarningDescription-3": "The snowpack is moderately to poorly bonded on many steep slopes. Triggering is possible, even from low additional loads particularly on the indicated steep slopes. In some cases medium-sized, in isolated cases large-sized natural avalanches are possible.",

                    "AvalancheWarningTitle-4": "High",
                    "AvalancheWarningDescription-4": "The snowpack is poorly bonded on most steep slopes. Triggering is likely even from low additional loads** on many steep slopes. In some cases, numerous medium-sized and often large-sized natural avalanches can be expected.",

                    "AvalancheWarningTitle-5": "Very high",
                    "AvalancheWarningDescription-5": "The snowpack is poorly bonded and largely unstable in general. Numerous large-sized and often very large-sized natural avalanches can be expected, even in moderately steep terrain"
                },
                general: {
                    /*
                     Localizable.strings
                     varsom

                     Created by Benedicte Raae on 14.11.13.
                     Copyright (c) 2013 NVE. All rights reserved.
                     */
                    "loading...": "Loading...",

                    "avalanche tab title": "Avalanche",
                    "flood tab title": "Flood",
                    "landslide tab title": "Landslide",
                    "favorites tab title": "Favorites",

                    "overview view title": "Overview",
                    "favorites view title": "Favorites",

                    "map view": "In Map",
                    "table view": "As Table",

                    "favorites header for warningType 1": "Flood",
                    "favorites header for warningType 2": "Landslide",
                    "favorites header for warningType 3": "Avalanche",

                    "published": "Published: %@",
                    "next warning": "Next warning before: %@",

                    "no main text": "No summary",

                    "warning text back button title": "Forecast",

                    "empty favorites table": "Star an area and it will show up in this table.",

                    "empty avalanche warnings table": "Check back after December 1st",
                    "empty flood warnings table": "No flood warnings issued for today or the next two days",
                    "empty landslide warnings table": "No landslide warnings issued for today or the next two days",

// PUSH WARNINGS

                    "AvalancheWarning problem changed": "%@ - avalanche: Most important avalanche problem changed.",
                    "AvalancheWarning forecast changed": "%@ - avalanche: Highest warning level changed from %@ to %@ for the next three days.",
                    "FloodWarning forecast changed": "%@ - flood: Highest warning level changed from %@ to %@ for the next three days.",
                    "LandSlideWarning forecast changed": "%@ - landslide: Highest warning level changed from %@ to %@ for the next three days.",
                    "FloodWarning MicroBlogPosts have changed": "%@ - flood: New update for warning.",
                    "LandSlideWarning MicroBlogPosts have changed": "%@ - landslide: New update for warning.",

// AVALANCHE

                    "regobs link": "View region on regobs.no",

                    "emergency warning": "Emergency Warning",

                    "avalanche problems": "Avalanche Problems",
                    "avalanche problem": "Avalanche Problem",

// LANDSLIDE AND FLOOD

                    "cause list": "Problems",
                    "cause singular": "Problem",

                    "landslide types": "Landslide types",
                    "landslide type": "Landslide type",

                    "micro blog posts": "Updates",
                    "micro blog post": "Update"
                }
            }
        };

        service.getTranslations = function (localeOverride) {
            var loc = localeOverride || AppSettings.getLocale();
            return translations[loc];
        };

        return service;

    });
