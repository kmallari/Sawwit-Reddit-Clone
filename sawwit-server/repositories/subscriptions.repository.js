module.exports = (db) => {
  const subscriptionsRepository = {
    subscribeToSubreddit: (userId, subredditId, createdAt) => {
      return db.raw("CALL Subscribe(?, ?, ?)", [
        userId,
        subredditId,
        createdAt,
      ]);
    },
    unsubscribeFromSubreddit: (userId, subredditId, createdAt) => {
      return db.raw("CALL Unsubscribe(?, ?, ?)", [
        userId,
        subredditId,
        createdAt,
      ]);
    },
    getSubscriptions: (userId) => {
      return db.raw("CALL GetSubscriptions(?)", [userId]);
    },
  };
  return subscriptionsRepository;
};
