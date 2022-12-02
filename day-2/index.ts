type Shape = "rock" | "paper" | "scissors";
type Power = 0 | 1 | 2;
type Outcome = "loss" | "draw" | "win";

type ProponentChoice = "X" | "Y" | "Z";
type OpponentChoice = "A" | "B" | "C";
type DesiredOutcome = "X" | "Y" | "Z";

type Round_FirstHalf = [
  opponentChoice: OpponentChoice,
  proponentChoice: ProponentChoice
];
type StrategyGuide_FirstHalf = Round_FirstHalf[];

type Round_SecondHalf = [
  opponentChoice: OpponentChoice,
  desiredOutcome: DesiredOutcome
];
type StrategyGuide_SecondHalf = Round_SecondHalf[];

const PROPONENT_SHAPE_MAP: Record<ProponentChoice, Shape> = {
  X: "rock",
  Y: "paper",
  Z: "scissors",
};

const OPPONENT_SHAPE_MAP: Record<OpponentChoice, Shape> = {
  A: "rock",
  B: "paper",
  C: "scissors",
};

const OUTCOME_MAP: Record<DesiredOutcome, Outcome> = {
  X: "loss",
  Y: "draw",
  Z: "win",
};

const SHAPE_SCORE_MAP: Record<Shape, number> = {
  rock: 1,
  paper: 2,
  scissors: 3,
};

const OUTCOME_SCORE_MAP: Record<Outcome, number> = {
  loss: 0,
  draw: 3,
  win: 6,
};

const SHAPE_TO_POWER_MAP: Record<Shape, Power> = {
  rock: 0,
  paper: 1,
  scissors: 2,
};

function evaluateRound(proponentChoice: Shape, opponentChoice: Shape): Outcome {
  const proponentPower = SHAPE_TO_POWER_MAP[proponentChoice];
  const opponentPower = SHAPE_TO_POWER_MAP[opponentChoice];

  const result = (proponentPower - opponentPower + 3) % 3;

  switch (result) {
    case 0:
      return "draw";
    case 1:
      return "win";
    case 2:
      return "loss";
    default:
      throw Error(`Expected result to be 0, 1, or 2, but got ${result}`);
  }
}

function getShapeDesiredForOutcome(
  opponentChoice: Shape,
  desiredOutcome: Outcome
) {
  const powerOrderedShapes: Shape[] = ["rock", "paper", "scissors"];
  const opponentIndex = powerOrderedShapes.findIndex(
    (shape) => shape === opponentChoice
  );

  let desiredOutcomeIndex: number;
  switch (desiredOutcome) {
    case "draw":
      desiredOutcomeIndex = opponentIndex;
      break;
    case "win":
      desiredOutcomeIndex = (opponentIndex + 1 + 3) % 3;
      break;
    case "loss":
      desiredOutcomeIndex = (opponentIndex - 1 + 3) % 3;
      break;
  }

  return powerOrderedShapes[desiredOutcomeIndex];
}

async function getStrategyGuide_firstHalf(): Promise<StrategyGuide_FirstHalf> {
  const fileContents = await Deno.readTextFile("./input.txt");
  return fileContents
    .split("\n")
    .map((input) => [input.at(0), input.at(-1)] as Round_FirstHalf);
}

async function getStrategyGuide_secondHalf(): Promise<StrategyGuide_SecondHalf> {
  const fileContents = await Deno.readTextFile("./input.txt");
  return fileContents
    .split("\n")
    .map((input) => [input.at(0), input.at(-1)] as Round_SecondHalf);
}

function calculateTotalScore_firstHalf(strategyGuide: StrategyGuide_FirstHalf) {
  return strategyGuide.reduce((accumulatedScore, currentRound) => {
    const [opponentChoice, proponentChoice] = currentRound;
    const proponentShape = PROPONENT_SHAPE_MAP[proponentChoice];
    const opponentShape = OPPONENT_SHAPE_MAP[opponentChoice];
    const shapeScore = SHAPE_SCORE_MAP[proponentShape];

    const outcome = evaluateRound(proponentShape, opponentShape);
    const outcomeScore = OUTCOME_SCORE_MAP[outcome];

    return accumulatedScore + shapeScore + outcomeScore;
  }, 0);
}

function calculateTotalScore_secondHalf(
  strategyGuide: StrategyGuide_SecondHalf
) {
  return strategyGuide.reduce((accumulatedScore, currentRound) => {
    const [opponentChoice, desiredOutcome] = currentRound;
    const opponentShape = OPPONENT_SHAPE_MAP[opponentChoice];
    const outcome = OUTCOME_MAP[desiredOutcome];
    const outcomeScore = OUTCOME_SCORE_MAP[outcome];

    const desiredShape = getShapeDesiredForOutcome(opponentShape, outcome);
    const shapeScore = SHAPE_SCORE_MAP[desiredShape];

    return accumulatedScore + shapeScore + outcomeScore;
  }, 0);
}

const strategyGuide = await getStrategyGuide_secondHalf();
const totalScore = calculateTotalScore_secondHalf(strategyGuide);

console.log(totalScore);
