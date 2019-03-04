const starAssets = require.context('../images/yelp_assets/stars/web_and_ios/large/', true);

// Random number generator
export function getRandomNumber(max, min) {
  return Math.floor(Math.random() * (max - min) + min);
}

// Maps numerical rating to corresponding star image
export function getStarAssetSrc(rating) {
  let fileName;
  if (rating - Math.floor(rating) !== 0) {
    fileName = `${Math.floor(rating)}_half`;
  } else {
    fileName = rating;
  }
  return starAssets(`./large_${fileName}.png`);
}
