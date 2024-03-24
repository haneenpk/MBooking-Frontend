const addRow = (category) => {
    console.log(Object.entries(diamondRows)[0][1].length);
    let updatedRows;
    let newRow;
    let alphaLeng;
    let updatedGoldRows = { ...goldRows };
    let updatedSilverRows = { ...silverRows };
    let silverKeys
    let updateScreenData = { ...screenData };

    switch (category) {
        case 'diamond':
            newRow = String.fromCharCode(65 + Object.keys(diamondRows).length); // Get the next alphabet
            updatedRows = { ...diamondRows, [newRow]: Array.from({ length: Object.entries(diamondRows)[0][1].length }, (_, i) => i + 1) };
            setDiamondRows(updatedRows);

            updateScreenData.diamond.seats = updatedRows

            alphaLeng = 65 + Object.keys(diamondRows).length + 1;

            // Removing the first object in goldRows
            const goldKeys = Object.keys(updatedGoldRows);
            if (goldKeys.length > 0) {
                delete updatedGoldRows[goldKeys[0]];
            }

            // Removing the first object in silverRows
            silverKeys = Object.keys(updatedSilverRows);
            if (silverKeys.length > 0) {
                delete updatedSilverRows[silverKeys[0]];
            }

            for (let key in goldRows) {
                let alpha = String.fromCharCode(alphaLeng);
                updatedGoldRows[alpha] = goldRows[key];
                alphaLeng += 1;
            }

            for (let key in silverRows) {
                let alpha = String.fromCharCode(alphaLeng);
                updatedSilverRows[alpha] = silverRows[key];
                alphaLeng += 1;
            }

            setGoldRows(updatedGoldRows);
            setSilverRows(updatedSilverRows);

            updateScreenData.gold.seats = updatedGoldRows
            updateScreenData.silver.seats = updatedSilverRows

            setScreenData(updateScreenData)

            break;
        case 'gold':
            newRow = String.fromCharCode(65 + Object.keys(diamondRows).length + Object.keys(goldRows).length); // Get the next alphabet
            updatedRows = { ...goldRows, [newRow]: Array.from({ length: Object.entries(diamondRows)[0][1].length }, (_, i) => i + 1) };
            setGoldRows(updatedRows);

            updateScreenData.gold.seats = updatedRows

            alphaLeng = 65 + Object.keys(diamondRows).length + 1 + Object.keys(goldRows).length;
            updatedSilverRows = { ...silverRows };

            // Removing the first object in silverRows
            silverKeys = Object.keys(updatedSilverRows);
            if (silverKeys.length > 0) {
                delete updatedSilverRows[silverKeys[0]];
            }

            for (let key in silverRows) {
                let alpha = String.fromCharCode(alphaLeng);
                updatedSilverRows[alpha] = silverRows[key];
                alphaLeng += 1;
            }

            setSilverRows(updatedSilverRows);

            updateScreenData.silver.seats = updatedSilverRows

            setScreenData(updateScreenData)

            break;
        case 'silver':
            newRow = String.fromCharCode(65 + Object.keys(diamondRows).length + Object.keys(goldRows).length + Object.keys(silverRows).length); // Get the next alphabet
            updatedRows = { ...silverRows, [newRow]: Array.from({ length: Object.entries(diamondRows)[0][1].length }, (_, i) => i + 1) };
            setSilverRows(updatedRows);

            updateScreenData.silver.seats = updatedRows

            setScreenData(updateScreenData)

            break;
        default:
            break;
    }

};

const deleteRow = (category) => {
    let updatedRows;
    if (category === "diamond") {
        updatedRows = { ...diamondRows };
    } else if (category === "gold") {
        updatedRows = { ...goldRows };
    } else {
        updatedRows = { ...silverRows };
    }

    let lastKey = Object.keys(updatedRows)[Object.keys(updatedRows).length - 1].charCodeAt(0)

    delete updatedRows[Object.keys(updatedRows)[Object.keys(updatedRows).length - 1]];

    let updatedGoldRows = { ...goldRows };
    let updatedSilverRows = { ...silverRows };

    let alphaLeng;

    if (category === "diamond") {

        setDiamondRows(updatedRows);

        updateScreenData.diamond.seats = updatedRows

        alphaLeng = lastKey;

        for (let key in goldRows) {
            let alpha = String.fromCharCode(alphaLeng);
            updatedGoldRows[alpha] = goldRows[key];
            delete updatedGoldRows[key];
            alphaLeng += 1;
        }

        for (let key in silverRows) {
            let alpha = String.fromCharCode(alphaLeng);
            updatedSilverRows[alpha] = silverRows[key];
            delete updatedSilverRows[key];
            alphaLeng += 1;
        }

        setGoldRows(updatedGoldRows);
        setSilverRows(updatedSilverRows);

        updateScreenData.gold.seats = updatedGoldRows
        updateScreenData.silver.seats = updatedSilverRows

        setScreenData(updateScreenData)

    } else if (category === "gold") {

        setGoldRows(updatedRows);

        updateScreenData.gold.seats = updatedRows

        alphaLeng = lastKey;

        for (let key in silverRows) {
            let alpha = String.fromCharCode(alphaLeng);
            updatedSilverRows[alpha] = silverRows[key];
            delete updatedSilverRows[key];
            alphaLeng += 1;
        }

        setSilverRows(updatedSilverRows);

        updateScreenData.silver.seats = updatedSilverRows

        setScreenData(updateScreenData)

    } else {
        setSilverRows(updatedRows);

        updateScreenData.silver.seats = updatedRows

        setScreenData(updateScreenData)
    }
};