const fs = require('fs');
const configuration = require("./src/config.json");

const { main_color: mainColor, search_color: searchColor } = configuration;

const clasnames = [
  ...[
    `border-${mainColor}-400`,
    `dark:border-${mainColor}-800`,
    `hover:border-${mainColor}-200`,
    `dark:hover:border-${mainColor}-600`,
    `shadow-${mainColor}-400`,
    `dark:shadow-${mainColor}-700`,
    `bg-${mainColor}-100/[.9]`,
    `dark:bg-${mainColor}-900/[.9]`,
    `bg-${mainColor}-900/[.9]`,
    `border-${mainColor}-600`,
  ],
  ...[
    `border-${searchColor}-700`,
    `bg-${searchColor}-700`,
    `hover:bg-${searchColor}-800`,
    `dark:bg-${searchColor}-600`,
    `dark:hover:bg-${searchColor}-700`,
    `active:bg-${searchColor}-900`,
    `dark:active:bg-${searchColor}-800`,
  ],
];

fs.writeFile("src/styles/classes.txt", clasnames.join("\n"), (err: unknown) => {
  if (err) return console.error(err);
  console.info("creating classes file");
});
