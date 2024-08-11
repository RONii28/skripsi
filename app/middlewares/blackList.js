const blacklistedTokens = [];

function addToBlacklist(token) {
  blacklistedTokens.push(token);
}

function isTokenBlacklisted(token) {
  return blacklistedTokens.includes(token);
}

module.exports = {
  addToBlacklist,
  isTokenBlacklisted,
};
