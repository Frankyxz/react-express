const { onSnapshot } = require("firebase/firestore");

const fetchData = (collectionRef) => async (req, res) => {
  try {
    const dataList = [];

    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dataList.push(...data);
      res.send(dataList);
    });

    res.on("finish", () => {
      unsubscribe();
    });
  } catch (error) {
    res.send(error);
  }
};

module.exports = { fetchData };
