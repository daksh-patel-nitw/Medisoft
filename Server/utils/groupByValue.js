export  const groupByValueMedicines = (items, key, fieldsToExtract = []) => {
    const pendingMedicines = []; // For "P"
    const completedMedicines = []; // For "C" or "D"
    
    const grouped = {};

    items.forEach(item => {
        const groupKey = item[key];

        if (!grouped[groupKey]) {
            grouped[groupKey] = {
                [key]: groupKey,
                Medicines: []
            };

            // Extract fields only once
            fieldsToExtract.forEach(field => {
                grouped[groupKey][field] = item[field];
            });
        }

        // Create a new object without extracted fields
        const filteredItem = { ...item };
        fieldsToExtract.forEach(field => delete filteredItem[field]);
        delete filteredItem[key]; // Remove grouping key from individual items

        grouped[groupKey].Medicines.push(filteredItem);
    });

    // Separate based on status
    Object.values(grouped).forEach(group => {
        if (group.Medicines.every(med => med.status === "P")) {
            pendingMedicines.push(group);
        } else {
            completedMedicines.push(group);
        }
    });

    return [pendingMedicines, completedMedicines]; // Return as an array of two groups
};
