const year = process.argv.length > 4 ? process.argv[4] : new Date().getFullYear();
const day = process.argv.length > 3 ? process.argv[3] : new Date().getDate();

const main = async () => {
  const solverModule = await import(`../${year}/day${day}/aoc`);

  switch (parseInt(process.argv[2])) {
    case 1:
      console.log(solverModule.func1());
      break;
    case 2:
      console.log(solverModule.func2());
      break;
    default:
      throw new Error("No task number provided.");
  }
};

main();
