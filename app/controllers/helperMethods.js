/**
  * This class contians functions used in many controllers.
  */
const HelperMethod = {

  /**
    * This method filters documents based on access rights
    *
    * @param {Object} req
    * @param {Object} docs
    * @returns {Boolean} true or false
    */
  filterDocs(req, docs) {
    let documents = docs;
    if (!Array.isArray(docs)) {
      documents = [docs];
    }
    return documents.filter((document) => {
      const isPublic = document.public;
      const isAdmin = req.decoded && req.decoded.id === 1;
      const isOwner = req.decoded && req.decoded.id === document.ownerId;

      return isPublic || isAdmin || isOwner;
    });
  }

};

module.exports = HelperMethod;
