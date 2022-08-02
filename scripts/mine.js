const { moveBlocks } = require("../utils/move-blocks");

const Blocks = 2;
const SleepAmount = 1000;

async function mine() {
    await moveBlocks(Blocks, SleepAmount);
}

mine()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
