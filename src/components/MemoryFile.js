/**
 * Created by godsong on 16/6/30.
 */

const Crypto = require('crypto');
const Config = require('./Config');
const Url = require('url');
const Qs = require('querystring');
let _memoryFileMap = {};
class MemoryFile {
    static get(name) {
        return _memoryFileMap[name];
    }

    static dump() {
        return Object.keys(_memoryFileMap);
    }

    constructor(fileName, content) {
        //fixme ugly! your_current_ip playground default bundle url
        let rHttpHeader = /^https?:\/\/(?!.*your_current_ip)/i;
        if (rHttpHeader.test(fileName)) {
            this.name = fileName.replace(rHttpHeader, '');
            let query = Qs.parse(Url.parse(this.name).query);
            if (query['_wx_tpl']) {
                this.url = query['_wx_tpl'];
                this.name = this.url.replace(rHttpHeader, '');
            }
            else {
                this.url = fileName;
            }
        }
        else this.name = fileName;
        var md5 = Crypto.createHash('md5');
        md5.update(content);
        var md5Str = md5.digest('hex');
        var key = this.name.split('?')[0] + '|' + md5Str;
        if (_memoryFileMap[this.name]) {
            _memoryFileMap[this.name].content = content;
            return _memoryFileMap[this.name];
        }
        else if (_memoryFileMap[key]) {
            _memoryFileMap[key].content = content;
            return _memoryFileMap[key];
        }
        else
            this.content = content;
        this.md5 = md5Str;
        _memoryFileMap[this.name] = this;
        _memoryFileMap[key] = this;
    }

    getContent() {
        return this.content;
    }

    getUrl() {
        return '/source/' + this.name;
    }
}
module.exports = MemoryFile;