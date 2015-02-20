var App = App || {};

/**
 * A generic method for adding namespace to a global variable
 */
App.ns = function (ns) {
    var
        parts = ns.split('.'),
        parent = App,
        i;

    // strip leading global id exist
    if (parts[0] === "App") {
        parts = parts.slice(1);
    }

    for (i = 0; i < parts.length; i++) {
        // create a property if it doesn't exist
        if (typeof parent[parts[i]] === 'undefined') {
            parent[parts[i]] = {};
        }

        parent = parent[parts[i]];
    }

    return parent;
};