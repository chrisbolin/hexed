export function getHashId() {
  return parseInt(location.hash.split('#')[1]);
}

export function setHashId(hashId) {
  return location.hash = hashId;
}