class Tax {
    static get taxesBasedOnAge () {
        return [
            {from: 18, to: 24, then: 1.1},
            {from: 25, to: 31, then: 1.5},
            {from: 32, to: 65, then: 1.3}
        ]
    }
}

module.exports = Tax