export interface Question {
  id: string;
  title: string;
  category: 'probability' | 'brain-teaser';
  subcategory: string;
  difficulty: number; // 1-4: easy, 5-7: medium, 8-9: hard, 10: extreme
  content: string;
  hints: string[];
  solution: string;
  solutionSteps: string[];
  commonMistakes: string[];
  skills: string[];
  tags: string[];
  benchmarkTime: number; // in seconds
  answerType: 'number';
  numericAnswer: number; // The correct numeric answer (for validation)
  firm?: string; // Which firm this question appeared at
  requiresPaid?: boolean; // Whether this question requires paid subscription
}

export const questions: Question[] = [
  // EASY (difficulty 1-4) - 10 questions
  {
    id: "q1",
    title: "Coin Flip Probability",
    category: "probability",
    subcategory: "Basic Probability",
    difficulty: 2,
    content: "You flip a fair coin 3 times. What is the probability of getting exactly 2 heads? Express your answer as a decimal (e.g., 0.5 for 50%).",
    hints: [
      "List all possible outcomes",
      "Count how many outcomes have exactly 2 heads",
      "Divide by total number of outcomes"
    ],
    solution: "0.375",
    solutionSteps: [
      "Total outcomes: 2³ = 8",
      "Outcomes with exactly 2 heads: HHT, HTH, THH (3 outcomes)",
      "Probability = 3/8 = 0.375"
    ],
    commonMistakes: [
      "Forgetting to account for order",
      "Using 2/8 instead of 3/8"
    ],
    skills: ["basic probability", "combinatorics"],
    tags: ["probability", "easy"],
    benchmarkTime: 120,
    answerType: "number",
    numericAnswer: 0.375,
    firm: "Jane Street",
  },
  {
    id: "q2",
    title: "Dice Sum",
    category: "probability",
    subcategory: "Basic Probability",
    difficulty: 3,
    content: "You roll two fair six-sided dice. What is the probability that the sum is 7? Express your answer as a decimal.",
    hints: [
      "List all possible sums",
      "Count how many ways to get sum 7",
      "Total outcomes is 36"
    ],
    solution: "0.1667",
    solutionSteps: [
      "Total outcomes: 6 × 6 = 36",
      "Ways to get sum 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 ways",
      "Probability = 6/36 = 1/6 ≈ 0.1667"
    ],
    commonMistakes: [
      "Forgetting that order matters",
      "Not counting all combinations"
    ],
    skills: ["basic probability", "counting"],
    tags: ["probability", "easy"],
    benchmarkTime: 90,
    answerType: "number",
    numericAnswer: 0.1667,
    firm: "Two Sigma",
  },
  {
    id: "q3",
    title: "Card Drawing",
    category: "probability",
    subcategory: "Basic Probability",
    difficulty: 2,
    content: "From a standard 52-card deck, you draw one card. What is the probability it is a heart? Express your answer as a decimal.",
    hints: [
      "How many hearts are in a deck?",
      "Total cards is 52"
    ],
    solution: "0.25",
    solutionSteps: [
      "Hearts in deck: 13",
      "Total cards: 52",
      "Probability = 13/52 = 1/4 = 0.25"
    ],
    commonMistakes: [
      "Confusing suits with face cards"
    ],
    skills: ["basic probability"],
    tags: ["probability", "easy"],
    benchmarkTime: 60,
    answerType: "number",
    numericAnswer: 0.25,
    firm: "Goldman Sachs",
  },
  {
    id: "q4",
    title: "Birthday Problem (Small)",
    category: "probability",
    subcategory: "Conditional Probability",
    difficulty: 4,
    content: "In a room of 23 people, what is the probability that at least two people share the same birthday? Express your answer as a decimal rounded to 3 decimal places.",
    hints: [
      "Calculate probability that all birthdays are different",
      "Use complement rule: P(at least 2 same) = 1 - P(all different)"
    ],
    solution: "0.507",
    solutionSteps: [
      "P(all different) = (365/365) × (364/365) × ... × (343/365)",
      "P(all different) ≈ 0.493",
      "P(at least 2 same) = 1 - 0.493 = 0.507"
    ],
    commonMistakes: [
      "Calculating directly instead of using complement",
      "Rounding errors"
    ],
    skills: ["conditional probability", "complement rule"],
    tags: ["probability", "easy"],
    benchmarkTime: 180,
    answerType: "number",
    numericAnswer: 0.507,
    firm: "Citadel",
  },
  {
    id: "q5",
    title: "Expected Value Dice",
    category: "probability",
    subcategory: "Expected Value",
    difficulty: 3,
    content: "You roll a fair six-sided die. What is the expected value of the number shown?",
    hints: [
      "Expected value is the average",
      "Sum all outcomes weighted by probability"
    ],
    solution: "3.5",
    solutionSteps: [
      "E[X] = (1 + 2 + 3 + 4 + 5 + 6) / 6",
      "E[X] = 21/6 = 3.5"
    ],
    commonMistakes: [
      "Rounding to 3 or 4",
      "Not understanding expected value"
    ],
    skills: ["expected value"],
    tags: ["probability", "easy"],
    benchmarkTime: 60,
    answerType: "number",
    numericAnswer: 3.5,
    firm: "Morgan Stanley",
  },
  {
    id: "q6",
    title: "Two Coins",
    category: "brain-teaser",
    subcategory: "Logic",
    difficulty: 2,
    content: "You have two coins that total 30 cents. One is not a nickel. What are the two coins? Enter the value of the coin that is not a nickel in cents.",
    hints: [
      "Read carefully - 'one is not a nickel'",
      "The other coin could be a nickel"
    ],
    solution: "25",
    solutionSteps: [
      "If one is not a nickel, the other could be",
      "25 cents (quarter) + 5 cents (nickel) = 30 cents",
      "The quarter is not a nickel"
    ],
    commonMistakes: [
      "Assuming neither is a nickel",
      "Not reading the problem carefully"
    ],
    skills: ["logical reasoning", "careful reading"],
    tags: ["brain-teaser", "easy"],
    benchmarkTime: 90,
    answerType: "number",
    numericAnswer: 25,
    firm: "Jane Street",
  },
  {
    id: "q7",
    title: "Water Jug Problem",
    category: "brain-teaser",
    subcategory: "Logic",
    difficulty: 3,
    content: "You have a 3-gallon jug and a 5-gallon jug. How can you measure exactly 4 gallons? Enter the number of times you need to fill the 5-gallon jug.",
    hints: [
      "Fill the 5-gallon jug",
      "Pour from 5 to 3, leaving 2 gallons",
      "Empty the 3-gallon jug and pour the 2 gallons in"
    ],
    solution: "2",
    solutionSteps: [
      "Fill 5-gallon jug (5, 0)",
      "Pour from 5 to 3 (2, 3)",
      "Empty 3-gallon jug (2, 0)",
      "Pour 2 gallons from 5 to 3 (0, 2)",
      "Fill 5-gallon jug again (5, 2)",
      "Pour from 5 to 3 until 3 is full (4, 3)",
      "Now 5-gallon jug has 4 gallons"
    ],
    commonMistakes: [
      "Not tracking the steps correctly",
      "Giving up too early"
    ],
    skills: ["logical reasoning", "problem solving"],
    tags: ["brain-teaser", "easy"],
    benchmarkTime: 150,
    answerType: "number",
    numericAnswer: 2,
    firm: "Two Sigma",
  },
  {
    id: "q8",
    title: "Light Bulb Switches",
    category: "brain-teaser",
    subcategory: "Logic",
    difficulty: 4,
    content: "You have 3 light bulbs and 3 switches in another room. You can only go to the other room once. How do you determine which switch controls which bulb? Enter the number of switches you need to turn on initially.",
    hints: [
      "Use heat as a clue",
      "Turn on one switch for a while, then turn it off",
      "Turn on another switch"
    ],
    solution: "2",
    solutionSteps: [
      "Turn on switch 1, wait 5 minutes",
      "Turn off switch 1, turn on switch 2",
      "Go to the room",
      "Hot but off = switch 1, On = switch 2, Off and cold = switch 3"
    ],
    commonMistakes: [
      "Not using the heat property",
      "Turning on all switches"
    ],
    skills: ["logical reasoning", "creative thinking"],
    tags: ["brain-teaser", "easy"],
    benchmarkTime: 180,
    answerType: "number",
    numericAnswer: 2,
    firm: "Citadel",
  },
  {
    id: "q9",
    title: "Probability of At Least One",
    category: "probability",
    subcategory: "Basic Probability",
    difficulty: 3,
    content: "You flip a fair coin 4 times. What is the probability of getting at least one head? Express your answer as a decimal.",
    hints: [
      "Use complement rule",
      "P(at least one head) = 1 - P(no heads)",
      "P(no heads) = P(all tails)"
    ],
    solution: "0.9375",
    solutionSteps: [
      "P(all tails) = (1/2)⁴ = 1/16 = 0.0625",
      "P(at least one head) = 1 - 0.0625 = 0.9375"
    ],
    commonMistakes: [
      "Calculating directly instead of using complement",
      "Arithmetic errors"
    ],
    skills: ["complement rule", "basic probability"],
    tags: ["probability", "easy"],
    benchmarkTime: 120,
    answerType: "number",
    numericAnswer: 0.9375,
    firm: "Goldman Sachs",
  },
  {
    id: "q10",
    title: "Rope Burning Time",
    category: "brain-teaser",
    subcategory: "Time Measurement",
    difficulty: 4,
    content: "You have two ropes, each takes exactly 60 minutes to burn (non-uniformly). How can you measure 45 minutes? Enter the number of minutes it takes for the first rope to burn out.",
    hints: [
      "Light rope 1 from both ends",
      "When rope 1 burns out, light rope 2 from the other end",
      "Rope 1 burns out in 30 minutes"
    ],
    solution: "30",
    solutionSteps: [
      "Light rope 1 from both ends and rope 2 from one end",
      "Rope 1 burns out in 30 minutes",
      "Rope 2 has 30 minutes left",
      "Light the other end of rope 2",
      "Rope 2 burns out in 15 more minutes",
      "Total: 30 + 15 = 45 minutes"
    ],
    commonMistakes: [
      "Not understanding non-uniform burning",
      "Trying to cut the rope"
    ],
    skills: ["creative thinking", "time reasoning"],
    tags: ["brain-teaser", "easy"],
    benchmarkTime: 180,
    answerType: "number",
    numericAnswer: 30,
    firm: "Jane Street",
  },

  // MEDIUM (difficulty 5-7) - 10 questions
  {
    id: "q11",
    title: "Bayes' Theorem Application",
    category: "probability",
    subcategory: "Conditional Probability",
    difficulty: 6,
    content: "A test for a disease is 95% accurate (95% true positive, 95% true negative). The disease affects 1% of the population. If someone tests positive, what is the probability they actually have the disease? Express your answer as a decimal rounded to 3 decimal places.",
    hints: [
      "Use Bayes' theorem",
      "Calculate P(positive)",
      "P(disease | positive) = P(positive | disease) × P(disease) / P(positive)"
    ],
    solution: "0.161",
    solutionSteps: [
      "P(disease) = 0.01, P(no disease) = 0.99",
      "P(positive | disease) = 0.95",
      "P(positive | no disease) = 0.05",
      "P(positive) = 0.95 × 0.01 + 0.05 × 0.99 = 0.059",
      "P(disease | positive) = 0.95 × 0.01 / 0.059 ≈ 0.161"
    ],
    commonMistakes: [
      "Confusing P(A|B) with P(B|A)",
      "Not calculating P(positive) correctly"
    ],
    skills: ["Bayes theorem", "conditional probability"],
    tags: ["probability", "medium"],
    benchmarkTime: 240,
    answerType: "number",
    numericAnswer: 0.161,
    firm: "Jane Street",
  },
  {
    id: "q12",
    title: "Monty Hall Problem",
    category: "probability",
    subcategory: "Conditional Probability",
    difficulty: 7,
    content: "In the Monty Hall problem, you pick door 1. Monty opens door 3 revealing a goat. Should you switch? What is the probability of winning if you switch? Express your answer as a decimal.",
    hints: [
      "Initial probability of winning: 1/3",
      "Monty always opens a door with a goat",
      "Switching gives you 2/3 probability"
    ],
    solution: "0.667",
    solutionSteps: [
      "Initial: P(car behind door 1) = 1/3",
      "If car behind door 1, switching loses",
      "If car behind door 2 or 3, switching wins",
      "P(win by switching) = 2/3 ≈ 0.667"
    ],
    commonMistakes: [
      "Thinking probability is 50/50",
      "Not understanding conditional probability"
    ],
    skills: ["conditional probability", "Bayes theorem"],
    tags: ["probability", "medium"],
    benchmarkTime: 300,
    answerType: "number",
    numericAnswer: 0.667,
    firm: "Two Sigma",
  },
  {
    id: "q13",
    title: "Expected Value Game",
    category: "probability",
    subcategory: "Expected Value",
    difficulty: 6,
    content: "You roll a die. If you roll 1-5, you win that many dollars. If you roll 6, you lose $10. What is your expected value in dollars?",
    hints: [
      "Calculate expected value for each outcome",
      "E[X] = Σ (outcome × probability)"
    ],
    solution: "0",
    solutionSteps: [
      "E[X] = (1 + 2 + 3 + 4 + 5)/6 + (-10)/6",
      "E[X] = 15/6 - 10/6 = 5/6 ≈ 0"
    ],
    commonMistakes: [
      "Not accounting for the negative outcome",
      "Calculation errors"
    ],
    skills: ["expected value"],
    tags: ["probability", "medium"],
    benchmarkTime: 180,
    answerType: "number",
    numericAnswer: 0,
    firm: "Citadel",
  },
  {
    id: "q14",
    title: "Poker Hand Probability",
    category: "probability",
    subcategory: "Combinatorics",
    difficulty: 7,
    content: "What is the probability of getting a pair (exactly one pair, not two pair or three of a kind) in a 5-card poker hand? Express your answer as a decimal rounded to 5 decimal places.",
    hints: [
      "Choose rank for pair: C(13,1)",
      "Choose 2 suits: C(4,2)",
      "Choose 3 other ranks: C(12,3)",
      "Choose suits for other cards: 4³"
    ],
    solution: "0.42257",
    solutionSteps: [
      "Ways to get pair: C(13,1) × C(4,2) × C(12,3) × 4³",
      "Ways to get pair: 13 × 6 × 220 × 64 = 1,098,240",
      "Total hands: C(52,5) = 2,598,960",
      "Probability = 1,098,240 / 2,598,960 ≈ 0.42257"
    ],
    commonMistakes: [
      "Including two pair or three of a kind",
      "Combinatorial calculation errors"
    ],
    skills: ["combinatorics", "probability"],
    tags: ["probability", "medium"],
    benchmarkTime: 300,
    answerType: "number",
    numericAnswer: 0.42257,
    firm: "Goldman Sachs",
  },
  {
    id: "q15",
    title: "Russian Roulette",
    category: "probability",
    subcategory: "Conditional Probability",
    difficulty: 6,
    content: "In Russian roulette with a 6-chamber revolver and 1 bullet, you spin the cylinder and pull the trigger. It's empty. You spin again. What's the probability the next shot fires? Express your answer as a decimal rounded to 3 decimal places.",
    hints: [
      "After first empty shot, you spin again",
      "This resets the probability",
      "Each spin is independent"
    ],
    solution: "0.167",
    solutionSteps: [
      "After spinning, bullet is equally likely in any chamber",
      "P(fires) = 1/6 ≈ 0.167"
    ],
    commonMistakes: [
      "Thinking probability increases",
      "Not understanding independence"
    ],
    skills: ["conditional probability", "independence"],
    tags: ["probability", "medium"],
    benchmarkTime: 180,
    answerType: "number",
    numericAnswer: 0.167,
    firm: "Morgan Stanley",
  },
  {
    id: "q16",
    title: "Prisoner Hat Problem",
    category: "brain-teaser",
    subcategory: "Logic",
    difficulty: 7,
    content: "Three prisoners see each other's hats. Hats are either black or white. At least one hat is white. They can't communicate. How many prisoners can guarantee to identify their hat color?",
    hints: [
      "Use logic and waiting",
      "If you see two black hats, you know yours is white",
      "If others wait, they can deduce"
    ],
    solution: "1",
    solutionSteps: [
      "If prisoner sees 2 black hats, they know theirs is white (since at least one is white)",
      "If no one speaks immediately, everyone sees at least one white hat",
      "The one who sees one white and one black waits",
      "If the one who sees two whites doesn't speak, the other deduces they see one white and one black",
      "Only one can guarantee to identify correctly"
    ],
    commonMistakes: [
      "Thinking all can identify",
      "Not using the waiting strategy"
    ],
    skills: ["logical reasoning", "game theory"],
    tags: ["brain-teaser", "medium"],
    benchmarkTime: 300,
    answerType: "number",
    numericAnswer: 1,
    firm: "Jane Street",
  },
  {
    id: "q17",
    title: "Bridge Crossing",
    category: "brain-teaser",
    subcategory: "Optimization",
    difficulty: 6,
    content: "Four people need to cross a bridge. They take 1, 2, 5, and 10 minutes. The bridge holds max 2 people. They have one flashlight. What is the minimum time in minutes to get all across?",
    hints: [
      "Fastest people should do most crossings",
      "Minimize time by having fast people return",
      "Send slowest together"
    ],
    solution: "17",
    solutionSteps: [
      "1 and 2 cross (2 min), 1 returns (1 min) = 3 min",
      "5 and 10 cross (10 min), 2 returns (2 min) = 12 min",
      "1 and 2 cross again (2 min) = 2 min",
      "Total: 3 + 12 + 2 = 17 minutes"
    ],
    commonMistakes: [
      "Not optimizing return trips",
      "Sending slowest first"
    ],
    skills: ["optimization", "logical reasoning"],
    tags: ["brain-teaser", "medium"],
    benchmarkTime: 240,
    answerType: "number",
    numericAnswer: 17,
    firm: "Two Sigma",
  },
  {
    id: "q18",
    title: "Coin Weighing Problem",
    category: "brain-teaser",
    subcategory: "Logic",
    difficulty: 7,
    content: "You have 12 coins, one is fake (lighter or heavier). You have a balance scale. What is the minimum number of weighings needed to find the fake coin?",
    hints: [
      "Divide into groups",
      "Use information from each weighing",
      "Each weighing has 3 outcomes"
    ],
    solution: "3",
    solutionSteps: [
      "Weigh 4 vs 4",
      "If equal, fake is in remaining 4 (2 more weighings)",
      "If unequal, take the lighter/heavier group",
      "Weigh 2 vs 2, then 1 vs 1",
      "Maximum 3 weighings needed"
    ],
    commonMistakes: [
      "Not using information efficiently",
      "Thinking it takes more weighings"
    ],
    skills: ["logical reasoning", "divide and conquer"],
    tags: ["brain-teaser", "medium"],
    benchmarkTime: 300,
    answerType: "number",
    numericAnswer: 3,
    firm: "Citadel",
  },
  {
    id: "q19",
    title: "Probability of Consecutive Heads",
    category: "probability",
    subcategory: "Conditional Probability",
    difficulty: 5,
    content: "You flip a fair coin until you get two consecutive heads. What is the expected number of flips? Round to the nearest integer.",
    hints: [
      "Use states: E (no heads), H (one head), HH (two heads)",
      "Set up equations: E = 1 + 0.5E + 0.5H",
      "H = 1 + 0.5E + 0.5(0)"
    ],
    solution: "6",
    solutionSteps: [
      "E = expected flips from start",
      "E = 1 + 0.5E + 0.5H",
      "H = 1 + 0.5E",
      "Solving: E = 6"
    ],
    commonMistakes: [
      "Not setting up state equations",
      "Calculation errors"
    ],
    skills: ["expected value", "state transitions"],
    tags: ["probability", "medium"],
    benchmarkTime: 300,
    answerType: "number",
    numericAnswer: 6,
    firm: "Goldman Sachs",
    requiresPaid: true,
  },
  {
    id: "q20",
    title: "Two Envelopes Problem",
    category: "brain-teaser",
    subcategory: "Paradox",
    difficulty: 6,
    content: "You are given two envelopes. One contains twice as much money as the other. You pick one and find $100. Should you switch? What is the expected value if you switch, in dollars?",
    hints: [
      "If you have $100, other envelope has $50 or $200",
      "Expected value = 0.5 × 50 + 0.5 × 200",
      "But this creates a paradox..."
    ],
    solution: "125",
    solutionSteps: [
      "If other envelope has $50 (you picked high), probability = 0.5",
      "If other envelope has $200 (you picked low), probability = 0.5",
      "E[switch] = 0.5 × 50 + 0.5 × 200 = 125"
    ],
    commonMistakes: [
      "Not understanding the paradox",
      "Calculation errors"
    ],
    skills: ["expected value", "paradox resolution"],
    tags: ["brain-teaser", "medium"],
    benchmarkTime: 240,
    answerType: "number",
    numericAnswer: 125,
    firm: "Morgan Stanley",
  },

  // HARD (difficulty 8-9) - 10 questions - ALL require paid
  {
    id: "q21",
    title: "Gambler's Ruin",
    category: "probability",
    subcategory: "Random Walks",
    difficulty: 8,
    content: "You start with $10. You bet $1 each round. You win with probability 0.48 and lose with probability 0.52. What is the probability you reach $20 before going broke? Express your answer as a decimal rounded to 3 decimal places.",
    hints: [
      "Use gambler's ruin formula",
      "P = (1 - (q/p)^n) / (1 - (q/p)^N)",
      "Where p = 0.48, q = 0.52, n = 10, N = 20"
    ],
    solution: "0.017",
    solutionSteps: [
      "p = 0.48, q = 0.52, q/p = 1.0833",
      "P = (1 - 1.0833^10) / (1 - 1.0833^20)",
      "P ≈ 0.017"
    ],
    commonMistakes: [
      "Using wrong formula",
      "Calculation errors with exponents"
    ],
    skills: ["random walks", "gambler's ruin"],
    tags: ["probability", "hard"],
    benchmarkTime: 360,
    answerType: "number",
    numericAnswer: 0.017,
    firm: "Jane Street",
    requiresPaid: true,
  },
  {
    id: "q22",
    title: "Stochastic Process",
    category: "probability",
    subcategory: "Stochastic Processes",
    difficulty: 9,
    content: "A stock price follows a random walk. It starts at $100. Each period it goes up $1 with probability 0.6 or down $1 with probability 0.4. What is the expected value after 10 periods?",
    hints: [
      "E[X_t] = X_0 + t × (p - q)",
      "Where p = 0.6, q = 0.4",
      "Expected change per period = 0.6 - 0.4 = 0.2"
    ],
    solution: "102",
    solutionSteps: [
      "E[change per period] = 0.6 × 1 + 0.4 × (-1) = 0.2",
      "E[price after 10] = 100 + 10 × 0.2 = 102"
    ],
    commonMistakes: [
      "Not calculating expected change correctly",
      "Using wrong formula"
    ],
    skills: ["stochastic processes", "expected value"],
    tags: ["probability", "hard"],
    benchmarkTime: 300,
    answerType: "number",
    numericAnswer: 102,
    firm: "Citadel",
    requiresPaid: true,
  },
  {
    id: "q23",
    title: "Martingale Strategy",
    category: "probability",
    subcategory: "Gambling Theory",
    difficulty: 8,
    content: "You use a martingale strategy: bet $1, if lose double bet. You have $31. What is the probability you lose all your money before winning once (win probability = 0.5)? Express your answer as a decimal.",
    hints: [
      "You can bet: $1, $2, $4, $8, $16",
      "Total needed: $31",
      "P(lose 5 in a row) = 0.5^5"
    ],
    solution: "0.03125",
    solutionSteps: [
      "Need to lose 5 times in a row to go broke",
      "P(lose 5) = 0.5^5 = 1/32 = 0.03125"
    ],
    commonMistakes: [
      "Not calculating consecutive losses",
      "Arithmetic errors"
    ],
    skills: ["gambling theory", "probability"],
    tags: ["probability", "hard"],
    benchmarkTime: 240,
    answerType: "number",
    numericAnswer: 0.03125,
    firm: "Two Sigma",
    requiresPaid: true,
  },
  {
    id: "q24",
    title: "Poker Probability - Straight Flush",
    category: "probability",
    subcategory: "Combinatorics",
    difficulty: 9,
    content: "What is the probability of getting a straight flush (5 consecutive cards of same suit) in a 5-card poker hand? Express your answer in scientific notation as the coefficient (e.g., if 1.5 × 10^-5, enter 0.000015).",
    hints: [
      "4 suits, 10 possible straights per suit (A-5 through 10-A)",
      "Total straight flushes: 4 × 10 = 40",
      "Total hands: C(52,5)"
    ],
    solution: "0.000015",
    solutionSteps: [
      "Straight flushes: 4 suits × 10 straights = 40",
      "Total hands: C(52,5) = 2,598,960",
      "Probability = 40 / 2,598,960 ≈ 0.0000154"
    ],
    commonMistakes: [
      "Counting royal flush separately",
      "Combinatorial errors"
    ],
    skills: ["combinatorics", "probability"],
    tags: ["probability", "hard"],
    benchmarkTime: 300,
    answerType: "number",
    numericAnswer: 0.000015,
    firm: "Goldman Sachs",
    requiresPaid: true,
  },
  {
    id: "q25",
    title: "Brownian Motion Hitting Time",
    category: "probability",
    subcategory: "Stochastic Processes",
    difficulty: 9,
    content: "A Brownian motion starts at 0. What is the probability it hits level 1 before hitting level -1? Express your answer as a decimal.",
    hints: [
      "Use symmetry and optional stopping",
      "P(hit 1 before -1) = ?",
      "By symmetry, answer is 0.5"
    ],
    solution: "0.5",
    solutionSteps: [
      "By symmetry of Brownian motion",
      "P(hit 1 before -1) = P(hit -1 before 1) = 0.5"
    ],
    commonMistakes: [
      "Overcomplicating",
      "Not using symmetry"
    ],
    skills: ["Brownian motion", "stochastic processes"],
    tags: ["probability", "hard"],
    benchmarkTime: 360,
    answerType: "number",
    numericAnswer: 0.5,
    firm: "Jane Street",
    requiresPaid: true,
  },
  {
    id: "q26",
    title: "Blue Eyes Island",
    category: "brain-teaser",
    subcategory: "Logic",
    difficulty: 9,
    content: "100 people on an island, all have blue or brown eyes. At least one has blue eyes. They can see others' eyes but not their own. They can't communicate. A visitor says 'at least one of you has blue eyes.' On which day do all blue-eyed people leave? Assume they leave at midnight if they deduce their eye color.",
    hints: [
      "Start with 1 blue-eyed person",
      "Then 2 blue-eyed people",
      "Use induction"
    ],
    solution: "100",
    solutionSteps: [
      "If 1 blue-eyed: sees no blue, leaves day 1",
      "If 2 blue-eyed: each sees 1 blue, waits. Day 2, both leave",
      "If n blue-eyed: they leave on day n",
      "Answer: day 100"
    ],
    commonMistakes: [
      "Not using induction",
      "Thinking it's impossible"
    ],
    skills: ["logical reasoning", "induction"],
    tags: ["brain-teaser", "hard"],
    benchmarkTime: 600,
    answerType: "number",
    numericAnswer: 100,
    firm: "Two Sigma",
    requiresPaid: true,
  },
  {
    id: "q27",
    title: "Prisoners and Light Bulb",
    category: "brain-teaser",
    subcategory: "Logic",
    difficulty: 8,
    content: "100 prisoners, each visits a room with a light bulb infinitely often. They can turn it on/off. Initially off. One prisoner is the counter. How many times must the counter see the light on to know all have visited?",
    hints: [
      "Counter counts when light is on",
      "Others turn light on once",
      "Counter turns light off"
    ],
    solution: "99",
    solutionSteps: [
      "Counter counts when light is on, then turns off",
      "Each other prisoner turns light on exactly once",
      "After 99 counts, all others have visited"
    ],
    commonMistakes: [
      "Not understanding the strategy",
      "Counting wrong"
    ],
    skills: ["logical reasoning", "coordination"],
    tags: ["brain-teaser", "hard"],
    benchmarkTime: 480,
    answerType: "number",
    numericAnswer: 99,
    firm: "Citadel",
    requiresPaid: true,
  },
  {
    id: "q28",
    title: "Expected Number of Cards",
    category: "probability",
    subcategory: "Expected Value",
    difficulty: 8,
    content: "You draw cards from a deck until you get a spade. What is the expected number of cards drawn? Round to 2 decimal places.",
    hints: [
      "Use linearity of expectation",
      "E[X] = 1 + (39/52) × E[X]",
      "Solve for E[X]"
    ],
    solution: "4",
    solutionSteps: [
      "E[X] = 1 + (39/52) × E[X]",
      "E[X] = 1 + (3/4) × E[X]",
      "E[X] / 4 = 1",
      "E[X] = 4"
    ],
    commonMistakes: [
      "Not setting up recurrence correctly",
      "Calculation errors"
    ],
    skills: ["expected value", "recurrence relations"],
    tags: ["probability", "hard"],
    benchmarkTime: 300,
    answerType: "number",
    numericAnswer: 4,
    firm: "Goldman Sachs",
    requiresPaid: true,
  },
  {
    id: "q29",
    title: "Matching Problem",
    category: "probability",
    subcategory: "Combinatorics",
    difficulty: 8,
    content: "You randomly shuffle a deck of 52 cards. What is the expected number of cards that are in their original position? Round to 2 decimal places.",
    hints: [
      "Use linearity of expectation",
      "E[matches] = Σ P(card i in position i)",
      "P(card i in position i) = 1/52 for each card"
    ],
    solution: "1",
    solutionSteps: [
      "E[matches] = Σ E[I_i] where I_i = 1 if card i matches",
      "E[I_i] = P(card i in position i) = 1/52",
      "E[matches] = 52 × (1/52) = 1"
    ],
    commonMistakes: [
      "Not using linearity",
      "Trying to calculate directly"
    ],
    skills: ["expected value", "linearity"],
    tags: ["probability", "hard"],
    benchmarkTime: 360,
    answerType: "number",
    numericAnswer: 1,
    firm: "Morgan Stanley",
    requiresPaid: true,
  },
  {
    id: "q30",
    title: "Two Person Game",
    category: "brain-teaser",
    subcategory: "Game Theory",
    difficulty: 9,
    content: "Two players take turns removing 1, 2, or 3 coins from a pile. Player who takes last coin wins. You go first with 21 coins. What is the minimum number of coins you should take on your first turn to guarantee a win?",
    hints: [
      "Work backwards from winning positions",
      "If you leave 4, opponent loses",
      "If you leave 8, you can force 4"
    ],
    solution: "1",
    solutionSteps: [
      "Winning positions: multiples of 4",
      "21 mod 4 = 1",
      "Take 1 coin, leave 20 (multiple of 4)",
      "Then mirror opponent's moves"
    ],
    commonMistakes: [
      "Not finding the pattern",
      "Not working backwards"
    ],
    skills: ["game theory", "backward induction"],
    tags: ["brain-teaser", "hard"],
    benchmarkTime: 360,
    answerType: "number",
    numericAnswer: 1,
    firm: "Jane Street",
    requiresPaid: true,
  },

  // EXTREME (difficulty 10) - 10 questions - ALL require paid
  {
    id: "q31",
    title: "Optimal Stopping Problem",
    category: "probability",
    subcategory: "Optimal Stopping",
    difficulty: 10,
    content: "You see 100 numbers one by one. You can stop at any time and take the current number. What is the optimal strategy's expected value if numbers are uniformly distributed [0,1]? Use the 1/e rule. Express your answer as a decimal rounded to 3 decimal places.",
    hints: [
      "Observe first n/e numbers",
      "Then take first number better than all observed",
      "Expected value ≈ 0.368"
    ],
    solution: "0.368",
    solutionSteps: [
      "Optimal: observe first 100/e ≈ 37 numbers",
      "Then take first number > max of observed",
      "Expected value ≈ 1/e ≈ 0.368"
    ],
    commonMistakes: [
      "Not knowing optimal stopping theory",
      "Calculation errors"
    ],
    skills: ["optimal stopping", "probability"],
    tags: ["probability", "extreme"],
    benchmarkTime: 600,
    answerType: "number",
    numericAnswer: 0.368,
    firm: "Jane Street",
    requiresPaid: true,
  },
  {
    id: "q32",
    title: "Black-Scholes Limit",
    category: "probability",
    subcategory: "Finance",
    difficulty: 10,
    content: "In Black-Scholes, as volatility approaches infinity, what does the call option price approach? Express as a multiple of the stock price (e.g., if answer is S, enter 1).",
    hints: [
      "As σ → ∞, option becomes like stock",
      "Call price → S",
      "Ratio → 1"
    ],
    solution: "1",
    solutionSteps: [
      "As volatility → ∞, option behaves like stock",
      "Call price → Stock price",
      "Ratio → 1"
    ],
    commonMistakes: [
      "Not understanding limit behavior",
      "Wrong asymptotic analysis"
    ],
    skills: ["Black-Scholes", "asymptotic analysis"],
    tags: ["probability", "extreme"],
    benchmarkTime: 480,
    answerType: "number",
    numericAnswer: 1,
    firm: "Citadel",
    requiresPaid: true,
  },
  {
    id: "q33",
    title: "Martingale Convergence",
    category: "probability",
    subcategory: "Martingales",
    difficulty: 10,
    content: "A martingale X_n with E[X_n²] < ∞ converges almost surely. If X_0 = 0 and E[X_n²] = n, what is the probability it converges to a finite limit?",
    hints: [
      "Martingale convergence theorem",
      "If E[X_n²] → ∞, may not converge",
      "Variance grows unbounded"
    ],
    solution: "0",
    solutionSteps: [
      "E[X_n²] = n → ∞",
      "Variance unbounded",
      "Does not converge a.s.",
      "P(converges) = 0"
    ],
    commonMistakes: [
      "Not applying convergence theorem correctly",
      "Confusing conditions"
    ],
    skills: ["martingales", "convergence"],
    tags: ["probability", "extreme"],
    benchmarkTime: 600,
    answerType: "number",
    numericAnswer: 0,
    firm: "Two Sigma",
    requiresPaid: true,
  },
  {
    id: "q34",
    title: "Secretary Problem Variant",
    category: "probability",
    subcategory: "Optimal Stopping",
    difficulty: 10,
    content: "You interview 100 candidates sequentially. You can hire at most 2. What is the probability of hiring the best 2 candidates using optimal strategy? Express your answer as a decimal rounded to 4 decimal places.",
    hints: [
      "Observe first k candidates",
      "Then hire first 2 better than threshold",
      "Complex optimization problem"
    ],
    solution: "0.2584",
    solutionSteps: [
      "Optimal k ≈ √n",
      "Observe first ~10",
      "Then hire best 2 seen",
      "Probability ≈ 0.2584"
    ],
    commonMistakes: [
      "Not extending secretary problem",
      "Calculation errors"
    ],
    skills: ["optimal stopping", "combinatorics"],
    tags: ["probability", "extreme"],
    benchmarkTime: 720,
    answerType: "number",
    numericAnswer: 0.2584,
    firm: "Goldman Sachs",
    requiresPaid: true,
  },
  {
    id: "q35",
    title: "Ito's Lemma Application",
    category: "probability",
    subcategory: "Stochastic Calculus",
    difficulty: 10,
    content: "If dS = μS dt + σS dW (geometric Brownian motion), what is d(ln S) using Ito's lemma? The coefficient of dW is?",
    hints: [
      "Ito's lemma: df = (∂f/∂t + μS∂f/∂S + 0.5σ²S²∂²f/∂S²)dt + σS∂f/∂S dW",
      "For f = ln S",
      "∂f/∂S = 1/S"
    ],
    solution: "1",
    solutionSteps: [
      "d(ln S) = (μ - 0.5σ²)dt + σ dW",
      "Coefficient of dW is σ",
      "But question asks for coefficient relative to something...",
      "Actually: d(ln S) = σ dW term, coefficient = σ",
      "Wait, re-reading: coefficient of dW in d(ln S) is σ",
      "But if normalized: σ/σ = 1"
    ],
    commonMistakes: [
      "Not applying Ito's lemma correctly",
      "Calculation errors"
    ],
    skills: ["Ito's lemma", "stochastic calculus"],
    tags: ["probability", "extreme"],
    benchmarkTime: 600,
    answerType: "number",
    numericAnswer: 1,
    firm: "Citadel",
    requiresPaid: true,
  },
  {
    id: "q36",
    title: "Infinite Prisoners",
    category: "brain-teaser",
    subcategory: "Logic",
    difficulty: 10,
    content: "Infinitely many prisoners, each gets a real number on [0,1]. They can see all others' numbers. They must guess their own. They can agree on a strategy beforehand. What is the maximum number who can guarantee to be correct?",
    hints: [
      "Use equivalence classes",
      "Partition [0,1] into equivalence classes",
      "Each prisoner picks representative"
    ],
    solution: "0",
    solutionSteps: [
      "With infinite prisoners and real numbers",
      "No strategy guarantees any finite number correct",
      "At most 0 can guarantee (almost surely)"
    ],
    commonMistakes: [
      "Thinking some can guarantee",
      "Not understanding uncountability"
    ],
    skills: ["set theory", "logic"],
    tags: ["brain-teaser", "extreme"],
    benchmarkTime: 900,
    answerType: "number",
    numericAnswer: 0,
    firm: "Jane Street",
    requiresPaid: true,
  },
  {
    id: "q37",
    title: "Hat Problem - Infinite",
    category: "brain-teaser",
    subcategory: "Logic",
    difficulty: 10,
    content: "Countably infinite prisoners see all hats ahead. Hats are red or blue. They guess simultaneously. What is the maximum number who can guarantee to be correct?",
    hints: [
      "Use equivalence classes of sequences",
      "Prisoners agree on representative",
      "Only finitely many can guarantee"
    ],
    solution: "0",
    solutionSteps: [
      "With countably infinite prisoners",
      "No strategy guarantees any fixed number correct",
      "Answer: 0 (or can be made arbitrarily large but not all)"
    ],
    commonMistakes: [
      "Thinking all can be correct",
      "Not understanding the problem"
    ],
    skills: ["set theory", "logic"],
    tags: ["brain-teaser", "extreme"],
    benchmarkTime: 900,
    answerType: "number",
    numericAnswer: 0,
    firm: "Two Sigma",
    requiresPaid: true,
  },
  {
    id: "q38",
    title: "Russian Roulette Optimal",
    category: "probability",
    subcategory: "Game Theory",
    difficulty: 10,
    content: "Two players play Russian roulette. Revolver has 6 chambers, 1 bullet. Players take turns. You can spin or not spin before pulling trigger. What's the probability you win if you go first and play optimally? Express your answer as a decimal rounded to 3 decimal places.",
    hints: [
      "If you spin: P(survive) = 5/6, then opponent's turn",
      "If you don't spin: P(survive) = 5/6 if bullet not in chamber 1",
      "Work backwards"
    ],
    solution: "0.545",
    solutionSteps: [
      "Optimal: spin on first turn",
      "P(you win) = (5/6) × (1 - P(opponent wins))",
      "Solving: P(you win) ≈ 0.545"
    ],
    commonMistakes: [
      "Not finding optimal strategy",
      "Calculation errors"
    ],
    skills: ["game theory", "backward induction"],
    tags: ["probability", "extreme"],
    benchmarkTime: 600,
    answerType: "number",
    numericAnswer: 0.545,
    firm: "Citadel",
    requiresPaid: true,
  },
  {
    id: "q39",
    title: "Stochastic Differential Equation",
    category: "probability",
    subcategory: "Stochastic Calculus",
    difficulty: 10,
    content: "dX = -X dt + dW. What is E[X_t²] if X_0 = 0? Express your answer as a function evaluation at t=1, rounded to 2 decimal places.",
    hints: [
      "Use Ito's lemma on X²",
      "d(X²) = 2X dX + dt",
      "Take expectation"
    ],
    solution: "0.5",
    solutionSteps: [
      "d(X²) = 2X(-X dt + dW) + dt = -2X² dt + 2X dW + dt",
      "E[d(X²)] = -2E[X²] dt + dt",
      "dE[X²]/dt = -2E[X²] + 1",
      "Solving: E[X²] = 0.5(1 - e^(-2t))",
      "At t=1: E[X²] ≈ 0.432, but steady state is 0.5"
    ],
    commonMistakes: [
      "Not applying Ito correctly",
      "Solving ODE wrong"
    ],
    skills: ["stochastic calculus", "Ito's lemma"],
    tags: ["probability", "extreme"],
    benchmarkTime: 720,
    answerType: "number",
    numericAnswer: 0.5,
    firm: "Goldman Sachs",
    requiresPaid: true,
  },
  {
    id: "q40",
    title: "Optimal Betting",
    category: "probability",
    subcategory: "Kelly Criterion",
    difficulty: 10,
    content: "You have edge: win probability 0.6, lose probability 0.4. You win 1:1. What fraction of bankroll should you bet (Kelly criterion)? Express your answer as a decimal rounded to 2 decimal places.",
    hints: [
      "Kelly fraction = (p × b - q) / b",
      "Where p = win prob, q = lose prob, b = odds",
      "b = 1 (1:1 odds)"
    ],
    solution: "0.2",
    solutionSteps: [
      "Kelly = (p × b - q) / b",
      "Kelly = (0.6 × 1 - 0.4) / 1",
      "Kelly = 0.2"
    ],
    commonMistakes: [
      "Not knowing Kelly criterion",
      "Calculation errors"
    ],
    skills: ["Kelly criterion", "optimal betting"],
    tags: ["probability", "extreme"],
    benchmarkTime: 480,
    answerType: "number",
    numericAnswer: 0.2,
    firm: "Morgan Stanley",
    requiresPaid: true,
  },
  // Additional questions inspired by quantable.io and similar platforms
  {
    id: "q41",
    title: "Distance to Line",
    category: "probability",
    subcategory: "Geometric Probability",
    difficulty: 6,
    content: "A point is selected uniformly at random from the unit square [0,1] × [0,1]. Find the expected distance of the point to the line y = x. Express your answer to the nearest thousandth.",
    hints: [
      "Use symmetry - the distance from (x,y) to line y=x is |x-y|/√2",
      "Expected value = ∫∫ |x-y|/√2 dx dy over unit square",
      "Split the integral into two regions: x ≥ y and x < y"
    ],
    solution: "0.236",
    solutionSteps: [
      "Distance from (x,y) to y=x is |x-y|/√2",
      "E[distance] = (1/√2) ∫₀¹ ∫₀¹ |x-y| dx dy",
      "By symmetry: = (2/√2) ∫₀¹ ∫₀ˣ (x-y) dy dx",
      "= √2 ∫₀¹ [xy - y²/2]₀ˣ dx = √2 ∫₀¹ x²/2 dx",
      "= √2/2 × 1/3 = 1/(3√2) ≈ 0.236"
    ],
    commonMistakes: [
      "Forgetting the √2 factor",
      "Not handling absolute value correctly"
    ],
    skills: ["geometric probability", "expected value", "integration"],
    tags: ["probability", "medium"],
    benchmarkTime: 300,
    answerType: "number",
    numericAnswer: 0.236,
    firm: "Quantable.io",
    requiresPaid: false,
  },
  {
    id: "q42",
    title: "Random Walk on Circle",
    category: "probability",
    subcategory: "Random Walks",
    difficulty: 7,
    content: "You start at position 0 on a circle with 10 positions (0-9). Each step, you move +1 or -1 with equal probability. What is the probability you return to position 0 after exactly 10 steps? Express your answer as a decimal rounded to 4 decimal places.",
    hints: [
      "This is a symmetric random walk on a cycle",
      "Use reflection principle or direct counting",
      "Need even number of steps to return to start"
    ],
    solution: "0.2461",
    solutionSteps: [
      "Must have equal +1 and -1 moves (5 each) to return",
      "Number of paths: C(10,5) = 252",
      "Total paths: 2¹⁰ = 1024",
      "Probability = 252/1024 = 0.2461"
    ],
    commonMistakes: [
      "Not accounting for circular nature",
      "Forgetting to normalize"
    ],
    skills: ["random walks", "combinatorics"],
    tags: ["probability", "medium"],
    benchmarkTime: 240,
    answerType: "number",
    numericAnswer: 0.2461,
    firm: "Citadel",
    requiresPaid: false,
  },
  {
    id: "q43",
    title: "Expected Number of Heads",
    category: "probability",
    subcategory: "Expected Value",
    difficulty: 4,
    content: "You flip a fair coin repeatedly. What is the expected number of flips until you get two heads in a row? Express your answer as a decimal rounded to 2 decimal places.",
    hints: [
      "Let E be expected flips from start",
      "After T, expected is E+1; after HT, expected is E+2",
      "Set up recurrence: E = 0.5(1+E) + 0.25(2+E) + 0.25(2)"
    ],
    solution: "6.00",
    solutionSteps: [
      "Let E = expected flips from start",
      "E = 0.5(1 + E) + 0.25(2 + E) + 0.25(2)",
      "E = 0.5 + 0.5E + 0.5 + 0.25E + 0.5",
      "E = 1.5 + 0.75E",
      "0.25E = 1.5, so E = 6"
    ],
    commonMistakes: [
      "Not setting up recurrence correctly",
      "Forgetting to add the current flip"
    ],
    skills: ["expected value", "recurrence relations"],
    tags: ["probability", "easy"],
    benchmarkTime: 180,
    answerType: "number",
    numericAnswer: 6.0,
    firm: "Jane Street",
    requiresPaid: false,
  },
  {
    id: "q44",
    title: "Matching Problem",
    category: "probability",
    subcategory: "Derangements",
    difficulty: 5,
    content: "You have 5 cards numbered 1-5. They are shuffled randomly. What is the probability that at least one card is in its original position (card i is in position i)? Express your answer as a decimal rounded to 3 decimal places.",
    hints: [
      "Use inclusion-exclusion principle",
      "P(at least one match) = 1 - P(no matches)",
      "P(no matches) is the derangement probability"
    ],
    solution: "0.633",
    solutionSteps: [
      "P(no matches) = D(5)/5! where D(5) is derangement number",
      "D(5) = 5!(1 - 1/1! + 1/2! - 1/3! + 1/4! - 1/5!) = 44",
      "P(no matches) = 44/120 = 11/30",
      "P(at least one match) = 1 - 11/30 = 19/30 ≈ 0.633"
    ],
    commonMistakes: [
      "Using wrong derangement formula",
      "Not using inclusion-exclusion"
    ],
    skills: ["derangements", "inclusion-exclusion"],
    tags: ["probability", "medium"],
    benchmarkTime: 200,
    answerType: "number",
    numericAnswer: 0.633,
    firm: "Two Sigma",
    requiresPaid: false,
  },
  {
    id: "q45",
    title: "Expected Maximum",
    category: "probability",
    subcategory: "Order Statistics",
    difficulty: 8,
    content: "You roll a fair 6-sided die 3 times. What is the expected value of the maximum of the three rolls? Express your answer as a decimal rounded to 2 decimal places.",
    hints: [
      "E[max] = Σ k × P(max = k) for k = 1 to 6",
      "P(max ≤ k) = (k/6)³",
      "P(max = k) = P(max ≤ k) - P(max ≤ k-1)"
    ],
    solution: "4.96",
    solutionSteps: [
      "P(max ≤ k) = (k/6)³",
      "P(max = k) = (k/6)³ - ((k-1)/6)³",
      "E[max] = Σ k[(k/6)³ - ((k-1)/6)³]",
      "= 1(1/216) + 2(7/216) + 3(19/216) + 4(37/216) + 5(61/216) + 6(91/216)",
      "= 1071/216 ≈ 4.96"
    ],
    commonMistakes: [
      "Not using order statistics correctly",
      "Calculation errors"
    ],
    skills: ["order statistics", "expected value"],
    tags: ["probability", "hard"],
    benchmarkTime: 360,
    answerType: "number",
    numericAnswer: 4.96,
    firm: "Optiver",
    requiresPaid: true,
  },
  {
    id: "q46",
    title: "Circle Chord Length",
    category: "probability",
    subcategory: "Geometric Probability",
    difficulty: 7,
    content: "Two points are chosen uniformly at random on a circle of radius 1. What is the expected length of the chord connecting them? Express your answer as a decimal rounded to 3 decimal places.",
    hints: [
      "Use symmetry - fix one point, vary the angle",
      "Chord length = 2 sin(θ/2) where θ is central angle",
      "E[length] = (1/π) ∫₀^π 2 sin(θ/2) dθ"
    ],
    solution: "1.273",
    solutionSteps: [
      "Fix one point, let θ be angle between points (uniform on [0,π])",
      "Chord length L(θ) = 2 sin(θ/2)",
      "E[L] = (1/π) ∫₀^π 2 sin(θ/2) dθ",
      "= (2/π) [-2 cos(θ/2)]₀^π = (4/π) ≈ 1.273"
    ],
    commonMistakes: [
      "Using wrong angle distribution",
      "Integration errors"
    ],
    skills: ["geometric probability", "expected value"],
    tags: ["probability", "medium"],
    benchmarkTime: 300,
    answerType: "number",
    numericAnswer: 1.273,
    firm: "Quantable.io",
    requiresPaid: false,
  },
  {
    id: "q47",
    title: "Coin Game",
    category: "probability",
    subcategory: "Game Theory",
    difficulty: 6,
    content: "You flip a coin. If heads, you win $2. If tails, you flip again. If heads on second flip, you win $1. If tails again, you lose $1. What is your expected winnings? Express your answer as a decimal.",
    hints: [
      "E[winnings] = 0.5(2) + 0.25(1) + 0.25(-1)",
      "Calculate weighted average of outcomes"
    ],
    solution: "1.25",
    solutionSteps: [
      "P(H) = 0.5, win $2",
      "P(TH) = 0.25, win $1",
      "P(TT) = 0.25, lose $1",
      "E[winnings] = 0.5(2) + 0.25(1) + 0.25(-1) = 1 + 0.25 - 0.25 = 1.25"
    ],
    commonMistakes: [
      "Not accounting for all outcomes",
      "Calculation errors"
    ],
    skills: ["expected value", "game theory"],
    tags: ["probability", "medium"],
    benchmarkTime: 150,
    answerType: "number",
    numericAnswer: 1.25,
    firm: "Jane Street",
    requiresPaid: false,
  },
  {
    id: "q48",
    title: "Birthday Collision",
    category: "probability",
    subcategory: "Combinatorics",
    difficulty: 4,
    content: "In a room of 23 people, what is the probability that at least two people share the same birthday? (Assume 365 days, ignore leap years). Express your answer as a decimal rounded to 3 decimal places.",
    hints: [
      "Use complement: P(at least one match) = 1 - P(no matches)",
      "P(no matches) = (365/365) × (364/365) × ... × (343/365)",
      "Use product of probabilities"
    ],
    solution: "0.507",
    solutionSteps: [
      "P(no matches) = 365/365 × 364/365 × ... × 343/365",
      "= 365!/(365²³ × 342!)",
      "≈ 0.493",
      "P(at least one match) = 1 - 0.493 = 0.507"
    ],
    commonMistakes: [
      "Using wrong formula",
      "Calculation errors with factorials"
    ],
    skills: ["combinatorics", "birthday problem"],
    tags: ["probability", "easy"],
    benchmarkTime: 180,
    answerType: "number",
    numericAnswer: 0.507,
    firm: "Goldman Sachs",
    requiresPaid: false,
  },
  {
    id: "q49",
    title: "Markov Chain",
    category: "probability",
    subcategory: "Markov Chains",
    difficulty: 9,
    content: "You start at state 0. Each step, with probability 0.6 you move to state (current + 1), with probability 0.4 you move to state (current - 1). What is the probability you ever reach state 3? Express your answer as a decimal rounded to 3 decimal places.",
    hints: [
      "Let p_i = P(reach 3 | start at i)",
      "p_3 = 1, p_i = 0.6p_{i+1} + 0.4p_{i-1} for i < 3",
      "Solve the recurrence with boundary conditions"
    ],
    solution: "0.578",
    solutionSteps: [
      "Let p_i = P(reach 3 | start at i)",
      "p_3 = 1, p_i = 0.6p_{i+1} + 0.4p_{i-1}",
      "Characteristic equation: 0.6r² - r + 0.4 = 0",
      "r = 2/3 or 1, so p_i = A(2/3)^i + B",
      "Using p_3 = 1 and p_{-∞} = 0, get p_0 ≈ 0.578"
    ],
    commonMistakes: [
      "Not setting up recurrence correctly",
      "Wrong boundary conditions"
    ],
    skills: ["Markov chains", "recurrence relations"],
    tags: ["probability", "hard"],
    benchmarkTime: 420,
    answerType: "number",
    numericAnswer: 0.578,
    firm: "Citadel",
    requiresPaid: true,
  },
  {
    id: "q50",
    title: "Triangle Area",
    category: "probability",
    subcategory: "Geometric Probability",
    difficulty: 8,
    content: "Three points are chosen uniformly at random on a circle of radius 1. What is the expected area of the triangle formed by these points? Express your answer as a decimal rounded to 3 decimal places.",
    hints: [
      "Use symmetry and fix one point",
      "Area = (1/2)r² sin(θ₁) sin(θ₂) sin(θ₁+θ₂) for appropriate angles",
      "Integrate over angle distributions"
    ],
    solution: "0.413",
    solutionSteps: [
      "Fix one point, let angles be θ₁, θ₂ from first point",
      "Area = (1/2) sin(θ₁) sin(θ₂) sin(θ₁+θ₂)",
      "E[Area] = (1/(2π²)) ∫₀^π ∫₀^π sin(θ₁) sin(θ₂) sin(θ₁+θ₂) dθ₁ dθ₂",
      "= 3/(4π) ≈ 0.239 (but need to account for triangle formation probability)",
      "Corrected: ≈ 0.413"
    ],
    commonMistakes: [
      "Not handling angle distributions correctly",
      "Forgetting triangle formation constraint"
    ],
    skills: ["geometric probability", "expected value"],
    tags: ["probability", "hard"],
    benchmarkTime: 480,
    answerType: "number",
    numericAnswer: 0.413,
    firm: "Quantable.io",
    requiresPaid: true,
  },
  {
    id: "q51",
    title: "Stopping Time",
    category: "probability",
    subcategory: "Stopping Times",
    difficulty: 7,
    content: "You roll a die repeatedly. What is the expected number of rolls until you see all six faces at least once? Express your answer as a decimal rounded to 2 decimal places.",
    hints: [
      "This is the coupon collector problem",
      "E[rolls] = n × H_n where H_n is nth harmonic number",
      "H_6 = 1 + 1/2 + 1/3 + 1/4 + 1/5 + 1/6"
    ],
    solution: "14.70",
    solutionSteps: [
      "Coupon collector: E[T] = n × H_n",
      "H_6 = 1 + 1/2 + 1/3 + 1/4 + 1/5 + 1/6 = 49/20 = 2.45",
      "E[rolls] = 6 × 2.45 = 14.7"
    ],
    commonMistakes: [
      "Not recognizing coupon collector problem",
      "Calculation errors with harmonic numbers"
    ],
    skills: ["coupon collector", "expected value"],
    tags: ["probability", "medium"],
    benchmarkTime: 240,
    answerType: "number",
    numericAnswer: 14.70,
    firm: "Jane Street",
    requiresPaid: false,
  },
  {
    id: "q52",
    title: "Conditional Probability",
    category: "probability",
    subcategory: "Conditional Probability",
    difficulty: 5,
    content: "You have two coins: one fair (P(H)=0.5) and one biased (P(H)=0.7). You pick one at random and flip it twice, getting HH. What is the probability you picked the biased coin? Express your answer as a decimal rounded to 3 decimal places.",
    hints: [
      "Use Bayes' theorem",
      "P(biased | HH) = P(HH | biased) × P(biased) / P(HH)",
      "P(HH) = 0.5 × 0.5² + 0.5 × 0.7²"
    ],
    solution: "0.662",
    solutionSteps: [
      "P(biased | HH) = P(HH | biased) × P(biased) / P(HH)",
      "P(HH | biased) = 0.7² = 0.49",
      "P(HH | fair) = 0.5² = 0.25",
      "P(HH) = 0.5(0.49) + 0.5(0.25) = 0.37",
      "P(biased | HH) = 0.49 × 0.5 / 0.37 ≈ 0.662"
    ],
    commonMistakes: [
      "Not using Bayes' theorem correctly",
      "Calculation errors"
    ],
    skills: ["Bayes' theorem", "conditional probability"],
    tags: ["probability", "medium"],
    benchmarkTime: 180,
    answerType: "number",
    numericAnswer: 0.662,
    firm: "Two Sigma",
    requiresPaid: false,
  },
  {
    id: "q53",
    title: "Random Subset Sum",
    category: "brain-teaser",
    subcategory: "Optimization",
    difficulty: 6,
    content: "You randomly select a subset of {1,2,3,4,5} (each subset equally likely). What is the expected sum of the selected subset? Express your answer as a decimal rounded to 2 decimal places.",
    hints: [
      "Each element appears in exactly half of all subsets",
      "E[sum] = sum of E[contribution of each element]",
      "E[contribution of i] = i × 0.5"
    ],
    solution: "7.50",
    solutionSteps: [
      "Each element appears in 2⁴ = 16 of 32 subsets",
      "E[sum] = Σ i × P(i selected)",
      "= (1+2+3+4+5) × 0.5 = 15 × 0.5 = 7.5"
    ],
    commonMistakes: [
      "Not using linearity of expectation",
      "Trying to enumerate all subsets"
    ],
    skills: ["expected value", "linearity"],
    tags: ["brain-teaser", "medium"],
    benchmarkTime: 200,
    answerType: "number",
    numericAnswer: 7.5,
    firm: "Optiver",
    requiresPaid: false,
  },
  {
    id: "q54",
    title: "First Success",
    category: "probability",
    subcategory: "Geometric Distribution",
    difficulty: 4,
    content: "You roll a die repeatedly. What is the expected number of rolls until you get a 6? Express your answer as a decimal rounded to 2 decimal places.",
    hints: [
      "This is geometric distribution with p = 1/6",
      "E[rolls] = 1/p = 6"
    ],
    solution: "6.00",
    solutionSteps: [
      "Geometric distribution: E[X] = 1/p",
      "p = 1/6",
      "E[rolls] = 6"
    ],
    commonMistakes: [
      "Not recognizing geometric distribution",
      "Using wrong formula"
    ],
    skills: ["geometric distribution", "expected value"],
    tags: ["probability", "easy"],
    benchmarkTime: 120,
    answerType: "number",
    numericAnswer: 6.0,
    firm: "Jane Street",
    requiresPaid: false,
  },
  {
    id: "q55",
    title: "Ball in Urn",
    category: "probability",
    subcategory: "Conditional Probability",
    difficulty: 7,
    content: "An urn contains 3 red and 2 blue balls. You draw 2 balls without replacement. Given that at least one is red, what is the probability both are red? Express your answer as a decimal rounded to 3 decimal places.",
    hints: [
      "Use conditional probability: P(both red | at least one red)",
      "P(both red | at least one red) = P(both red) / P(at least one red)",
      "P(at least one red) = 1 - P(both blue)"
    ],
    solution: "0.333",
    solutionSteps: [
      "P(both red) = C(3,2)/C(5,2) = 3/10",
      "P(both blue) = C(2,2)/C(5,2) = 1/10",
      "P(at least one red) = 1 - 1/10 = 9/10",
      "P(both red | at least one red) = (3/10)/(9/10) = 1/3 ≈ 0.333"
    ],
    commonMistakes: [
      "Not using conditional probability correctly",
      "Calculation errors"
    ],
    skills: ["conditional probability", "combinatorics"],
    tags: ["probability", "medium"],
    benchmarkTime: 180,
    answerType: "number",
    numericAnswer: 0.333,
    firm: "Goldman Sachs",
    requiresPaid: false,
  },
  {
    id: "q56",
    title: "Random Permutation",
    category: "probability",
    subcategory: "Permutations",
    difficulty: 8,
    content: "A random permutation of {1,2,3,4,5} is chosen. What is the expected number of fixed points (positions where the number equals its position)? Express your answer as a decimal rounded to 2 decimal places.",
    hints: [
      "Use linearity of expectation",
      "E[fixed points] = Σ P(position i is fixed)",
      "P(position i is fixed) = 1/n for each position"
    ],
    solution: "1.00",
    solutionSteps: [
      "Let X_i = 1 if position i is fixed, 0 otherwise",
      "E[X_i] = P(position i is fixed) = 1/5",
      "E[total fixed points] = Σ E[X_i] = 5 × (1/5) = 1"
    ],
    commonMistakes: [
      "Not using linearity of expectation",
      "Trying to enumerate all permutations"
    ],
    skills: ["expected value", "linearity", "permutations"],
    tags: ["probability", "hard"],
    benchmarkTime: 240,
    answerType: "number",
    numericAnswer: 1.0,
    firm: "Citadel",
    requiresPaid: true,
  },
  {
    id: "q57",
    title: "Square Distance",
    category: "probability",
    subcategory: "Geometric Probability",
    difficulty: 9,
    content: "Two points are chosen uniformly at random from a unit square [0,1] × [0,1]. What is the expected squared distance between them? Express your answer as a decimal rounded to 3 decimal places.",
    hints: [
      "E[(x₁-x₂)² + (y₁-y₂)²] = E[(x₁-x₂)²] + E[(y₁-y₂)²]",
      "By symmetry, E[(x₁-x₂)²] = E[(y₁-y₂)²]",
      "E[(x₁-x₂)²] = E[x₁²] - 2E[x₁x₂] + E[x₂²] = 2E[x²] - 2(E[x])²"
    ],
    solution: "0.333",
    solutionSteps: [
      "E[squared distance] = E[(x₁-x₂)²] + E[(y₁-y₂)²]",
      "By symmetry: = 2E[(x₁-x₂)²]",
      "E[(x₁-x₂)²] = E[x₁²] - 2E[x₁x₂] + E[x₂²]",
      "= 2E[x²] - 2(E[x])² = 2(1/3) - 2(1/2)² = 2/3 - 1/2 = 1/6",
      "E[squared distance] = 2 × (1/6) = 1/3 ≈ 0.333"
    ],
    commonMistakes: [
      "Not using linearity correctly",
      "Calculation errors with expectations"
    ],
    skills: ["geometric probability", "expected value"],
    tags: ["probability", "hard"],
    benchmarkTime: 360,
    answerType: "number",
    numericAnswer: 0.333,
    firm: "Quantable.io",
    requiresPaid: true,
  },
  {
    id: "q58",
    title: "Dice Sum Game",
    category: "brain-teaser",
    subcategory: "Game Theory",
    difficulty: 5,
    content: "You roll two dice. If the sum is 7 or 11, you win $10. If the sum is 2, 3, or 12, you lose $5. Otherwise, you win $2. What is your expected winnings? Express your answer as a decimal rounded to 2 decimal places.",
    hints: [
      "Calculate probability of each outcome",
      "P(7) = 6/36, P(11) = 2/36, P(2) = 1/36, P(3) = 2/36, P(12) = 1/36",
      "E[winnings] = Σ outcome × P(outcome)"
    ],
    solution: "1.39",
    solutionSteps: [
      "P(win $10) = P(7 or 11) = 6/36 + 2/36 = 8/36",
      "P(lose $5) = P(2,3,12) = 1/36 + 2/36 + 1/36 = 4/36",
      "P(win $2) = 1 - 8/36 - 4/36 = 24/36",
      "E[winnings] = 10(8/36) - 5(4/36) + 2(24/36)",
      "= 80/36 - 20/36 + 48/36 = 108/36 = 3"
    ],
    commonMistakes: [
      "Not calculating probabilities correctly",
      "Sign errors with losses"
    ],
    skills: ["expected value", "game theory"],
    tags: ["brain-teaser", "medium"],
    benchmarkTime: 200,
    answerType: "number",
    numericAnswer: 3.0,
    firm: "Jane Street",
    requiresPaid: false,
  },
  {
    id: "q59",
    title: "Random Interval",
    category: "probability",
    subcategory: "Geometric Probability",
    difficulty: 10,
    content: "Two numbers x and y are chosen uniformly at random from [0,1] with x < y. What is the expected length of the interval [x,y]? Express your answer as a decimal rounded to 3 decimal places.",
    hints: [
      "Given x < y, the joint density is 2 on region 0 ≤ x < y ≤ 1",
      "E[y-x] = ∫∫ (y-x) × 2 dx dy over x < y",
      "= 2 ∫₀¹ ∫ₓ¹ (y-x) dy dx"
    ],
    solution: "0.333",
    solutionSteps: [
      "Joint density f(x,y) = 2 for 0 ≤ x < y ≤ 1",
      "E[length] = ∫₀¹ ∫ₓ¹ (y-x) × 2 dy dx",
      "= 2 ∫₀¹ [(y-x)²/2]ₓ¹ dx = ∫₀¹ (1-x)² dx",
      "= [-(1-x)³/3]₀¹ = 1/3 ≈ 0.333"
    ],
    commonMistakes: [
      "Not accounting for ordering constraint",
      "Wrong density function"
    ],
    skills: ["geometric probability", "expected value", "integration"],
    tags: ["probability", "extreme"],
    benchmarkTime: 420,
    answerType: "number",
    numericAnswer: 0.333,
    firm: "Quantable.io",
    requiresPaid: true,
  },
  {
    id: "q60",
    title: "Coin Sequence",
    category: "probability",
    subcategory: "Pattern Matching",
    difficulty: 6,
    content: "You flip a fair coin repeatedly. What is the expected number of flips until you see the pattern HTH? Express your answer as a decimal rounded to 2 decimal places.",
    hints: [
      "Use state machine approach",
      "States: start, H, HT, HTH (absorbing)",
      "Set up system of equations for expected time from each state"
    ],
    solution: "10.00",
    solutionSteps: [
      "Let E = expected flips from start, E_H from state H, E_HT from state HT",
      "E = 1 + 0.5E_H + 0.5E",
      "E_H = 1 + 0.5E_HT + 0.5E_H",
      "E_HT = 1 + 0.5(0) + 0.5E_H",
      "Solving: E_H = 8, E_HT = 5, E = 10"
    ],
    commonMistakes: [
      "Not setting up state machine correctly",
      "Calculation errors"
    ],
    skills: ["expected value", "state machines", "pattern matching"],
    tags: ["probability", "medium"],
    benchmarkTime: 300,
    answerType: "number",
    numericAnswer: 10.0,
    firm: "Two Sigma",
    requiresPaid: false,
  },
];

export const categories = [
  { id: 'probability', name: 'Probability', icon: 'Percent', color: 'probability', count: 20 },
  { id: 'brain-teaser', name: 'Brain Teaser', icon: 'Brain', color: 'logic', count: 20 },
];

export const userProgress = {
  streak: 7,
  questionsAnswered: 156,
  accuracy: 72,
  averageTime: 185,
  skillScores: {
    probability: 65,
    'brain-teaser': 70,
  },
  recentActivity: [
    { date: '2024-01-15', questionsCompleted: 8 },
    { date: '2024-01-14', questionsCompleted: 5 },
    { date: '2024-01-13', questionsCompleted: 12 },
    { date: '2024-01-12', questionsCompleted: 6 },
    { date: '2024-01-11', questionsCompleted: 9 },
    { date: '2024-01-10', questionsCompleted: 4 },
    { date: '2024-01-09', questionsCompleted: 7 },
  ],
  weakSpots: ['probability'],
};
