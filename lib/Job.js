"use strict";

let _ = require('lodash')

class Job {
    constructor(code, timeoutMs, cb, v3, data) {
        this.code = code
        this.cb = cb || _.noop
        this.timeoutMs = timeoutMs
        this.v3 = v3
        this.data = data
    }
}

module.exports = Job
