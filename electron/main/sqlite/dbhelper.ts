import { logger } from "../../winston";
import { db } from "./knexfile";

// Init database
db.queryBuilder();

export const getUsers = () => {
  return new Promise((resolve, reject) => {
    db("users")
      .select("*")
      .then((rows) => {
        logger.info("Fetched users data. data count: " + rows.length);
        resolve(rows);
      })
      .catch((err) => {
        logger.error("Failed fetching users data. reason : " + err.message);
        reject(err);
      });
  });
};