

export const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const isValidAmount = (amount: string): boolean => {
    try {
        const value = parseFloat(amount);
        return value > 0 && !isNaN(value);
    } catch {
        return false;
    }
};

export const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const isValidDeadline = (date: string): boolean => {
    const deadline = new Date(date);
    const now = new Date();
    return deadline > now;
};