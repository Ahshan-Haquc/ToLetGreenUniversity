function ratingCalculate(like, dislike) {
    const totalReaction = like + dislike;
    const likeRatio = like / totalReaction;
    const rating = (likeRatio * 4) + 1;
    const formattedRating = parseFloat(rating.toFixed(1)); //mane eita dosomiker por akta digit rakhbe like 4.2
    return formattedRating;
}

module.exports = ratingCalculate;
