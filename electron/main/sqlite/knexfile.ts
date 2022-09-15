import { homedir } from "os";
import { join } from "path";
import { knex } from "knex";
import type { Knex } from "knex";
import { logger } from "../../winston";
import { stat } from "fs";
import pkg from "../../../package.json";

export const appDirectory = join(homedir(), pkg.name);

stat(appDirectory, (err) => {
  if (err) logger.error(pkg.name + " folder not found");
  else logger.info(pkg.name + " folder found");
});

const config: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: join(appDirectory, "storage.db"),
  },
  useNullAsDefault: true,
};

export const db = knex(config);

db.schema.hasTable("users").then((exists) => {
  if (!exists) {
    logger.warn("Users table not found. creating...");
    db.schema
      .createTable("users", (table) => {
        table.increments();
        table.string("username").notNullable().unique();
        table.string("password").notNullable();
        table.boolean("access").defaultTo("partial");
      })
      .then(() => {
        logger.info("Users table created successfully.");
        db("users")
          .insert([
            {
              username: "master",
              password: "master",
              access: "full",
            },
          ])
          .then(() => logger.info("Default user created successfully"))
          .catch((err) => logger.error("Failed creating default user. reason : " + err.message));
      })
      .catch((err) => logger.error("Failed creating users table. reason : " + err.message));
  } else {
    logger.info("Users table already exists. not creating new one.");
  }
});
