export const validateEmail = (email) => {
    const Regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return Regex.test(email);
};  // A function to validate an email address using a regular expression.

export const getInitials = (name) => {
    if (!name) return "";

    const words = name.split(" ");
    let initials = "";

    for(let i = 0; i < Math.min(words.length,2); i++) {
        initials += words[i][0];
    }

    return initials.toUpperCase();
};

export const getEmptyCardMessage = (filterType) => {
    switch(filterType) {
        case "search":
            return "Oops ! No stories found matching your search.";
        case "date":
            return "No stories found in the given date range.";
        default:
            return "Start creating your first Story! Click the 'Add Story' button to " +
            "record your thoughts, ideas, and memories. Let's get started!";
    }
};
