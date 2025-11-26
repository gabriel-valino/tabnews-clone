import bcryptjs from "bcryptjs";
import crypto from "crypto";

async function hash(password) {
  const pepper = process.env.PEPPER_SECRET;
  const rounds = getNumberOfRounds();
  const hmac = crypto
    .createHmac("sha256", pepper)
    .update(password)
    .digest("hex");

  return await bcryptjs.hash(hmac, rounds);
}

function getNumberOfRounds() {
  let rounds = 1;

  if (process.env.NODE_ENV === "production") {
    rounds = 14;
  }

  return rounds;
}

async function compare(providedPassowrd, storedPassword) {
  const pepper = process.env.PEPPER_SECRET;
  const hmac = crypto
    .createHmac("sha256", pepper)
    .update(providedPassowrd)
    .digest("hex");

  return await bcryptjs.compare(hmac, storedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
