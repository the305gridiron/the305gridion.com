export const DEFAULT_ROSTER = [
    // QB
    { name: "Malik Willis", number: "2", position: "QB", depthPosition: "QB", height: "6-1", weight: 225, age: 27, exp: "5", college: "Liberty", group: "offense" },
    { name: "Quinn Ewers", number: "14", position: "QB", depthPosition: "QB", height: "6-2", weight: 209, age: 23, exp: "2", college: "Texas", group: "offense" },
    { name: "Cam Miller", number: "15", position: "QB", depthPosition: "QB", height: "6-1", weight: 211, age: 25, exp: "1", college: "North Dakota State", group: "offense" },
    { name: "Mark Gronowski", number: "16", position: "QB", depthPosition: "QB", height: "6-2", weight: 226, age: 24, exp: "R", college: "Iowa", group: "offense" },

    // RB
    { name: "De'Von Achane", number: "28", position: "RB", depthPosition: "RB", height: "5-9", weight: 191, age: 24, exp: "4", college: "Texas A&M", group: "offense" },
    { name: "Ollie Gordon II", number: "0", position: "RB", depthPosition: "RB", height: "6-2", weight: 225, age: 22, exp: "2", college: "Oklahoma State", group: "offense" },
    { name: "Jaylen Wright", number: "5", position: "RB", depthPosition: "RB", height: "5-10", weight: 208, age: 23, exp: "3", college: "Tennessee", group: "offense" },
    { name: "Donovan Edwards", number: "36", position: "RB", depthPosition: "RB", height: "6-1", weight: 212, age: 23, exp: "1", college: "Michigan", group: "offense" },
    { name: "Carlos Washington Jr.", number: "37", position: "RB", depthPosition: "RB", height: "5-11", weight: 210, age: null, exp: "R", college: "Southeastern Louisiana", group: "offense" },
    { name: "Anthony Hankerson", number: "30", position: "RB", depthPosition: "RB", height: "5-8", weight: 204, age: 22, exp: "R", college: "Oregon State", group: "offense" },
    { name: "DJ Herman", number: "34", position: "FB", depthPosition: "FB", height: "6-1", weight: 235, age: 24, exp: "R", college: "San Diego State", group: "offense" },

    // WR
    { name: "Jalen Tolbert", number: "1", position: "WR", depthPosition: "LWR", height: "6-1", weight: 195, age: 27, exp: "5", college: "South Alabama", group: "offense" },
    { name: "Tutu Atwell", number: "4", position: "WR", depthPosition: "RWR", height: "5-9", weight: 165, age: 26, exp: "6", college: "Louisville", group: "offense" },
    { name: "Malik Washington", number: "6", position: "WR", depthPosition: "SWR", height: "5-8", weight: 195, age: 25, exp: "3", college: "Virginia", group: "offense" },
    { name: "Chris Bell", number: "18", position: "WR", depthPosition: "LWR", height: "6-2", weight: 220, age: 22, exp: "R", college: "Louisville", group: "offense" },
    { name: "Caleb Douglas", number: "7", position: "WR", depthPosition: "RWR", height: "6-4", weight: 205, age: 22, exp: "R", college: "Texas Tech", group: "offense" },
    { name: "Kevin Coleman Jr.", number: "83", position: "WR", depthPosition: "SWR", height: "5-10", weight: 180, age: 22, exp: "R", college: "Missouri", group: "offense" },
    { name: "Terrace Marshall Jr.", number: "86", position: "WR", depthPosition: "LWR", height: "6-2", weight: 200, age: 26, exp: "5", college: "LSU", group: "offense" },
    { name: "Theo Wease Jr.", number: "81", position: "WR", depthPosition: "RWR", height: "6-2", weight: 210, age: 25, exp: "1", college: "Missouri", group: "offense" },
    { name: "Tahj Washington", number: "84", position: "WR", depthPosition: "SWR", height: "5-10", weight: 174, age: 25, exp: "3", college: "USC", group: "offense" },
    { name: "Donaven McCulley", number: "80", position: "WR", depthPosition: "LWR", height: "6-4", weight: 203, age: 23, exp: "R", college: "Michigan", group: "offense" },
    { name: "Jalen Reagor", number: "17", position: "WR", depthPosition: "RWR", height: "5-11", weight: 197, age: 27, exp: "6", college: "TCU", group: "offense" },
    { name: "AJ Henning", number: "88", position: "WR", depthPosition: "SWR", height: "5-10", weight: 192, age: 24, exp: "1", college: "Northwestern", group: "offense" },

    // TE
    { name: "Greg Dulcich", number: "85", position: "TE", depthPosition: "TE", height: "6-4", weight: 245, age: 26, exp: "5", college: "UCLA", group: "offense" },
    { name: "Ben Sims", number: "89", position: "TE", depthPosition: "TE", height: "6-5", weight: 250, age: 26, exp: "4", college: "Baylor", group: "offense" },
    { name: "Will Kacmarek", number: "82", position: "TE", depthPosition: "TE", height: "6-6", weight: 258, age: 23, exp: "R", college: "Ohio State", group: "offense" },
    { name: "Seydou Traore", number: "49", position: "TE", depthPosition: "TE", height: "6-4", weight: 235, age: 23, exp: "R", college: "Mississippi State", group: "offense" },
    { name: "Cole Turner", number: "87", position: "TE", depthPosition: "TE", height: "6-6", weight: 240, age: 26, exp: "3", college: "Nevada", group: "offense" },

    // OL
    { name: "Patrick Paul", number: "52", position: "T", depthPosition: "LT", height: "6-7", weight: 326, age: 24, exp: "3", college: "Houston", group: "offense" },
    { name: "Kadyn Proctor", number: "74", position: "G/T", depthPosition: "LG", height: "6-7", weight: 352, age: 21, exp: "R", college: "Alabama", group: "offense" },
    { name: "Aaron Brewer", number: "55", position: "C", depthPosition: "C", height: "6-1", weight: 295, age: 28, exp: "7", college: "Texas State", group: "offense" },
    { name: "Jonah Savaiinaea", number: "71", position: "G", depthPosition: "RG", height: "6-5", weight: 326, age: 22, exp: "2", college: "Arizona", group: "offense" },
    { name: "Austin Jackson", number: "73", position: "T", depthPosition: "RT", height: "6-5", weight: 310, age: 26, exp: "7", college: "USC", group: "offense" },
    { name: "Jamaree Salyer", number: "69", position: "G/T", depthPosition: "LT", height: "6-4", weight: 325, age: 25, exp: "5", college: "Georgia", group: "offense" },
    { name: "Josh Priebe", number: "68", position: "G/T", depthPosition: "LG", height: "6-5", weight: 306, age: 24, exp: "1", college: "Michigan", group: "offense" },
    { name: "Andrew Meyer", number: "60", position: "C", depthPosition: "C", height: "6-3", weight: 295, age: 26, exp: "3", college: "Texas-El Paso", group: "offense" },
    { name: "DJ Campbell", number: "63", position: "G", depthPosition: "RG", height: "6-3", weight: 321, age: 22, exp: "R", college: "Texas", group: "offense" },
    { name: "Charlie Heck", number: "67", position: "T", depthPosition: "RT", height: "6-8", weight: 311, age: 29, exp: "7", college: "North Carolina", group: "offense" },
    { name: "Marques Cox", number: "70", position: "T", depthPosition: "LT", height: "6-5", weight: 312, age: 26, exp: "1", college: "Kentucky", group: "offense" },
    { name: "Jim Bonifas", number: "62", position: "C", depthPosition: "C", height: "6-5", weight: 318, age: null, exp: "R", college: "Iowa State", group: "offense" },
    { name: "Kevin Cline", number: "79", position: "T", depthPosition: "RT", height: "6-6", weight: 316, age: 25, exp: "R", college: "Boston College", group: "offense" },
    { name: "Gottlieb Ayedze", number: "72", position: "T", depthPosition: "RT", height: "6-4", weight: 309, age: 26, exp: "1", college: "Maryland", group: "offense" },
    { name: "Kion Smith", number: "71", position: "G/T", depthPosition: "RT", height: "6-5", weight: 300, age: null, exp: "5", college: "Fayetteville State University", group: "offense" },
    { name: "James Ester", number: "65", position: "DL", depthPosition: "RDT", height: "6-3", weight: 289, age: 24, exp: "1", college: "Northern Illinois", group: "defense" },

    // DL
    { name: "Kenneth Grant", number: "78", position: "DL", depthPosition: "LDT", height: "6-3", weight: 335, age: 22, exp: "2", college: "Michigan", group: "defense" },
    { name: "Zach Sieler", number: "92", position: "DL", depthPosition: "RDT", height: "6-6", weight: 300, age: 30, exp: "9", college: "Ferris State", group: "defense" },
    { name: "Jordan Phillips", number: "94", position: "DL", depthPosition: "LDT", height: "6-3", weight: 305, age: 22, exp: "2", college: "Maryland", group: "defense" },
    { name: "Zeek Biggers", number: "93", position: "DL", depthPosition: "RDT", height: "6-6", weight: 319, age: 22, exp: "2", college: "Georgia Tech", group: "defense" },
    { name: "Rene Konga", number: "95", position: "DL", depthPosition: "LDT", height: "6-3", weight: 298, age: 23, exp: "R", college: "Louisville", group: "defense" },
    { name: "Matthew Butler", number: "91", position: "DL", depthPosition: "RDT", height: "6-3", weight: 305, age: 27, exp: "4", college: "Tennessee", group: "defense" },
    { name: "Alex Huntley", number: "96", position: "DL", depthPosition: "LDT", height: "6-4", weight: 298, age: 24, exp: "1", college: "South Carolina", group: "defense" },
    { name: "Keith Cooper Jr.", number: "97", position: "DL", depthPosition: "LDT", height: "6-5", weight: 280, age: 23, exp: "1", college: "Houston", group: "defense" },
    { name: "Kahlil Saunders", number: "98", position: "DL", depthPosition: "RDT", height: "6-4", weight: 287, age: 23, exp: "R", college: "Kentucky", group: "defense" },

    // EDGE
    { name: "Chop Robinson", number: "44", position: "EDGE", depthPosition: "LDE", height: "6-3", weight: 254, age: 23, exp: "3", college: "Penn State", group: "defense" },
    { name: "Josh Uche", number: "9", position: "EDGE", depthPosition: "RDE", height: "6-3", weight: 226, age: 27, exp: "7", college: "Michigan", group: "defense" },
    { name: "David Ojabo", number: "50", position: "EDGE", depthPosition: "LDE", height: "6-4", weight: 252, age: 26, exp: "5", college: "Michigan", group: "defense" },
    { name: "Trey Moore", number: "17", position: "EDGE/ILB", depthPosition: "RDE", height: "6-2", weight: 243, age: 23, exp: "R", college: "Texas", group: "defense" },
    { name: "Robert Beal Jr.", number: "51", position: "EDGE", depthPosition: "LDE", height: "6-4", weight: 250, age: 26, exp: "4", college: "Georgia", group: "defense" },
    { name: "Cameron Goode", number: "53", position: "EDGE", depthPosition: "RDE", height: "6-3", weight: 245, age: 28, exp: "4", college: "California", group: "defense" },
    { name: "Mason Reiger", number: "90", position: "EDGE", depthPosition: "LDE", height: "6-4", weight: 251, age: 23, exp: "R", college: "Wisconsin", group: "defense" },
    { name: "Max Llewellyn", number: "57", position: "EDGE", depthPosition: "RDE", height: "6-5", weight: 263, age: 23, exp: "R", college: "Iowa", group: "defense" },
    { name: "Seth Coleman", number: "58", position: "EDGE", depthPosition: "LDE", height: "6-3", weight: 246, age: 25, exp: "1", college: "Illinois", group: "defense" },
    { name: "Rodney McGraw", number: "59", position: "EDGE", depthPosition: "RDE", height: "6-4", weight: 264, age: 24, exp: "R", college: "Western Michigan", group: "defense" },

    // ILB
    { name: "Tyrel Dodson", number: "25", position: "ILB", depthPosition: "WLB", height: "6-0", weight: 237, age: 28, exp: "7", college: "Texas A&M", group: "defense" },
    { name: "Jordyn Brooks", number: "20", position: "ILB", depthPosition: "MLB", height: "6-0", weight: 240, age: 28, exp: "7", college: "Texas Tech", group: "defense" },
    { name: "Kyle Louis", number: "19", position: "ILB", depthPosition: "WLB", height: "6-0", weight: 220, age: 22, exp: "R", college: "Pittsburgh", group: "defense" },
    { name: "Jacob Rodriguez", number: "10", position: "ILB", depthPosition: "MLB", height: "6-1", weight: 235, age: 23, exp: "R", college: "Texas Tech", group: "defense" },
    { name: "Ronnie Harrison Jr.", number: "56", position: "ILB", depthPosition: "WLB", height: "6-2", weight: 207, age: 29, exp: "9", college: "Alabama", group: "defense" },
    { name: "Willie Gay Jr.", number: "40", position: "ILB", depthPosition: "MLB", height: "6-1", weight: 246, age: 28, exp: "7", college: "Mississippi State", group: "defense" },
    { name: "Jackson Woodard", number: "42", position: "ILB", depthPosition: "MLB", height: "6-2", weight: 230, age: 24, exp: "1", college: "UNLV", group: "defense" },

    // CB
    { name: "Chris Johnson", number: "3", position: "CB", depthPosition: "LCB", height: "6-0", weight: 193, age: 21, exp: "R", college: "San Diego State", group: "defense" },
    { name: "JuJu Brents", number: "8", position: "CB", depthPosition: "RCB", height: "6-3", weight: 198, age: 26, exp: "4", college: "Kansas State", group: "defense" },
    { name: "Jason Marshall Jr.", number: "33", position: "CB", depthPosition: "NB", height: "6-0", weight: 204, age: 23, exp: "2", college: "Florida", group: "defense" },
    { name: "Darrell Baker Jr.", number: "22", position: "CB", depthPosition: "LCB", height: "6-1", weight: 190, age: 28, exp: "4", college: "Georgia Southern", group: "defense" },
    { name: "Alex Austin", number: "26", position: "CB", depthPosition: "RCB", height: "6-1", weight: 191, age: 25, exp: "4", college: "Oregon State", group: "defense" },
    { name: "Ethan Robinson", number: "38", position: "CB", depthPosition: "NB", height: "6-0", weight: 195, age: 23, exp: "1", college: "Minnesota", group: "defense" },
    { name: "Ethan Bonner", number: "27", position: "CB", depthPosition: "LCB", height: "6-1", weight: 190, age: 26, exp: "3", college: "Stanford", group: "defense" },
    { name: "Storm Duck", number: "29", position: "CB", depthPosition: "RCB", height: "6-0", weight: 195, age: 25, exp: "3", college: "Louisville", group: "defense" },
    { name: "Marco Wilson", number: "21", position: "CB", depthPosition: "LCB", height: "5-11", weight: 191, age: 27, exp: "6", college: "Florida", group: "defense" },
    { name: "A.J. Green III", number: "24", position: "CB", depthPosition: "RCB", height: "6-2", weight: 198, age: 28, exp: "4", college: "Oklahoma State", group: "defense" },
    { name: "Miles Battle", number: "35", position: "CB", depthPosition: "LCB", height: "6-3", weight: 197, age: 26, exp: "1", college: "Utah", group: "defense" },

    // S
    { name: "Dante Trader Jr.", number: "11", position: "S", depthPosition: "SS", height: "5-11", weight: 202, age: 23, exp: "2", college: "Maryland", group: "defense" },
    { name: "Lonnie Johnson Jr.", number: "32", position: "S", depthPosition: "FS", height: "6-2", weight: 221, age: 30, exp: "8", college: "Kentucky", group: "defense" },
    { name: "Zayne Anderson", number: "23", position: "S", depthPosition: "SS", height: "6-2", weight: 206, age: 29, exp: "4", college: "BYU", group: "defense" },
    { name: "Michael Taaffe", number: "31", position: "S", depthPosition: "FS", height: "6-0", weight: 190, age: 23, exp: "R", college: "Texas", group: "defense" },
    { name: "Omar Brown", number: "34", position: "DB", depthPosition: "SS", height: "6-1", weight: 205, age: 25, exp: "1", college: "Nebraska", group: "defense" },
    { name: "Louis Moore", number: "41", position: "S", depthPosition: "FS", height: "5-11", weight: 190, age: 25, exp: "R", college: "Indiana", group: "defense" },
    { name: "Major Burns", number: "43", position: "S", depthPosition: "FS", height: "6-2", weight: 207, age: 24, exp: "1", college: "LSU", group: "defense" },

    // ST
    { name: "Zane Gonzalez", number: "45", position: "K", depthPosition: "PK", height: "6-0", weight: 202, age: 31, exp: "9", college: "Arizona State", group: "special" },
    { name: "Riley Patterson", number: "47", position: "K", depthPosition: "PK", height: "6-0", weight: 190, age: 26, exp: "6", college: "Memphis", group: "special" },
    { name: "Bradley Pinion", number: "48", position: "P", depthPosition: "PT", height: "6-5", weight: 265, age: 32, exp: "12", college: "Clemson", group: "special" },
    { name: "Tucker Addington", number: "46", position: "LS", depthPosition: "LS", height: "6-2", weight: 230, age: 28, exp: "2", college: "Sam Houston State", group: "special" }
];
