function elo(elo1, elo2, s1, s2){
    var K = 32

    var r1 = Math.pow(10, elo1/Math.abs(elo1-elo2))
    var r2 = Math.pow(10, elo2/Math.abs(elo1-elo2))

    var e1 = r1 / (r1 + r2)
    var e2 = r2 / (r1 + r2)

    var rp1 = elo1 + K * (s1 - e1)
    var rp2 = elo2 + K * (s2 - e2)

    return K * (s1 - e1)
}

module.exports = elo