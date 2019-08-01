makeHash = function(input) {
    var hash = 0, i, char;
    if (input.length === 0) 
        return hash;

    for (i = 0; i < input.length; i++) {
      char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
};