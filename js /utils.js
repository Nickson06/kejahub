// ==========================================
// KEJAHUB UTILITIES
// ==========================================

const Utils = {

    properties() {

        return Storage.getProperties();

    },

    featured() {

        return Storage
            .getProperties()
            .filter(property => property.featured);

    },

    latest(limit = 6) {

        return Storage
            .getProperties()
            .sort((a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
            )
            .slice(0, limit);

    },

    property(id) {

        return Storage
            .getProperties()
            .find(property => property.id === id);

    },

    estates() {

        return [...new Set(

            Storage
                .getProperties()
                .map(property => property.estate)

        )];

    }

};
