module.exports = (subscriptionsRepository) => {
  const subscriptionController = {
    subscribeToSubreddit: (req, res) => {
      new Promise((resolve, reject) => {
        const { userId, subredditId } = req.body;
        if (!userId || !subredditId) {
          reject({
            status: 404,
            error: { message: "Missing parameters." },
          });
        } else {
          subscriptionsRepository
            .subscribeToSubreddit(userId, subredditId, Date.now())
            .then(() => {
              resolve();
            })
            .catch(() => {
              reject({
                status: 400,
                error: { message: "Subscription failed." },
              });
            });
        }
      })
        .then(() => {
          res.status(200).json({
            userId: userId,
            subredditId: subredditId,
            message: "Subscription successful.",
          });
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },
    unsubscribeFromSubreddit: (req, res) => {
      new Promise((resolve, reject) => {
        const { userId, subredditId } = req.body;
        if (!userId || !subredditId) {
          reject({
            status: 404,
            error: { message: "Missing parameters." },
          });
        } else {
          subscriptionsRepository
            .unsubscribeFromSubreddit(userId, subredditId, Date.now())
            .then(() => {
              resolve();
            })
            .catch(() => {
              reject({
                status: 400,
                error: { message: "Unsubscription failed." },
              });
            });
        }
      })
        .then(() => {
          res.status(200).json({
            userId: userId,
            subredditId: subredditId,
            message: "Unsubscription successful.",
          });
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },
    getUserSubscriptions: (req, res) => {
      new Promise((resolve, reject) => {
        const { userId } = req.body;
        if (!userId) {
          reject({
            status: 404,
            error: { message: "Missing parameters." },
          });
        } else {
          subscriptionsRepository
            .getSubscriptions(userId)
            .then((subscriptions) => {
              resolve(subscriptions);
            })
            .catch(() => {
              reject({
                status: 400,
                error: { message: "Failed to get subscriptions." },
              });
            });
        }
      })
        .then((subscriptions) => {
          res.status(200).json(subscriptions);
        })
        .catch((error) => {
          res.status(error.status).json(error.error);
        });
    },
  };
  return subscriptionController;
};
