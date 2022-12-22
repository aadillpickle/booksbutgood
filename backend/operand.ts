import {
  operandClient,
  indexIDHeaderKey,
  ObjectService,
} from "@operandinc/sdk";

module.exports = {
  searchWithin: async function () {
    const operand = operandClient(
      ObjectService,
      "igblu081041y2h9lv6s8s3fa05yem41p2sko",
      process.env["OPERAND_API_KEY"],
      {
        [indexIDHeaderKey]: "e1v5mc48o0bi",
      }
    );
    const response = await operand.searchWithin({
      query: "why is peter thiel so rich",
    });
    console.log(response);
    console.log(response.matches.map((m) => `${m.content} (${m.score})`));
  },
};
