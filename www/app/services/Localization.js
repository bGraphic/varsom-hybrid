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
                    "AvalancheExt-10": "T�rre l�ssn�skred",
                    "AvalancheExt-15": "V�te l�ssn�skred",
                    "AvalancheExt-20": "T�rre flakskred",
                    "AvalancheExt-25": "V�te flakskred",
                    "AvalancheExt-30": "S�rpeskred",
                    "AvalancheExt-40": "Skavl",

                    // New
                    "AvalancheExt-0": "Ikke gitt",
                    "AvalancheExt-50": "Fokksn�",
                    "AvalancheExt-51": "Nysn�",
                    "AvalancheExt-52": "Vedvarende svakt lag",
                    "AvalancheExt-53": "Vedvarende svakt lag ved bakken",
                    "AvalancheExt-54": "V�t sn�",
                    "AvalancheExt-55": "Nysn�",
                    "AvalancheExt-56": "V�t sn�",

                    "AvalCause-0": "Ikke gitt",
                    "AvalCause-10": "Nedsn�dd eller nedf�yket svakt lag med l�s nysn�.",
                    "AvalCause-11": "Nedsn�dd eller nedf�yket svakt lag med overflaterim.",
                    "AvalCause-12": "Nedsn�dd eller nedf�yket svakt lag med spr�hagl.",
                    "AvalCause-13": "Nedsn�dd eller nedf�yket svakt lag med kantkornet sn�.",
                    "AvalCause-14": "D�rlig binding mellom glatt skare og overliggende sn�.",
                    "AvalCause-15": "D�rlig binding mellom lag i fokksn�en.",
                    "AvalCause-16": "Svakt lag av kantkornet sn� ved bakken.",
                    "AvalCause-17": "Svakt lag av kantkornet sn� rundt vegetasjon.",
                    "AvalCause-18": "Svakt lag av kantkornet sn� over skarelag.",
                    "AvalCause-19": "Svakt lag av kantkornet sn� under skarelag.",
                    "AvalCause-20": "Sn�dekket er gjennomfuktet og ustabilt fra bakken.",
                    "AvalCause-21": "Sn�dekket gjennomfuktet og ustabilt fra overflaten.",
                    "AvalCause-22": "Opphopning av vann over skarelag.",
                    "AvalCause-23": "Sn�dekket er overmettet av vann.",
                    "AvalCause-24": "Ubundet l�s sn�.",
                    // New
                    "AvalCause-25": "Regn og/eller oppvarming.",
                    "AvalCause-26": "Smelting fra bakken.",
                    "AvalCause-27": "Vannmettet sn�.",
                    "AvalCause-28": "L�s t�rr sn�.",
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
                    "AvalTriggerSimple-22": "Naturlig utl�st",

                    "DestructiveSizeExt-Label": "Skredst�rrelse",
                    "DestructiveSizeExt-0": "Ikke gitt",
                    "DestructiveSizeExt-1": "Harml�st",
                    "DestructiveSizeExt-2": "Sm� skred",
                    "DestructiveSizeExt-3": "Middels skred",
                    "DestructiveSizeExt-4": "Store skred",
                    "DestructiveSizeExt-5": "Sv�rt store skred",
                    "DestructiveSizeExt-9": "Ukjent",

                    "AvalPropagation-0": "Ikke vurdert",
                    "AvalPropagation-1": "Isolerte faresoner",
                    "AvalPropagation-2": "Noen bratte heng",
                    "AvalPropagation-3": "Mange bratte heng",
                    "AvalPropagation-4": "De fleste bratte heng",
                    "AvalPropagation-5": "Ogs� i mindre bratte terreng",

                    "AvalancheType-0": "Ikke gitt",
                    "AvalancheType-10": "Flakskred",
                    "AvalancheType-20": "L�ssn�skred",

                    "AvalancheProblemType-0": "Ikke gitt",
                    "AvalancheProblemType-10": "Fokksn�",
                    "AvalancheProblemType-20": "Nysn�",
                    "AvalancheProblemType-30": "Vedvarende svakt lag",
                    "AvalancheProblemType-40": "V�t sn�",

                    "AvalancheExposition-non-given": "Ikke gitt",
                    "AvalancheExposition-0": "N",
                    "AvalancheExposition-1": "N�",
                    "AvalancheExposition-2": "�",
                    "AvalancheExposition-3": "S�",
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
                    "CauseName-2": "Intens regn (bygenedb�r)",
                    "CauseName-3": "Sn�smelting",
                    "CauseName-4": "Isgang",
                    "CauseName-5": "Frost og is",
                    "CauseName-6": "Vannmetning (i jord)",
                    "CauseName-7": "Dambrudd/j�kulhlaup",

                    "LandslideTypeName-0": "Ikke gitt",
                    "LandslideTypeName-1": "Utgliding",
                    "LandslideTypeName-2": "Jordskred",
                    "LandslideTypeName-3": "Flomskred",
                    "LandslideTypeName-4": "S�rpeskred"
                },
                infoPage: {

                    "warning levels": "Aktsomhetsniv�er",
                    "avalanche warning levels": "Sn�skredfareskala",

                    "contact information": "Kontaktinformasjon",

                    "all hours": "D�gnbemannet",
                    "work hours": "(i arbeidstiden)",

                    "varsom.no facebook": "Varsom p� Facebook",
                    "varsom.no facebook comment": "S�k etter \"varsom.no\"",
                    "avalanche facebook": "Sn�skredvarslingen p� Facebook",
                    "avalanche facebook comment": "S�k etter \"Sn�skredvarslingen i Norge\"",
                    "avalanche school": "Sn�skredskolen",
                    "avalanche school comment": "En del av varsom.no",

                    "call": "Ring n�",
                    "open": "�pne",

                    "FloodWarningDescription-0": "Ikke vurdert",

                    "FloodWarningDescription-1": "Generelt trygge forhold/ingen spesiell fare.",

                    "FloodWarningDescription-2": "Raskt �kende vannf�ring som kan medf�re lokale oversv�mmelser. Spesielt stor vannf�ring/vannstand for �rstiden, fare for isgang etc. Det kan forekomme store problemer/flomskader lokalt. Vannf�ring opp til 5 �rs gjentaksintervall.",

                    "FloodWarningDescription-3": "Vannf�ring som kan medf�re omfattende oversv�mmelser og flomskader p� utsatte steder. Vannf�ring mellom 5 og 50 �rs gjentaksintervall.",

                    "FloodWarningDescription-4": "Vannf�ring som kan medf�re omfattende oversv�mmelser og flomskader p� bebyggelse og infrastruktur over store omr�der. Vannf�ring med mer enn 50 �rs gjentaksintervall.",

                    "LandslideWarningDescription-0": "Ikke vurdert.",

                    "LandslideWarningDescription-1": "Generelt trygge forhold. Ingen spesielle forholdsregler er n�dvendig.",

                    "LandslideWarningDescription-2": "Det ventes noen jordskred og/eller s�rpeskred. Enkelte store hendelser kan forekomme. V�r oppmerksom i utsatte omr�der (oftest bratt terreng og langs bekker og elvel�p). Hold deg oppdatert om utviklingen av v�ret og den hydrologiske situasjonen. Forebyggende tiltak, som rensing av dreneringsveier i spesielt utsatte omr�der, anbefales.",

                    "LandslideWarningDescription-3": "Det ventes flere store og sm� jordskred og/eller s�rpeskred. V�r oppmerksom og f�lg oppfordringer fra myndighetene. Forebyggende tiltak som rensing av dreneringsveier b�r utf�res.",

                    "LandslideWarningDescription-4": "Det ventes mange store jordskred og/eller s�rpeskred. F�lg med i media, og f�lg oppfordringer og r�d fra myndighetene. Sikkerhetstiltak som vegstenging og evakuering kan skje p� kort varsel.",

                    "AvalancheWarningDescription-0": "Ikke vurdert",

                    "AvalancheWarningTitle-1": "Liten",
                    "AvalancheWarningDescription-1": "Enkelte spesielt utsatte omr�der vil kunne v�re skredutsatte. I disse omr�dene, v�r oppmerksom p� mulig skredproblem. Generelt stabile forhold. Generelt sterke bindinger og stabilt. Utl�sning generelt kun mulig ved stor tilleggsbelastning i noen f� ekstreme heng. Kun sm� naturlig utl�ste skred er mulig.",

                    "AvalancheWarningTitle-2": "Moderat",
                    "AvalancheWarningDescription-2": "Ferdsel i skredterreng krever kunnskap, erfaring i rutevalg og evne til � identifisere skredproblem. Generelt anbefales det � unng� terreng brattere enn 30 grader. Lokalt ustabile forhold. Moderate bindinger i noen brattheng, for �vrig sterke bindinger. Utl�sning mulig, spesielt ved stor tilleggsbelastning i brattheng. Store naturlig utl�ste skred forventes ikke.",

                    "AvalancheWarningTitle-3": "Betydelig",
                    "AvalancheWarningDescription-3": "Ferdsel i skredterreng krever solid kunnskap, erfaring i rutevalg og evne til � identifisere skredproblem. Generelt anbefales det � unng� terreng brattere enn 30 grader og holde avstand til utl�psomr�der. Generelt ustabile forhold. Moderat til svake bindinger i mange brattheng. Utl�sning mulig, selv ved liten tilleggsbelastning i brattheng. Fjernutl�sning mulig. Under spesielle forhold kan det forekomme noen middels store og enkelte store naturlig utl�ste skred.",

                    "AvalancheWarningTitle-4": "Stor",
                    "AvalancheWarningDescription-4": "Ferdsel i skredterreng anbefales ikke. Skred som l�sner av seg selv forventes. Unng� l�sne- og utl�psomr�der. Omfattende ustabile forhold. Svake bindinger i de fleste brattheng. Utl�sning sannsynlig selv ved liten tilleggsbelastning i mange brattheng. Fjernutl�sning sannsynlig. Under spesielle forhold forventes det mange middels store og noen store naturlig utl�ste skred.",

                    "AvalancheWarningTitle-5": "Meget stor",
                    "AvalancheWarningDescription-5": "Ferdsel i skredterreng frar�des! Ekstremt ustabile forhold. Generelt svake bindinger og sv�rt ustabilt. Mange store, ogs� sv�rt store, naturlig utl�ste skred forventes, selv i moderat bratt terreng. Fjernutl�sning meget sannsynlig."

                },
                general: {
                    "loading...": "Laster...",

                    "avalanche tab title": "Sn�skred",
                    "flood tab title": "Flom",
                    "landslide tab title": "Jordskred",
                    "favorites tab title": "Favoritter",

                    "overview view title": "Oversikt",
                    "favorites view title": "Favoritter",

                    "map view": "I kart",
                    "table view": "Som liste",

                    "favorites header for warningType 1": "Flom",
                    "favorites header for warningType 2": "Jordskred",
                    "favorites header for warningType 3": "Sn�skred",

                    "published": "Publisert: %@",
                    "next warning": "Neste varsel f�r: %@",

                    "no main text": "Ingen oppsummering",

                    "warning text back button title": "Varsel",

                    "empty favorites table": "Dine stjernede favorittomr�der vil dukke opp i denne listen.",

                    "empty avalanche warnings table": "Kom tilbake etter 1. desember",
                    "empty flood warnings table": "Ingen flomvarsel for i dag eller de neste to dagene",
                    "empty landslide warnings table": "Ingen jordskredvarsel for i dag eller de neste to dagene",

// PUSH WARNINGS

                    "AvalancheWarning problem changed": "%@ - sn�skred: Endring i det viktigste sn�skredproblemet.",
                    "AvalancheWarning forecast changed": "%@ - sn�skred: H�yeste varslingsniv� endret fra %@ til %@ for de neste tre dagene.",
                    "FloodWarning forecast changed": "%@ - flom: H�yeste varslingsniv� endret fra %@ til %@ for de neste tre dagene.",
                    "LandSlideWarning forecast changed": "%@ - jordskred: H�yeste varslingsniv� endret fra %@ til %@ for de neste tre dagene.",
                    "FloodWarning MicroBlogPosts have changed": "%@ - flom: Ny varslingsoppdatering.",
                    "LandSlideWarning MicroBlogPosts have changed": "%@ - jordskred: Ny varslingsoppdatering.",

// AVALANCHE

                    "regobs link": "G� til regionen p� regobs.no",

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
                    "AvalCause-20": "Sn�dekket er gjennomfuktet og ustabilt fra bakken.",
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
                    "AvalancheExposition-1": "N�",
                    "AvalancheExposition-2": "�",
                    "AvalancheExposition-3": "S�",
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
                    "AvalancheExt-10": "T�rre l�ssn�skred",
                    "AvalancheExt-15": "V�te l�ssn�skred",
                    "AvalancheExt-20": "T�rre flakskred",
                    "AvalancheExt-25": "V�te flakskred",
                    "AvalancheExt-30": "S�rpeskred",
                    "AvalancheExt-40": "Skavl",

// LANDSLIDE AND FLOOD

                    "CauseName-0": "Ikke gitt",
                    "CauseName-1": "Regn",
                    "CauseName-2": "Intens regn (bygenedb�r)",
                    "CauseName-3": "Sn�smelting",
                    "CauseName-4": "Isgang",
                    "CauseName-5": "Frost og is",
                    "CauseName-6": "Vannmetning (i jord)",
                    "CauseName-7": "Dambrudd/j�kulhlaup",

                    "LandslideTypeName-0": "Ikke gitt",
                    "LandslideTypeName-1": "Utgliding",
                    "LandslideTypeName-2": "Jordskred",
                    "LandslideTypeName-3": "Flomskred",
                    "LandslideTypeName-4": "S�rpeskred"
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
                    "avalanche facebook comment": "Search for \"Sn�skredvarslingen i Norge\"",
                    "avalanche school": "The avalanche school",
                    "avalanche school comment": "@ varsom.no (in norwegian only)",

                    "call": "Call now",
                    "open": "Open",

                    "FloodWarningDescription-0": "Ikke vurdert",

                    "FloodWarningDescription-1": "Generelt trygge forhold/ingen spesiell fare.",

                    "FloodWarningDescription-2": "Raskt �kende vannf�ring som kan medf�re lokale oversv�mmelser. Spesielt stor vannf�ring/vannstand for �rstiden, fare for isgang etc. Det kan forekomme store problemer/flomskader lokalt. Vannf�ring opp til 5 �rs gjentaksintervall.",

                    "FloodWarningDescription-3": "Vannf�ring som kan medf�re omfattende oversv�mmelser og flomskader p� utsatte steder. Vannf�ring mellom 5 og 50 �rs gjentaksintervall.",

                    "FloodWarningDescription-4": "Vannf�ring som kan medf�re omfattende oversv�mmelser og flomskader p� bebyggelse og infrastruktur over store omr�der. Vannf�ring med mer enn 50 �rs gjentaksintervall.",

                    "LandslideWarningDescription-0": "Ikke vurdert.",

                    "LandslideWarningDescription-1": "Generelt trygge forhold. Ingen spesielle forholdsregler er n�dvendig.",

                    "LandslideWarningDescription-2": "Det ventes noen jordskred og/eller s�rpeskred. Enkelte store hendelser kan forekomme. V�r oppmerksom i utsatte omr�der (oftest bratt terreng og langs bekker og elvel�p). Hold deg oppdatert om utviklingen av v�ret og den hydrologiske situasjonen. Forebyggende tiltak, som rensing av dreneringsveier i spesielt utsatte omr�der, anbefales.",

                    "LandslideWarningDescription-3": "Det ventes flere store og sm� jordskred og/eller s�rpeskred. V�r oppmerksom og f�lg oppfordringer fra myndighetene. Forebyggende tiltak som rensing av dreneringsveier b�r utf�res.",

                    "LandslideWarningDescription-4": "Det ventes mange store jordskred og/eller s�rpeskred. F�lg med i media, og f�lg oppfordringer og r�d fra myndighetene. Sikkerhetstiltak som vegstenging og evakuering kan skje p� kort varsel.",

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