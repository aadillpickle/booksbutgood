import {
  operandClient,
  indexIDHeaderKey,
  ObjectService,
} from "@operandinc/sdk";

let searchWithin = async function () {
  const operand = operandClient(
    ObjectService,
    "igblu081041y2h9lv6s8s3fa05yem41p2sko",
    "https://api.operand.ai",
    {
      [indexIDHeaderKey]: "2g2i2p14ddly",
    }
  );

  const response = await operand.searchWithin({
    query: "fundraising",
  });
  
  // console.log(response);
  console.log(response.matches.map((m) => `${m.content} (${m.score})`));
}

searchWithin()

module.exports = {
 searchWithin
};
