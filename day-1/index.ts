type CalorieSetsList = number[][];

async function getCalorieSetsList(): Promise<CalorieSetsList> {
  const result = await Deno.readTextFile("./input.txt");
  const splittedResult = result.split("\n");

  const list: number[][] = [];
  let currentSet: number[] = [];

  for (const entry of splittedResult) {
    if (entry === "") {
      list.push(currentSet);
      currentSet = [];

      continue;
    }

    currentSet.push(parseInt(entry));
  }

  return list;
}

function sumCaloriesSets(list: CalorieSetsList): number[] {
  return list.map((entry) => entry.reduce((acc, cur) => acc + cur, 0));
}

function getLargestSet(list: CalorieSetsList): number {
  const sums = sumCaloriesSets(list);
  return sums.reduce((acc, cur) => (cur > acc ? cur : acc));
}

const list = await getCalorieSetsList();
const sortedSumsList = sumCaloriesSets(list).sort((a, b) => b - a);
const sumOfThreeLargest = sortedSumsList
  .slice(0, 3)
  .reduce((acc, cur) => acc + cur);

console.log(sumOfThreeLargest);
