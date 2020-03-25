const newCostumeNames = [];

/**
 * Add name of new costume added by the user.
 * @param {string} assetName - Name of the asset
 */
const addNewCostumeName = function (assetName) {
    newCostumeNames.push(assetName);
};

module.exports = {
    newCostumeNames,
    addNewCostumeName
};
