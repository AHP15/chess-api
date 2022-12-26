
export const toggleToken = (token) => {
  const lastIndexOfDot = token.split('').findLastIndex(char => char === '.');
  const signature = token.slice(lastIndexOfDot).split('');
  const FakeChars = String('FAKE').split('');

  let newToken = token.slice(0, lastIndexOfDot);

  FakeChars.forEach(char => {
    for (let i = 0; i < signature.length; i++) {
      if (char === signature[i]) {
        signature[i] = signature[i].toLowerCase();
      } else if (char.toLowerCase() === signature[i]) {
        signature[i] = signature[i].toUpperCase();
      }
    }
  });

  newToken += signature.join('');
  return newToken;
};