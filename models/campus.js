const { getDb } = require("../db.js");

class InvalidInputError extends Error {}
class NotFoundError extends Error {}

async function getCampuses(limit = 10, offset = 0) {
  const db = await getDb();
  return Promise.all([
    db.all("SELECT * from campus LIMIT ? OFFSET ?", limit, offset),
    db.get("SELECT COUNT(*) as count from campus").then((res) => res.count)
  ]);
}

async function validateCampus({ name }) {
  if (typeof name !== "string" || name.length < 1 || name.length > 50)
    throw new InvalidInputError(
      "Campus name should be a string of 1 to 50 characters"
    );
}

async function createCampus({ name }) {
  await validateCampus({ name });
  const db = await getDb();
  return db.run("INSERT INTO campus (name) VALUES (?)", name).then((res) => ({
    id: res.lastID,
    name
  }));
}

async function getCampus(id) {
  const db = await getDb();
  return db
    .get("SELECT id, name FROM campus WHERE id = ?", id)
    .then((campus) => {
      if (!campus) throw new NotFoundError(`Campus with id ${id} not found.`);
      return campus;
    });
}

async function updateCampus(id, newProps) {
  await validateCampus({ name: newProps.name });

  const db = await getDb();
  const campus = await getCampus(id);
  return db
    .run("UPDATE campus SET name = ? WHERE id = ?", newProps.name, id)
    .then(() => ({
      ...campus,
      ...newProps
    }));
}

async function removeCampus(id) {
  const db = await getDb();
  return db.run("DELETE FROM campus WHERE id = ?", id).then((res) => {
    if (res.changes === 0) {
      throw new NotFoundError("Campus not found");
    }
  });
}

module.exports = {
  InvalidInputError,
  NotFoundError,
  getCampuses,
  getCampus,
  createCampus,
  updateCampus,
  removeCampus
};
