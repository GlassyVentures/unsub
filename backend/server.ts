import fastify from "fastify";
import puppeteer from "puppeteer";
require("dotenv").config();

// let actions = [
//   {
//     action: "goto",
//     selector: "https://news.ycombinator.com/",
//   },
//   { action: "click", selector: "input[name='_ct129']" },
//   { action: "waitForSelector", selector: ".spanInfo" },
//   { action: "testNull", selector: ".spanInfo" },
// ];

let browser: puppeteer.Browser;

const f = fastify({
  logger: true,
});

const action = async (actions: Array<any>, page: puppeteer.Page) => {
  const act = actions[0];
  console.log(act);
  switch (act.action) {
    case "click":
      await page.click(act.selector);
    case "testNull":
      await page.waitForSelector(act.selector, { timeout: 3000 });
      let element = await page.$(act.selector);
      if (element === null) {
        throw new Error("Selector is null / cannot be found.");
      }
    case "goto":
      await page.goto(act.selector);
  }
  actions = actions.shift();
  if (actions.length > 0) action(actions, page);
};

f.get("/", async (req, res) => {
  try {
    const page = await browser.newPage();
    // action(actions, page);
    await page.close();
    res.status(200).send("Acknowledged");
  } catch (e) {
    res.status(500).send(e);
  }
});

f.listen(process.env.PORT!, "0.0.0.0", async (err, add) => {
  browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox"],
  });
  if (err) {
    f.log.error(err);
    process.exit(1);
  }
  process.on("SIGINT", () => {
    console.log("Shutting down");
    browser.close();
  });
});
