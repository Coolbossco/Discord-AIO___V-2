const fs = require('fs');
const blockedPath = './support_blocked_users.json';

// Function to read blocked users
const readBlockedUsers = () => {
    if (!fs.existsSync(blockedPath)) {
        fs.writeFileSync(blockedPath, JSON.stringify({}, null, 4));
    }

    return JSON.parse(fs.readFileSync(blockedPath, 'utf-8'));
};

// Function to write blocked users
const writeBlockedUsers = (data) => {
    fs.writeFileSync(blockedPath, JSON.stringify(data, null, 4));
};

// Function to check if user is blocked
const isBlocked = (userId) => {
    const blockedUsers = readBlockedUsers();
    const userBlockedData = blockedUsers[userId];

    if (!userBlockedData) {
        return false;
    }

    if (userBlockedData.permanent || (userBlockedData.until > Date.now())) {
        return true;
    }

    // If blocked time is over, unblock user
    delete blockedUsers[userId];
    writeBlockedUsers(blockedUsers);
    return false;
};

module.exports = {
    readBlockedUsers,
    writeBlockedUsers,
    isBlocked
};
